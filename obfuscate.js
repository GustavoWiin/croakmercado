const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const targets = [
  path.join(__dirname, "pages", "api", "session-token.js"), // ✅ Correct file
  path.join(__dirname, "pages", "api", "go.js"),            // ✅ Secure redirect
  path.join(__dirname, "lib", "crypto.js"),                 // ✅ AES helper
];

targets.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.log(`[SKIPPED] Missing file → ${file}`);
    return;
  }

  const code = fs.readFileSync(file, "utf8");

  const obfuscated = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    stringArray: true,
    stringArrayEncoding: ["rc4"],
    transformObjectKeys: true,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    target: "node",
  }).getObfuscatedCode();

  fs.writeFileSync(file, obfuscated, "utf8");
  console.log(`[SECURE] Obfuscated → ${file}`);
});
