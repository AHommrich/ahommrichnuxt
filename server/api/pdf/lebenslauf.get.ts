import puppeteer from "puppeteer-core";

export default defineEventHandler(async (event) => {
  const port = process.env.PORT || 3000;

  // Locale-aware: render the localized page so the PDF matches the language the
  // visitor is viewing. Puppeteer simply prints "/lebenslauf" or "/en/lebenslauf".
  const locale = getQuery(event).locale === "en" ? "en" : "de";
  const prefix = locale === "en" ? "/en" : "";

  const browser = await puppeteer.launch({
    executablePath: getChromiumPath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.goto(`http://localhost:${port}${prefix}/lebenslauf`, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("[data-ready]", { timeout: 10000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    setHeader(event, "Content-Type", "application/pdf");
    setHeader(
      event,
      "Content-Disposition",
      `attachment; filename="${locale === "en" ? "cv" : "lebenslauf"}.pdf"`,
    );
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
});
