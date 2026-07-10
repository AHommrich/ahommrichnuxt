import type { Page } from "puppeteer-core";

/**
 * Injects the dot pattern as a position:fixed data-URI element covering the
 * @page content area. Data-URI avoids the SVG-internal <use href="#…">
 * resolution failure in Chromium headless PDF mode.
 * The full-paper background coverage is handled by the separate background PDF
 * merged via pdf-lib (see generateBackgroundPdf + mergeContentWithBackground).
 */
export async function injectPrintBackground(page: Page): Promise<void> {
  const svgContent = await page.evaluate(async () => {
    const r = await fetch("/img/bg-dots-light.svg");
    return r.text();
  });

  const uri =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svgContent as string);

  await page.evaluate((bgUri: string) => {
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.backgroundImage = `url("${bgUri}")`;
    el.style.backgroundSize = "2000px 6000px";
    el.style.backgroundRepeat = "repeat";
    (
      el.style as CSSStyleDeclaration & { webkitPrintColorAdjust: string }
    ).webkitPrintColorAdjust = "exact";
    el.style.printColorAdjust = "exact";
    el.style.pointerEvents = "none";
    document.body.insertBefore(el, document.body.firstChild);
  }, uri);
}
