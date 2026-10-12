// Google Lighthouse en modo móvil (lo mismo que PageSpeed Insights) sobre cada
// página, con umbrales y comparación contra una referencia aprobada.
//
//   npm run test:lighthouse           compara con tests/lighthouse-baseline.json
//   npm run test:lighthouse:update    guarda los valores actuales como referencia
//
// Cada página se mide 3 veces y se usa la mediana (Lighthouse varía entre
// pasadas). Falla si:
//  - accesibilidad < 100, buenas prácticas < 95 o SEO < 100,
//  - el rendimiento baja más de 5 puntos respecto a la referencia,
//  - LCP sube más de un 15 % (+0,2 s), TBT más de 150 ms, CLS más de 0,02
//    o el peso de la página más de un 10 %.
// Necesita la web construida (`npm run build`).
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";

const ROUTES = ["/", "/aglutinador/", "/aglutinador/historia/", "/aglutinador/archivo/", "/aviso-legal/", "/privacidad/"];
const RUNS = 3;
const PORT = 4330;
const BASELINE = new URL("./lighthouse-baseline.json", import.meta.url);
const update = process.argv.includes("--update");

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

// Servidor de la web construida (si no se indica otro con BASE=…).
let server;
let base = process.env.BASE;
if (!base) {
  base = `http://127.0.0.1:${PORT}`;
  server = spawn("npx", ["astro", "preview", "--host", "127.0.0.1", "--port", String(PORT)], { stdio: "ignore", shell: process.platform === "win32" });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
}

const chromePath = process.env.CHROMIUM_PATH || chromium.executablePath();
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox"] });

const results = {};
try {
  for (const route of ROUTES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const { lhr } = await lighthouse(base + route, {
        port: chrome.port,
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"]
      });
      runs.push({
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        lcp: Math.round(lhr.audits["largest-contentful-paint"].numericValue),
        tbt: Math.round(lhr.audits["total-blocking-time"].numericValue),
        cls: Number(lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3)),
        bytes: Math.round(lhr.audits["total-byte-weight"].numericValue / 1024)
      });
    }
    results[route] = Object.fromEntries(Object.keys(runs[0]).map((key) => [key, median(runs.map((r) => r[key]))]));
    const r = results[route];
    console.log(
      `${route.padEnd(24)} rend ${r.performance} · acc ${r.accessibility} · bp ${r.bestPractices} · seo ${r.seo} · LCP ${(r.lcp / 1000).toFixed(1)} s · TBT ${r.tbt} ms · CLS ${r.cls} · ${r.bytes} KB`
    );
  }
} finally {
  chrome.kill();
  server?.kill();
}

if (update) {
  writeFileSync(BASELINE, JSON.stringify(results, null, 2) + "\n");
  console.log(`\nReferencia guardada en ${BASELINE.pathname}`);
  process.exit(0);
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const failures = [];
for (const [route, r] of Object.entries(results)) {
  const b = baseline[route];
  if (r.accessibility < 100) failures.push(`${route}: accesibilidad ${r.accessibility} < 100`);
  if (r.bestPractices < 95) failures.push(`${route}: buenas prácticas ${r.bestPractices} < 95`);
  if (r.seo < 100) failures.push(`${route}: SEO ${r.seo} < 100`);
  if (!b) {
    failures.push(`${route}: no hay referencia (ejecuta npm run test:lighthouse:update)`);
    continue;
  }
  if (r.performance < b.performance - 5) failures.push(`${route}: rendimiento ${r.performance} (referencia ${b.performance})`);
  if (r.lcp > b.lcp * 1.15 + 200) failures.push(`${route}: LCP ${r.lcp} ms (referencia ${b.lcp} ms)`);
  if (r.tbt > b.tbt + 150) failures.push(`${route}: TBT ${r.tbt} ms (referencia ${b.tbt} ms)`);
  if (r.cls > b.cls + 0.02) failures.push(`${route}: CLS ${r.cls} (referencia ${b.cls})`);
  if (r.bytes > b.bytes * 1.1) failures.push(`${route}: peso ${r.bytes} KB (referencia ${b.bytes} KB)`);
}

if (failures.length) {
  console.error(`\nLighthouse: ${failures.length} problema(s)\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log("\nLighthouse: todo dentro de los umbrales.");
