import puppeteer from "puppeteer-core";

export default defineEventHandler(async (event) => {
  const port = process.env.PORT || 3000;

  const browser = await puppeteer.launch({
    executablePath: getChromiumPath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.goto(`http://localhost:${port}/lebenslauf`, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("[data-ready]", { timeout: 10000 });

    const svgContent = await page.evaluate(async () => {
      const r = await fetch("/img/bg-dots-light.svg");
      return r.text();
    });
    const svgDataUri =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svgContent as string);

    const contentPdf = Buffer.from(
      await page.pdf({ format: "A4", printBackground: true }),
    );
    const bgPdf = await generateBackgroundPdf(browser, svgDataUri);
    const pdf = await mergeContentWithBackground(contentPdf, bgPdf);

    setHeader(event, "Content-Type", "application/pdf");
    setHeader(
      event,
      "Content-Disposition",
      'attachment; filename="lebenslauf.pdf"',
    );
    return pdf;
  } finally {
    await browser.close();
  }
});
