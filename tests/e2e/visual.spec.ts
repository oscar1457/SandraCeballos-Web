import { test, expect } from "./helpers";
import type { Page } from "@playwright/test";

// Regresión visual: cada captura se compara con una imagen aprobada en
// tests/visual/. Si algo cambia, el test falla y hay que mirarlo: si el cambio
// es bueno, se aprueba con `npm run test:update-visual`.
//
// Para que las capturas salgan siempre iguales, el reloj de la página es falso
// (las animaciones avanzan solo cuando el test lo dice) y se tapan los vídeos
// y la trama animada.

const SIZES = [
  { width: 360, height: 780, phone: true },
  { width: 390, height: 844, phone: true },
  { width: 768, height: 1024, phone: false },
  { width: 1440, height: 900, phone: false }
];

const ready = async (page: Page, path: string) => {
  await page.clock.install({ time: new Date("2026-10-12T10:00:00Z") });
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready.then(() => true));
  // La entrada de la noticia es una animación CSS (no depende del reloj): se
  // espera a que termine y entonces se para el reloj de la página.
  await page.waitForFunction(() => {
    const card = document.querySelector("[data-news]");
    return !card || !card.classList.contains("news--intro") || getComputedStyle(card).display === "none";
  });
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(new Date(now + 50));
  await page.clock.runFor(1500);
  await imagesOnScreen(page);
};

// Espera a que estén cargadas las imágenes que se ven en pantalla.
const imagesOnScreen = async (page: Page) => {
  for (let i = 0; i < 100; i++) {
    const pending = await page.evaluate(() =>
      Array.from(document.images).filter((img) => {
        const rect = img.getBoundingClientRect();
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
        return onScreen && img.currentSrc !== "" && !img.complete;
      }).length
    );
    if (pending === 0) return;
    await page.clock.runFor(100);
    await page.waitForTimeout(100);
  }
  throw new Error("Imágenes sin cargar en pantalla");
};

const goToSection = async (page: Page, id: string) => {
  await page.evaluate((sectionId) => document.getElementById(sectionId)!.scrollIntoView(), id);
  await page.clock.runFor(2000);
  await imagesOnScreen(page);
  await page.clock.runFor(300);
};

// Hace scroll y espera a que la página reciba el aviso de scroll (eso ocurre
// en tiempo real); después el reloj falso decide cuánto avanza la animación.
const scrollAndWait = (page: Page, factor: number) =>
  page.evaluate(
    (f) =>
      new Promise<boolean>((resolve) => {
        window.addEventListener("scroll", () => resolve(true), { once: true });
        window.scrollTo(0, window.innerHeight * f);
      }),
    factor
  );

// `moving`: capturas a mitad de una animación. El reloj falso avanza a saltos
// de un fotograma, así que puede haber una diferencia de un fotograma entre
// ejecuciones: se permite algo más de margen (sigue detectando si falta la
// tarjeta o cambia el diseño).
const shot = async (page: Page, name: string, moving = false) => {
  // La letra de fondo de la portada cambia S/C cada 3 s: se deja siempre en S.
  await page.evaluate(() => {
    const [s, c] = Array.from(document.querySelectorAll(".intro__letter"));
    s?.classList.add("is-active");
    c?.classList.remove("is-active");
  });
  await expect(page).toHaveScreenshot(`${name}.png`, {
    ...(moving ? { maxDiffPixelRatio: 0.04 } : {}),
    // Se tapan los vídeos, la trama animada y la barrita de progreso de las noticias.
    mask: [page.locator("canvas, video, .news__dots")],
    maskColor: "#888"
  });
};

for (const size of SIZES) {
  test.describe(`${size.width}px`, () => {
    test.use({
      viewport: { width: size.width, height: size.height },
      isMobile: size.phone,
      hasTouch: size.width < 1000,
      deviceScaleFactor: 1
    });

    test("portada", async ({ page }) => {
      await ready(page, "/");
      await shot(page, `${size.width}-portada`);
    });

    if (size.phone) {
      test("menú abierto", async ({ page }) => {
        await ready(page, "/");
        await page.click("[data-menu-button]");
        await page.clock.runFor(800);
        await shot(page, `${size.width}-menu`);
      });
    } else {
      test("News entrando y saliendo", async ({ page }) => {
        await ready(page, "/");
        // Saliendo: a medio camino de retirarse.
        await scrollAndWait(page, 0.4);
        await page.clock.runFor(200);
        await shot(page, `${size.width}-news-saliendo`, true);
        await page.clock.runFor(1000);
        // Entrando: vuelve a la portada y está a medio camino.
        await scrollAndWait(page, 0);
        await page.clock.runFor(900);
        await shot(page, `${size.width}-news-entrando`, true);
      });
    }

    for (const id of ["obra", "trayectoria", "publicaciones"]) {
      test(`sección ${id}`, async ({ page }) => {
        await ready(page, "/");
        await goToSection(page, id);
        await shot(page, `${size.width}-${id}`);
      });
    }

    test("archivo de Aglutinador", async ({ page }) => {
      await ready(page, "/aglutinador/archivo/");
      await imagesOnScreen(page);
      await shot(page, `${size.width}-archivo`);
    });
  });
}
