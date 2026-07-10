import type { Browser } from "puppeteer-core";

/**
 * Renders a full-A4 page containing only the dot pattern (no content, no @page
 * margins) and returns it as a PDF buffer. This is the background layer that
 * pdf-lib draws first before compositing the content PDF on top.
 */
export async function generateBackgroundPdf(
  browser: Browser,
  svgDataUri: string,
): Promise<Buffer> {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 794, height: 1123 });
    await page.setContent(`<!DOCTYPE html>
<html>
<head>
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; width: 210mm; height: 297mm; overflow: hidden; }
  .bg {
    position: fixed; inset: 0;
    background-image: url("${svgDataUri}");
    background-size: 2000px 6000px;
    background-repeat: repeat;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
</style>
</head>
<body><div class="bg"></div></body>
</html>`);
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}
