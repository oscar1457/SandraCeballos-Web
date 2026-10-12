// Google Lighthouse en modo móvil (lo mismo que PageSpeed Insights): rendimiento,
// accesibilidad, buenas prácticas y SEO de cada página.
// Una vez: npm i -D lighthouse
// Con la web en marcha (npm run build && npm run preview):  node tests/lighthouse.mjs
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
const BASE = process.env.BASE ?? "http://localhost:4321";
const PAGES = ["/", "/aglutinador/", "/aglutinador/historia/", "/aglutinador/archivo/", "/aviso-legal/"];
const chrome = await chromeLauncher.launch({ ...(process.env.CHROMIUM_PATH ? { chromePath: process.env.CHROMIUM_PATH } : {}), chromeFlags: ["--headless=new", "--no-sandbox"] });
for (const path of PAGES) {
  const result = await lighthouse(BASE + path, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] });
  const { categories, audits } = result.lhr;
  console.log(`\n${path}  ` + Object.values(categories).map((c) => `${c.title}: ${Math.round(c.score * 100)}`).join(" · "));
  for (const a of Object.values(audits)) {
    if (a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual") {
      const items = (a.details?.items ?? []).slice(0, 3).map((i) => i.node?.selector ?? i.url ?? i.source?.url ?? "").filter(Boolean);
      console.log(`  ✗ ${a.id}: ${a.title}${a.displayValue ? " — " + a.displayValue : ""}${items.length ? "\n      " + items.join("\n      ") : ""}`);
    }
  }
}
await chrome.kill();
