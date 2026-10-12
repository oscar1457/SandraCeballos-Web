// axe-core (Deque, el motor de accesibilidad que usan Lighthouse y Chrome)
// en perfiles reales de teléfono y tableta de Playwright: contraste, tamaño de
// zonas táctiles (WCAG 2.2), zoom, textos alternativos, etc.
// Una vez: npm i -D playwright @axe-core/playwright && npx playwright install chromium
// Con la web en marcha (npm run build && npm run preview):  node tests/axe.mjs
import { chromium, devices } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
const BASE = process.env.BASE ?? "http://localhost:4321";
const PAGES = ["/", "/aglutinador/", "/aglutinador/historia/", "/aglutinador/archivo/", "/aviso-legal/"];
const DEVICES = ["iPhone SE", "iPhone 14 Pro Max", "Pixel 7", "Galaxy S9+", "iPad Mini"];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--headless=new"] });
const seen = new Map();
for (const name of DEVICES) {
  const { defaultBrowserType, ...device } = devices[name];
  const ctx = await browser.newContext(device);
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    // recorre la página para que se monten las animaciones y el contenido perezoso
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((t) => scrollTo(0, t), y); await page.waitForTimeout(120); }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    for (const v of r.violations) {
      const key = `${path} ${v.id}`;
      const entry = seen.get(key) ?? { v, devices: new Set(), nodes: new Set() };
      entry.devices.add(name);
      v.nodes.slice(0, 4).forEach((n) => entry.nodes.add(n.target.join(" ")));
      seen.set(key, entry);
    }
  }
  await ctx.close();
}
await browser.close();
if (!seen.size) console.log("axe: sin problemas en ningún dispositivo");
process.exitCode = seen.size ? 1 : 0;
for (const [key, { v, devices: d, nodes }] of seen) {
  console.log(`✗ ${key} [${v.impact}] ${v.help}\n    en: ${[...d].join(", ")}\n    ${[...nodes].slice(0, 4).join("\n    ")}`);
}
