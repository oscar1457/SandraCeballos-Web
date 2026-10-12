import AxeBuilder from "@axe-core/playwright";
import { test, expect, ROUTES, scrollThrough, isMobile, isReduced, clickNav, waitScrollStill } from "./helpers";
import type { Page } from "@playwright/test";

// Accesibilidad con axe (el motor que usan Lighthouse y Chrome): cero
// violaciones en todas las páginas, en los dos idiomas y con los menús,
// fichas y visores abiertos.

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const audit = async (page: Page, label: string) => {
  const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const problems = result.violations.map(
    (v) => `${label} · ${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`
  );
  expect(problems, problems.join("\n")).toEqual([]);
};

const setLanguage = async (page: Page, lang: "es" | "en") => {
  await page.evaluate((l) => window.localStorage.setItem("sandra-language", l), lang);
  await page.reload();
};

for (const lang of ["es", "en"] as const) {
  for (const route of ROUTES) {
    test(`axe ${route} (${lang})`, async ({ page }) => {
      await page.goto(route);
      await setLanguage(page, lang);
      await scrollThrough(page);
      await audit(page, `${route} ${lang}`);
    });
  }
}

test("axe con estados abiertos: menú, ficha, apartados, visor y noticia", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await scrollThrough(page);

  if (isMobile(testInfo)) {
    await page.click("[data-menu-button]");
    await expect(page.locator("[data-site-header]")).toHaveClass(/is-open/);
    await audit(page, "menú abierto");
    await page.keyboard.press("Escape");
  } else {
    await expect(page.locator("[data-news]")).toBeVisible();
    await audit(page, "noticia visible");
  }

  await clickNav(page, testInfo, "#obra");
  await waitScrollStill(page);
  if (isReduced(testInfo)) await page.locator("[data-list-row]").first().click();
  else await page.click("[data-open-current]");
  await expect(page.locator("dialog[data-sheet]")).toHaveAttribute("open", "");
  await audit(page, "ficha de obra abierta");
  await page.keyboard.press("Escape");

  await clickNav(page, testInfo, "#trayectoria");
  await waitScrollStill(page);
  const summaries = page.locator(".career__item summary");
  for (let i = 0; i < (await summaries.count()); i++) {
    await summaries.nth(i).click();
    await page.waitForTimeout(150);
  }
  await audit(page, "apartados de Trayectoria abiertos");

  await page.goto("/aglutinador/archivo/");
  await page.locator("[data-photo]").first().click();
  await expect(page.locator("dialog[data-viewer]")).toHaveAttribute("open", "");
  await audit(page, "visor del archivo abierto");
});
