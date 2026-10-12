import { defineConfig, devices } from "@playwright/test";

// Tests de la web con Playwright. Se ejecutan contra la versión construida
// (`npm run build`), servida con `astro preview`, igual que en producción.
//
// Proyectos:
//  - desktop / mobile / reduced: tests funcionales, News, movimiento, a11y…
//  - visual: capturas comparadas con imágenes aprobadas. Solo en Linux (CI),
//    porque cada sistema dibuja las letras un poco distinto. Forzar: VISUAL=1.
//  - webkit-desktop / webkit-mobile (motor de Safari): con WEBKIT=1.

const PORT = 4329;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// En el entorno de pruebas de Claude el navegador está en otra ruta.
const executablePath = process.env.CHROMIUM_PATH;
const chromium = executablePath
  ? { launchOptions: { executablePath, args: ["--headless=new"] } }
  : { channel: "chromium" };

const runVisual = process.env.VISUAL === "1" || (process.platform === "linux" && process.env.VISUAL !== "0");
const runWebkit = process.env.WEBKIT === "1";

export default defineConfig({
  testDir: "tests/e2e",
  snapshotPathTemplate: "tests/visual/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, threshold: 0.2, animations: "disabled", caret: "hide" }
  },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: `${BASE_URL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /visual\.spec/,
      use: { ...devices["Desktop Chrome"], ...chromium, viewport: { width: 1440, height: 900 } }
    },
    {
      name: "mobile",
      testIgnore: /visual\.spec|responsive\.spec/,
      use: { ...devices["Pixel 7"], ...chromium }
    },
    {
      name: "reduced",
      testIgnore: /visual\.spec|motion\.spec|responsive\.spec/,
      use: { ...devices["Desktop Chrome"], ...chromium, viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } }
    },
    ...(runVisual
      ? [{ name: "visual", testMatch: /visual\.spec/, use: { ...devices["Desktop Chrome"], ...chromium } }]
      : []),
    ...(runWebkit
      ? [
          { name: "webkit-desktop", testIgnore: /visual\.spec|motion\.spec/, use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
          { name: "webkit-mobile", testIgnore: /visual\.spec|motion\.spec/, use: { ...devices["iPhone 14"] } }
        ]
      : [])
  ]
});
