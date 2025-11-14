import axios from "axios";
import crypto from "crypto";
import { encryptUrl } from "../../lib/crypto";

const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_KEY || process.env.ABUSE_IPDB_KEY;

// Cache Googlebot / Tor / Spamhaus ranges in memory (Vercel safe)
let cachedBotRanges = null;
let lastUpdate = 0;
const DEBUG = true;

async function getBotRanges() {
  const now = Date.now();
  if (cachedBotRanges && now - lastUpdate < 6 * 60 * 60 * 1000) {
    return cachedBotRanges;
  }
  try {
    const [google, tor, spamhaus] = await Promise.all([
      axios.get("https://developers.google.com/search/apis/ipranges/googlebot.json"),
      axios.get("https://check.torproject.org/exit-addresses"),
      axios.get("https://www.spamhaus.org/drop/drop.lasso"),
    ]);
    const ranges = new Set();
    // Googlebot ranges (JSON)
    if (google.data.prefixes) {
      google.data.prefixes.forEach((p) => {
        if (p.ipv4Prefix) ranges.add(p.ipv4Prefix);
      });
    }
    // Tor exit nodes (TXT)
    tor.data
      .split("\n")
      .filter((l) => l.startsWith("ExitAddress"))
      .forEach((l) => ranges.add(l.split(" ")[1]));
    // Spamhaus DROP list (TXT)
    spamhaus.data
      .split("\n")
      .filter((l) => l && !l.startsWith(";"))
      .forEach((l) => ranges.add(l.split(";")[0].trim()));
    cachedBotRanges = ranges;
    lastUpdate = now;
    return cachedBotRanges;
  } catch (err) {
    if (DEBUG) console.warn("⚠️ Failed to fetch bot ranges:", err.message);
    return new Set();
  }
}

export default async function handler(req, res) {
  try {
    // Determine client IP address
    const forwarded = req.headers["x-forwarded-for"];
    const ip = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(",")[0]?.trim() ||
        req.headers["x-real-ip"] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        "0.0.0.0";
    if (DEBUG) console.log("🔍 Client IP detected:", ip);

    let isBot = false;

    // 1. USER-AGENT CHECK
    const ua = req.headers["user-agent"]?.toLowerCase() || "";
    const badUA = [
      "googlebot", "adsbot", "crawler", "mediapartners", "spider",
      "facebook", "bingbot", "python", "curl", "wget",
      "headless", "phantomjs", "node",
    ];
    if (badUA.some((p) => ua.includes(p))) {
      if (DEBUG) console.log("🛑 Blocked by User-Agent:", ua);
      isBot = true;
    }

    // 2. IPINFO ASN CHECK (datacenters/VPNs)
    if (!isBot) {
      try {
        const info = await axios.get(`https://ipinfo.io/${ip}/json`);
        const org = info.data.org?.toLowerCase() || "";
        const botASNs = [
          "google", "facebook", "meta", "amazon", "microsoft",
          "digitalocean", "linode", "vultr", "ovh", "gigenet",
          "cloudflare", "hetzner", "contabo",
        ];
        if (botASNs.some((asn) => org.includes(asn))) {
          if (DEBUG) console.log("🛑 Blocked by ASN:", org);
          isBot = true;
        }
      } catch (err) {
        if (DEBUG) console.warn("⚠️ ASN lookup failed, SKIPPING:", err.message);
      }
    }

    // 3. ABUSEIPDB CHECK
    if (!isBot) {
      if (!ABUSEIPDB_API_KEY) {
        if (DEBUG) console.warn("⚠️ No AbuseIPDB API key configured, skipping AbuseIPDB check");
      } else {
        try {
          const abuseRes = await axios.get("https://api.abuseipdb.com/api/v2/check", {
            headers: {
              Accept: "application/json",
              Key: ABUSEIPDB_API_KEY,
            },
            params: {
              ipAddress: ip,
              maxAgeInDays: 90,  // look up reports up to 90 days old
            },
          });
          const score = abuseRes.data.data.abuseConfidenceScore;
          if (score >= 25) {
            if (DEBUG) console.log("🛑 Blocked by AbuseIPDB:", score);
            isBot = true;
          }
        } catch (err) {
          if (DEBUG) console.warn("⚠️ AbuseIPDB lookup failed, SKIPPING:", err.message);
        }
      }
    }

    // 4. STOPFORUMSPAM CHECK
    if (!isBot) {
      try {
        // Encode IP in case of special characters (IPv6)
        const spamRes = await axios.get(`https://api.stopforumspam.org/api?ip=${encodeURIComponent(ip)}&json`);
        if (spamRes.data?.appears === 1) {
          if (DEBUG) console.log("🛑 Blocked by StopForumSpam:", ip);
          isBot = true;
        }
      } catch (err) {
        if (DEBUG) console.warn("⚠️ StopForumSpam lookup failed, SKIPPING:", err.message);
      }
    }

    // 5. GLOBAL BOT DATABASE CHECK (Googlebot, Tor, Spamhaus ranges)
    if (!isBot) {
      try {
        const botRanges = await getBotRanges();
        if (botRanges.has(ip)) {
          if (DEBUG) console.log("🛑 Blocked by BotDB ranges:", ip);
          isBot = true;
        }
      } catch (err) {
        if (DEBUG) console.warn("⚠️ Bot ranges check failed, SKIPPING:", err.message);
      }
    }

    // FINAL DECISION
    if (isBot) {
      if (DEBUG) console.log("❌ FINAL BLOCK:", ip);
      return res.status(403).json({
        success: false,
        message: "Resposta incorreta. Tente novamente.",
      });
    }

    // ✅ ALLOW HUMANS ONLY
    const realUrl = "https://promos-das-points.online/home";
    const sessionId = crypto.randomUUID();
    const timestamp = Date.now();
    const payload = JSON.stringify({ realUrl, sessionId, timestamp });
    const token = encryptUrl(payload);
    if (DEBUG) console.log("✅ FINAL PASS:", ip);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("API Error:", err.message);
    return res.status(500).json({ error: "Erro ao gerar token" });
  }
}
