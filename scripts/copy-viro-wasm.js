// Copies the ViroReact WebGL2/WASM renderer assets into public/viro so Expo web serves them.
const fs = require("fs");
const path = require("path");
const src = path.join(__dirname, "..", "node_modules", "@reactvision", "viro-web-renderer", "wasm");
const dst = path.join(__dirname, "..", "public", "viro");
if (!fs.existsSync(src)) process.exit(0);
fs.mkdirSync(dst, { recursive: true });
for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
console.log("viro web assets ->", dst);
