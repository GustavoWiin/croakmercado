import axios from "axios";
import { promises as dns } from "dns";

const ABUSEIPDB_KEY = process.env.ABUSEIPDB_KEY;

// ------------------------- utils: timing + safe GET -------------------------
async function timedGet(label, url, cfg = {}) {
  const t0 = Date.now();
  try {
    const res = await axios.get(url, { timeout: 5000, ...cfg });
    return { ok: true, ms: Date.now() - t0, status: res.status, data: res.data };
  } catch (err) {
    const status = err?.response?.status || null;
    const data = err?.response?.data || err.message;
    return { ok: false, ms: Date.now() - t0, status, error: data };
  }
}

// ------------------------- IPv4 CIDR helpers -------------------------
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

// ------------------------- Bot ranges cache -------------------------
let cachedBotRanges = null; // { cidrs: Set<string>, ips: Set<string>, fetchErrors: {...} }
let lastUpdate = 0;

async function getBotRanges() {
  const now = Date.now();
  if (cachedBotRanges && now - lastUpdate < 6 * 60 * 60 * 1000) return cachedBotRanges;

  const [google, tor, spamhaus] = await Promise.all([
    timedGet("google", "https://developers.google.com/search/apis/ipranges/googlebot.json"),
    timedGet("tor", "https://check.torproject.org/exit-addresses"),
    timedGet("spamhaus", "https://www.spamhaus.org/drop/drop.lasso"),
  ]);

  const cidrs = new Set();
  const ips = new Set();

  if (google.ok && google.data?.prefixes) {
    for (const p of google.data.prefixes) {
      if (p.ipv4Prefix) cidrs.add(p.ipv4Prefix);
      // (add IPv6 support later if you need)
    }
  }

  if (tor.ok && typeof tor.data === "string") {
    tor.data
      .split("\n")
      .filter((l) => l.startsWith("ExitAddress"))
      .forEach((l) => ips.add(l.split(" ")[1]));
  }

  if (spamhaus.ok && typeof spamhaus.data === "string") {
    spamhaus.data
      .split("\n")
      .filter((l) => l && !l.startsWith(";"))
      .forEach((l) => cidrs.add(l.split(";")[0].trim()));
  }

  cachedBotRanges = {
    cidrs, ips,
    fetchErrors: {
      google: google.ok ? null : { status: google.status, error: google.error },
      tor: tor.ok ? null : { status: tor.status, error: tor.error },
      spamhaus: spamhaus.ok ? null : { status: spamhaus.status, error: spamhaus.error },
    }
  };
  lastUpdate = now;
  return cachedBotRanges;
}

