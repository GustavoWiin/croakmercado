// pages/api/honeypot.js
export default async function handler(req, res) {
  try {
    // ✅ Get client IP automatically
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.socket.remoteAddress ||
      "0.0.0.0";

    if (!ip || ip === "0.0.0.0") {
      return res.status(400).json({ error: "Could not detect IP address" });
    }

    // ✅ Call Project Honeypot API
    const url = `https://api.projecthoneypot.org/api?ip=${ip}&key=${process.env.HONEYPOT_API_KEY}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Honeypot" });
    }

    // ✅ Project Honeypot returns XML, so read as TEXT
    const rawData = await response.text();

    // ✅ Parse threat score from XML manually
    const scoreMatch = rawData.match(/<threat_score>(\d+)<\/threat_score>/);
    const threatScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

    return res.status(200).json({
      ip,
      score: threatScore,
      isBot: threatScore >= 20,
    });
  } catch (error) {
    console.error("HONEYPOT ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
