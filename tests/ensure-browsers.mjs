// Descarga los navegadores de Playwright si faltan (la primera vez tarda un poco;
// después no hace nada). En CI instala también las dependencias del sistema.
import { spawnSync } from "node:child_process";

if (process.env.CHROMIUM_PATH) {
  console.log("Navegador propio en CHROMIUM_PATH: no se descarga nada.");
  process.exit(0);
}
const browsers = ["chromium", ...(process.env.WEBKIT === "1" ? ["webkit"] : [])];
const args = ["playwright", "install", ...(process.env.CI ? ["--with-deps"] : []), ...browsers];
const result = spawnSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status ?? 1);