// ------------------------- rDNS + Tor DNS -------------------------
async function reverseDNS(ip) {
  try {
    const hosts = await dns.reverse(ip);
    return { ok: true, host: hosts?.[0] || null };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

async function isTorDNS(ip) {
  if (!isIPv4(ip)) return { ok: true, tor: false, note: "Tor DNS check is IPv4-only" };
  try {
    const rev = ip.split(".").reverse().join(".");
    const a = await dns.resolve4(`${rev}.dnsel.torproject.org`);
    return { ok: true, tor: Array.isArray(a) && a.includes("127.0.0.2") };
  } catch {
    return { ok: true, tor: false };
  }
}

// ------------------------- handler -------------------------
export default async function handler(req, res) {
  const { ip } = req.query;
  if (!ip) return res.status(400).json({ error: "Missing ?ip=" });

  const out = {
    ip,
    summary: { flaggedBy: [], passedBy: [] },
    details: {},
    notes: [],
  };

  // 0) rDNS
  const rdns = await reverseDNS(ip);
  out.details.rdns = rdns;
  if (rdns.ok && rdns.host) {
    out.summary.passedBy.push(`rDNS: ${rdns.host}`);
  } else if (!rdns.ok) {
    // Soft flag: many DC/VPN IPs lack PTR
    out.summary.flaggedBy.push("rDNS: ENOTFOUND (no PTR)");
    out.notes.push(`rDNS error: ${rdns.error}`);
  }

  // 1) ASN/hosting (ipinfo)
  const ipinfo = await timedGet("ipinfo", `https://ipinfo.io/${encodeURIComponent(ip)}/json`);
  out.details.ipinfo = ipinfo;
  if (ipinfo.ok) {
    const org = (ipinfo.data?.org || "").toLowerCase();
    // widened DC/VPN keywords incl. hostdime/dimenoc (+ others)
    const dc = /google|facebook|meta|amazon|microsoft|digitalocean|linode|vultr|ovh|gigenet|cloudflare|hetzner|contabo|scaleway|leaseweb|akamai|m247|choopa|hostdime|dimenoc|colo|datacenter/.test(org);
    if (dc) out.summary.flaggedBy.push(`ASN/ORG: ${org}`);
    else out.summary.passedBy.push("ASN OK");
  } else {
    out.notes.push(`ipinfo failed (${ipinfo.status}): ${JSON.stringify(ipinfo.error).slice(0,200)}`);
  }

  // 1.5) Loc Test (ip-api hosting/proxy flags)
  const ipapi = await timedGet(
    "ipapi",
    `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,as,isp,proxy,hosting,mobile,anycast`
  );
  out.details.ipapi = ipapi;
  if (ipapi.ok && ipapi.data?.status === "success") {
    const hosting = Boolean(ipapi.data.hosting);
    const proxy   = Boolean(ipapi.data.proxy);
    if (hosting) out.summary.flaggedBy.push("Loc: hosting=true (ip-api)");
    if (proxy)   out.summary.flaggedBy.push("Loc: proxy=true (ip-api)");
    if (!hosting && !proxy) out.summary.passedBy.push("Loc: no proxy/hosting flags");
  } else if (!ipapi.ok) {
    out.notes.push(`ip-api failed (${ipapi.status}): ${JSON.stringify(ipapi.error).slice(0,200)}`);
  }

  // 2) AbuseIPDB
  if (!ABUSEIPDB_KEY) {
    out.notes.push("No ABUSEIPDB_KEY set — skipping AbuseIPDB");
  } else {
    const abuse = await timedGet(
      "abuseipdb",
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`,
      { headers: { Key: ABUSEIPDB_KEY, Accept: "application/json" } }
    );
    out.details.abuseipdb = abuse;
    if (abuse.ok) {
      const score = abuse.data?.data?.abuseConfidenceScore ?? null;
      const usageType = String(abuse.data?.data?.usageType || "").toLowerCase();

      if (typeof score === "number" && score >= 25) {
        out.summary.flaggedBy.push(`AbuseIPDB score ${score}`);
      } else if (typeof score === "number") {
        out.summary.passedBy.push(`AbuseIPDB OK (${score})`);
      } else {
        out.notes.push("AbuseIPDB returned no score field");
      }

      // Treat usageType as hosting signal
      if (/data\s*center|web\s*hosting|hosting|vpn|proxy|transit/.test(usageType)) {
        out.summary.flaggedBy.push(`AbuseIPDB usageType: ${usageType}`);
      }
    } else {
      out.notes.push(`AbuseIPDB failed (${abuse.status}): ${JSON.stringify(abuse.error).slice(0,200)}`);
    }
  }

  // 3) StopForumSpam (fix nested 'ip.appears')
  const sfs = await timedGet("sfs", `https://api.stopforumspam.org/api?ip=${encodeURIComponent(ip)}&json`);
  out.details.stopforumspam = sfs;
  if (sfs.ok) {
    const appears = Number(sfs.data?.appears ?? sfs.data?.ip?.appears) === 1;
    if (appears) out.summary.flaggedBy.push("StopForumSpam flagged");
    else out.summary.passedBy.push("StopForumSpam OK");
  } else {
    out.notes.push(`StopForumSpam failed (${sfs.status}): ${JSON.stringify(sfs.error).slice(0,200)}`);
  }

  // 4) Bot ranges (Googlebot CIDRs, Spamhaus CIDRs, Tor Exit IPs)
  const ranges = await getBotRanges();
  out.details.botRangesFetchErrors = ranges.fetchErrors;

  let cidrHit = false;
  if (isIPv4(ip)) {
    for (const cidr of ranges.cidrs) {
      if (cidrMatchIPv4(ip, cidr)) { cidrHit = true; break; }
    }
  }
  const ipHit = ranges.ips.has(ip);

  out.details.botRanges = {
    cidrChecked: isIPv4(ip),
    cidrHit,
    ipHit,
  };
  if (cidrHit || ipHit) out.summary.flaggedBy.push(`Bot range match (${cidrHit ? "CIDR" : "IP"})`);
  else out.summary.passedBy.push("BotDB OK");

  // 5) Tor DNS (extra, IPv4 only)
  const torDns = await isTorDNS(ip);
  out.details.torDns = torDns;
  if (torDns.tor) out.summary.flaggedBy.push("Tor DNS match");

  // Final response
  return res.status(200).json(out);
}
