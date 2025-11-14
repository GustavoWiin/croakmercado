// pages/api/session-token.js
import axios from "axios";
import crypto from "crypto";
import { promises as dns } from "dns";
import { encryptUrl } from "../../lib/crypto";

// ====== Config ======
const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_KEY || process.env.ABUSE_IPDB_KEY;
const DEBUG = true;

// Scoring weights (tweak to taste)
const WEIGHTS = {
  HOSTING_ASN: 35,
  RDNS_DC: 20,
  TOR: 80,
  HEADERS_SUS: 10,      // per header issue (Via, long XFF, bot UA)
  GEO_MISMATCH: 15,
  VPN_CIDR_HIT: 30,
  ABUSEIPDB25: 25,      // AbuseIPDB score bucket >=25
  ABUSEIPDB75: 45,      // AbuseIPDB score bucket >=75
  STOPFORUMSPAM: 35,
  RDNS_MISSING: 5,      // tiny bump for no PTR / ENOTFOUND
  LOC_HOSTING: 30,      // ip-api hosting=true
  LOC_PROXY: 20,        // ip-api proxy=true
};

// -------- Locale policy (HARD FILTERS) --------
const ALLOWED_LANGS = new Set(["pt", "pt-br"]); // add "pt-pt" if you want EU Portuguese too
const REQUIRED_COUNTRY = "BR";

function parseAcceptLanguage(header = "") {
  return String(header)
    .split(",")
    .map((part) => {
      const [tag, ...rest] = part.trim().split(";");
      const q = rest.find((p) => p.trim().startsWith("q="));
      const qv = q ? parseFloat(q.split("=")[1]) : 1;
      return { tag: tag.toLowerCase(), q: isNaN(qv) ? 1 : qv };
    })
    .filter((x) => x.tag)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}
function isLangAllowed(acceptLanguageHeader) {
  const tags = parseAcceptLanguage(acceptLanguageHeader);
  return tags.some((t) => ALLOWED_LANGS.has(t));
}
// Prefer CF-IPCountry header, then ip-api (c2), then ipinfo (c1)
function deriveCountry(req, geo) {
  const cf = String(req.headers["cf-ipcountry"] || "").toUpperCase();
  const c2 = (geo?.c2 || "").toUpperCase();
  const c1 = (geo?.c1 || "").toUpperCase();
  return cf || c2 || c1 || "";
}

// Classification thresholds
const THRESH = { RES: 30, GRAY: 60 };

// ====== In-memory cache (Vercel runtime-safe) ======
const cache = new Map(); // key -> { data, exp }
function setCache(key, data, ttlMs) { cache.set(key, { data, exp: Date.now() + ttlMs }); }
function getCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.exp) { cache.delete(key); return null; }
  return hit.data;
}

