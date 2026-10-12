import { test as base, expect, type Page, type TestInfo } from "@playwright/test";

export { expect };

// Todas las páginas de la web.
export const ROUTES = [
  "/",
  "/aglutinador/",
  "/aglutinador/historia/",
  "/aglutinador/archivo/",
  "/aviso-legal/",
  "/privacidad/"
];

// Secciones de la portada a las que lleva el menú.
export const HOME_SECTIONS = ["obra", "trayectoria", "publicaciones", "contacto"];

// Mensajes del navegador que no son fallos de la web (avisos del WebGL por software).
const NOISE = /GL Driver Message|GPU stall|WebGL|Automatic fallback to software/i;

type Fixtures = { issues: string[] };

// Cada test:
//  - nunca envía nada real a Formspree (las peticiones se bloquean salvo que el
//    propio test las simule),
//  - recoge errores de consola, errores de JavaScript y respuestas 4xx/5xx.
export const test = base.extend<Fixtures>({
  issues: async ({ page }, use) => {
    const issues: string[] = [];
    await page.route(/formspree\.io/, (route) => route.abort());
    page.on("console", (message) => {
      if (message.type() === "error" && !NOISE.test(message.text())) issues.push(`consola: ${message.text()}`);
    });
    page.on("pageerror", (error) => issues.push(`JavaScript: ${error.message}`));
    page.on("response", (response) => {
      if (response.status() >= 400 && !/formspree\.io/.test(response.url())) {
        issues.push(`${response.status()} ${response.url()}`);
      }
    });
    await use(issues);
  }
});

export const isMobile = (testInfo: TestInfo) => /mobile/.test(testInfo.project.name);
export const isReduced = (testInfo: TestInfo) => testInfo.project.name === "reduced";

// Posición de una sección respecto a la parte de arriba de la pantalla.
export const sectionTop = (page: Page, id: string) =>
  page.evaluate((sectionId) => Math.round(document.getElementById(sectionId)!.getBoundingClientRect().top), id);

// Espera a que el scroll deje de moverse (el desplazamiento suave tarda un poco).
export const waitScrollStill = async (page: Page, timeout = 10_000) => {
  const end = Date.now() + timeout;
  let last = await page.evaluate(() => window.scrollY);
  let still = 0;
  while (Date.now() < end) {
    await page.waitForTimeout(150);
    const now = await page.evaluate(() => window.scrollY);
    still = Math.abs(now - last) < 0.5 ? still + 1 : 0;
    if (still >= 3) return;
    last = now;
  }
  throw new Error("El scroll no se detuvo");
};

// Recorre la página entera por pantallas (monta animaciones y contenido perezoso).
export const scrollThrough = async (page: Page) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight * 0.8);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await waitScrollStill(page);
};

// Abre el menú del teléfono si hace falta y pulsa un enlace del menú principal.
export const clickNav = async (page: Page, testInfo: TestInfo, href: string) => {
  if (isMobile(testInfo)) {
    await page.click("[data-menu-button]");
    await expect(page.locator("[data-site-header]")).toHaveClass(/is-open/);
  }
  await page.click(`.site-header__nav a[href="${href}"]`);
};

// Estado de la tarjeta de noticias.
export const newsState = (page: Page) =>
  page.evaluate(() => {
    const card = document.querySelector<HTMLElement>("[data-news]");
    if (!card) return { exists: false, shown: false, onScreen: false, item: -1, kicker: "" };
    const rect = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const shown = !card.hidden && style.display !== "none" && style.visibility !== "hidden";
    const onScreen = shown && rect.width > 0 && rect.left < window.innerWidth - 20 && rect.right > 20;
    const items = Array.from(card.querySelectorAll<HTMLElement>("[data-news-item]"));
    const item = items.findIndex((el) => getComputedStyle(el).visibility !== "hidden" && Number(getComputedStyle(el).opacity) > 0.5);
    const kicker = item >= 0 ? (items[item]!.querySelector(".news__kicker")?.textContent ?? "").trim() : "";
    return { exists: true, shown, onScreen, item, kicker };
  });

// Qué parte de la portada se ve (0–1).
export const introRatio = (page: Page) =>
  page.evaluate(() => {
    const rect = document.getElementById("inicio")!.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    return visible / Math.min(rect.height, window.innerHeight);
  });
