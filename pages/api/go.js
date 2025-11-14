import { decryptUrl } from "../../lib/crypto";

const usedTokens = new Set();

export default function handler(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("Token ausente.");
    }

    // Avoid replay attacks → one-time tokens
    if (usedTokens.has(token)) {
      return res.status(403).send("Token inválido.");
    }

    const decrypted = decryptUrl(token);
    const data = JSON.parse(decrypted);

    // Expire token after 20s for safety
    if (Date.now() - data.timestamp > 20000) {
      return res.status(403).send("Token expirado.");
    }

    usedTokens.add(token);

    // Secure server-side redirect
    res.writeHead(302, { Location: data.realUrl });
    return res.end();
  } catch {
    return res.status(403).send("Token inválido.");
  }
}
