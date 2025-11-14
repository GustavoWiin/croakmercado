import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REDIRECT_SECRET || "ultra-secure-key";

export function encryptUrl(url) {
  return CryptoJS.AES.encrypt(url, SECRET_KEY).toString();
}

export function decryptUrl(token) {
  const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