// ====== IPv4 helpers (CIDR) ======
function isIPv4(ip) { return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip); }
function ipToInt(ip) {
  if (!isIPv4(ip)) return null;
  return ip.split(".").reduce((acc, p) => (acc << 8) + (p >>> 0), 0) >>> 0;
}
function cidrMatchIPv4(ip, cidr) {
  if (!cidr.includes("/")) return false;
  const [base, bitsStr] = cidr.split("/");
  const bits = parseInt(bitsStr, 10);
  const ipInt = ipToInt(ip);
  const baseInt = ipToInt(base);
  if (ipInt == null || baseInt == null || isNaN(bits)) return false;
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

// ====== Bot ranges (Googlebot IPs, Tor exits, Spamhaus DROP) with caching ======
let cachedRanges = null;
let lastRangesAt = 0;
async function getBotRanges() {
  const now = Date.now();
  if (cachedRanges && now - lastRangesAt < 6 * 60 * 60 * 1000) return cachedRanges;
  try {
    const [google, tor, spamhaus] = await Promise.all([
      axios.get("https://developers.google.com/search/apis/ipranges/googlebot.json", { timeout: 5000 }),
      axios.get("https://check.torproject.org/exit-addresses", { timeout: 5000 }),
      axios.get("https://www.spamhaus.org/drop/drop.lasso", { timeout: 5000 }),
    ]);

    const cidrs = new Set();
    const ips = new Set();

    if (google.data?.prefixes) {
      for (const p of google.data.prefixes) {
        if (p.ipv4Prefix) cidrs.add(p.ipv4Prefix);
        // (Add IPv6 support later if desired: p.ipv6Prefix)
      }
    }

    if (typeof tor.data === "string") {
      tor.data
        .split("\n")
        .filter((l) => l.startsWith("ExitAddress"))
        .forEach((l) => ips.add(l.split(" ")[1]));
    }

    if (typeof spamhaus.data === "string") {
      spamhaus.data
        .split("\n")
        .filter((l) => l && !l.startsWith(";"))
        .forEach((l) => cidrs.add(l.split(";")[0].trim()));
    }

    cachedRanges = { cidrs, ips };
    lastRangesAt = now;
    if (DEBUG) console.log(`☑️ Loaded ranges: ${cidrs.size} CIDRs, ${ips.size} IPs`);
    return cachedRanges;
  } catch (err) {
    if (DEBUG) console.warn("⚠️ Failed to fetch bot ranges:", err.message);
    return { cidrs: new Set(), ips: new Set() };
  }
}

// ====== rDNS (PTR) ======
async function reverseDNS(ip) {
  const ck = `ptr:${ip}`;
  const cached = getCache(ck);
  if (cached !== null) return cached;
  try {
    const hosts = await dns.reverse(ip);
    const host = hosts?.[0] || null;
    setCache(ck, host, 6 * 60 * 60 * 1000);
    return host;
  } catch {
    setCache(ck, null, 6 * 60 * 60 * 1000);
    return null;
  }
}
function isDataCenterHost(hostname) {
  if (!hostname) return false;
  return /amazonaws|ovh|digitalocean|vultr|linode|hetzner|contabo|azure|googleusercontent|akamaitechnologies|cloudflare|scaleway|leaseweb|servers|colo|datacenter/i.test(
    hostname
  );
}

// ====== Tor (DNS method) ======
async function isTorDNS(ip) {
  if (!isIPv4(ip)) return false;
  const ck = `tor:${ip}`;
  const cached = getCache(ck);
  if (cached !== null) return cached;
  try {
    const rev = ip.split(".").reverse().join(".");
    const a = await dns.resolve4(`${rev}.dnsel.torproject.org`);
    const hit = Array.isArray(a) && a.includes("127.0.0.2");
    setCache(ck, hit, 60 * 60 * 1000);
    return hit;
  } catch {
    setCache(ck, false, 60 * 60 * 1000);
    return false;
  }
}

// ====== Header heuristics ======
function headerSignals(req) {
  let score = 0;
  const ua = String(req.headers["user-agent"] || "");
  const via = req.headers["via"];
  const xff = String(req.headers["x-forwarded-for"] || "");
  const badUA = /(googlebot|adsbot|mediapartners|crawler|spider|facebook|bingbot|python|curl|wget|headless|phantomjs|node)/i;

  if (via) score += WEIGHTS.HEADERS_SUS;
  if (xff && xff.split(",").length > 2) score += WEIGHTS.HEADERS_SUS;
  if (!ua || badUA.test(ua)) score += WEIGHTS.HEADERS_SUS;

  return { score, via: !!via, longXFF: xff.split(",").length > 2, badUA: !!ua && badUA.test(ua) };
}

// ====== Geo cross-check (ipinfo + ip-api) ======
async function geoCompareRisk(ip) {
  const ck = `geo:${ip}`;
  const cached = getCache(ck);
  if (cached !== null) return cached;

  let c1 = null, c2 = null, org = null, hosting = false, proxy = false;
  try {
    const info = await axios.get(`https://ipinfo.io/${encodeURIComponent(ip)}/json`, { timeout: 3000 });
    c1 = (info.data?.country || "").toUpperCase();
    org = String(info.data?.org || "");
  } catch {}
  try {
    const ipapi = await axios.get(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,as,isp,proxy,hosting`,
      { timeout: 3000 }
    );
    if (ipapi.data?.status === "success") {
      c2 = (ipapi.data?.countryCode || "").toUpperCase();
      hosting = Boolean(ipapi.data?.hosting);
      proxy   = Boolean(ipapi.data?.proxy);
    }
  } catch {}

  let risk = 0;
  if (c1 && c2 && c1 !== c2) risk += WEIGHTS.GEO_MISMATCH;
  // quick DC hint if org looks like a cloud/hosting provider
  if (org && /amazon|google|microsoft|cloudflare|hetzner|ovh|digitalocean|vultr|linode|contabo|m247|leaseweb|scaleway|akamai|choopa|hostdime|dimenoc|colo|datacenter/i.test(org)) {
    risk += Math.floor(WEIGHTS.HOSTING_ASN / 2);
  }
  const out = { risk, c1, c2, org, hosting, proxy };
  setCache(ck, out, 60 * 60 * 1000);
  return out;
}

// ====== ASN/hosting via ipinfo (quick fingerprint) ======
async function asnHostingFlag(ip) {
  const ck = `asn:${ip}`;
  const cached = getCache(ck);
  if (cached !== null) return cached;
  try {
    const info = await axios.get(`https://ipinfo.io/${encodeURIComponent(ip)}/json`, { timeout: 3000 });
    const org = String(info.data?.org || "").toLowerCase();
    // include HostDime/DimeNOC and friends
    const hit = /google|facebook|meta|amazon|microsoft|digitalocean|linode|vultr|ovh|gigenet|cloudflare|hetzner|contabo|scaleway|leaseweb|akamai|m247|choopa|hostdime|dimenoc|colo|datacenter/.test(org);
    const out = { isHosting: hit, org };
    setCache(ck, out, 2 * 60 * 60 * 1000);
    return out;
  } catch {
    const out = { isHosting: false, org: "" };
    setCache(ck, out, 30 * 60 * 1000);
    return out;
  }
}

// ====== AbuseIPDB ======
async function abuseScore(ip) {
  if (!ABUSEIPDB_API_KEY) return { score: null, usageType: null, reason: "no_key" };
  const ck = `abuse:${ip}`;
  const cached = getCache(ck);
  if (cached !== null) return cached;
  try {
    const res = await axios.get("https://api.abuseipdb.com/api/v2/check", {
      headers: { Accept: "application/json", Key: ABUSEIPDB_API_KEY },
      params: { ipAddress: ip, maxAgeInDays: 90 },
      timeout: 4000,
    });
    const score = res.data?.data?.abuseConfidenceScore ?? null;
    const usageType = res.data?.data?.usageType ?? null;
    const out = { score, usageType };
    setCache(ck, out, 6 * 60 * 60 * 1000);
    return out;
  } catch (err) {
    if (DEBUG) console.warn("⚠️ AbuseIPDB lookup failed:", err?.response?.status || err.message);
    return { score: null, usageType: null, error: true };
  }
}

// ====== StopForumSpam ======
async function stopForumSpam(ip) {
  const ck = `sfs:${ip}`;
  const cached = getCache(ck);
  if (cached !== null) return cached;
  try {
    const res = await axios.get(`https://api.stopforumspam.org/api?ip=${encodeURIComponent(ip)}&json`, { timeout: 4000 });
    const appears = Number(res.data?.appears ?? res.data?.ip?.appears) === 1;
    const out = { appears };
    setCache(ck, out, 12 * 60 * 60 * 1000);
    return out;
  } catch {
    return { appears: false, error: true };
  }
}

// ====== IP extraction ======
function extractClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "0.0.0.0";
  return String(ip).replace(/^::ffff:/, "");
}

// ===== [ADICIONADO] Utilitário para obter a query string da requisição =====
function getIncomingQuery(req) {
  try {
    const url = new URL(req.url, "http://localhost");
    return url.search || "";
  } catch {
    return "";
  }
}

// ====== Main handler ======
export default async function handler(req, res) {
  try {
    const ip = extractClientIp(req);
    if (DEBUG) console.log("🔍 Client IP:", ip);
    const details = { ip };
    let score = 0;

    // Headers
    const hdr = headerSignals(req);
    score += hdr.score;
    details.headers = hdr;

    // rDNS
    const ptr = await reverseDNS(ip);
    details.rdns = ptr || null;
    if (!ptr) score += WEIGHTS.RDNS_MISSING;
    if (isDataCenterHost(ptr)) score += WEIGHTS.RDNS_DC;

    // ASN/Hosting
    const asn = await asnHostingFlag(ip);
    details.asn = asn;
    if (asn.isHosting) score += WEIGHTS.HOSTING_ASN;

    // Tor checks (DNS + bulk/exit list)
    const [dnsTor, ranges] = await Promise.all([isTorDNS(ip), getBotRanges()]);
    const inTorBulk = ranges.ips.has(ip);
    details.tor = { dns: dnsTor, bulk: inTorBulk };
    if (dnsTor || inTorBulk) score += WEIGHTS.TOR;

    // Spamhaus/Googlebot CIDR (IPv4 only)
    const vpnCidrHit =
      isIPv4(ip) && [...ranges.cidrs].some((cidr) => cidrMatchIPv4(ip, cidr));
    details.rangeHits = { cidrHit: !!vpnCidrHit, ipHit: ranges.ips.has(ip) };
    if (vpnCidrHit) score += WEIGHTS.VPN_CIDR_HIT;

    // Geo cross-check + Loc flags
    const geo = await geoCompareRisk(ip);
    details.geo = geo;
    score += geo.risk || 0;
    if (geo.hosting) score += WEIGHTS.LOC_HOSTING; // Loc Test signal
    if (geo.proxy)   score += WEIGHTS.LOC_PROXY;   // Loc Test signal

    // ===== Locale Policy Gate (HARD FILTERS) =====
    const country = deriveCountry(req, geo);      // CF-IPCountry -> ip-api -> ipinfo
    details.country = country;
    const acceptLang = String(req.headers["accept-language"] || "");
    details.acceptLanguage = acceptLang;

    if (country !== REQUIRED_COUNTRY) {
      if (DEBUG) console.log("🌎 Blocked by country policy:", country);
      return res.status(403).json({
        success: false,
        message: "Região não permitida. Apenas Brasil.",
      });
    }
    if (!isLangAllowed(acceptLang)) {
      if (DEBUG) console.log("🈶 Blocked by language policy:", acceptLang);
      return res.status(403).json({
        success: false,
        message: "Idioma não permitido. Use Português do Brasil.",
      });
    }

    // AbuseIPDB
    const abuse = await abuseScore(ip);
    details.abuse = abuse;
    if (typeof abuse.score === "number") {
      if (abuse.score >= 75) score += WEIGHTS.ABUSEIPDB75;
      else if (abuse.score >= 25) score += WEIGHTS.ABUSEIPDB25;
    }
    if (typeof abuse.usageType === "string" && /data\s*center|web\s*hosting|hosting|vpn|proxy|transit/i.test(abuse.usageType)) {
      score += Math.floor(WEIGHTS.HOSTING_ASN / 2);
    }

    // StopForumSpam
    const sfs = await stopForumSpam(ip);
    details.stopforumspam = sfs;
    if (sfs.appears) score += WEIGHTS.STOPFORUMSPAM;

    // Final classification
    const classification =
      score > THRESH.GRAY ? "likely_proxy_vpn" :
      score > THRESH.RES  ? "unclear" :
                             "likely_residential";

    details.score = Math.min(score, 100);
    details.classification = classification;

    if (DEBUG) console.log("🧮 Score:", details.score, classification);

    // Decision gate
    if (classification === "likely_proxy_vpn") {
      if (DEBUG) console.log("❌ FINAL BLOCK:", ip);
      return res.status(403).json({
        success: false,
        message: "Resposta incorreta. Tente novamente.",
        // debug: details, // (optional) expose temporarily during testing
      });
    }

    // ✅ ALLOW HUMANS
    const realUrl = "https://www.consultarseunome.top/f2/";
    // ===== [MANTIDO] Anexa a MESMA querystring da requisição ao destino real
    const incomingQS = getIncomingQuery(req); // ex: "?utm_source=...&gclid=..."
    const realUrlWithQuery = realUrl.replace(/\?$/, "") + (incomingQS || "");

    const sessionId = crypto.randomUUID();
    const timestamp = Date.now();
    const payload = JSON.stringify({ realUrl: realUrlWithQuery, sessionId, timestamp });
    const token = encryptUrl(payload);

    if (DEBUG) console.log("✅ FINAL PASS:", ip, "score:", details.score);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("API Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Erro ao gerar token" });
  }
}
