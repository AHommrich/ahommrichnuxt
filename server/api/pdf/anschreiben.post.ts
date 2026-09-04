import puppeteer from "puppeteer-core";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = Buffer.from(JSON.stringify(body)).toString("base64");
  const port = process.env.PORT || 3000;

  // Locale-aware: render the localized letter page so static parts (labels, date)
  // match. The letter body itself comes from the posted data.
  const locale = getQuery(event).locale === "en" ? "en" : "de";
  const prefix = locale === "en" ? "/en" : "";

  const browser = await puppeteer.launch({
    executablePath: getChromiumPath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.goto(
      `http://localhost:${port}${prefix}/anschreiben?data=${data}`,
      {
        waitUntil: "networkidle0",
      },
    );
    await page.waitForSelector("[data-ready]", { timeout: 10000 });

    await page.evaluate(() => {
      function linkify(text: string): string {
        const escaped = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return escaped.replace(
          /https?:\/\/[^\s<>"]+/g,
          (url) => `<a href="${url}" style="color:inherit">${url}</a>`,
        );
      }

      const sections = document.querySelectorAll(
        ".letter-section",
      ) as NodeListOf<HTMLElement>;
      sections.forEach((section) => {
        const raw = section.innerText;
        section.innerHTML = "";
        for (const para of raw.split(/\n\n+/)) {
          const trimmed = para.trim();
          if (!trimmed) continue;
          const div = document.createElement("div");
          div.style.cssText =
            "break-inside: avoid; page-break-inside: avoid; margin-bottom: 0.6em;";
          div.innerHTML = linkify(trimmed);
          section.appendChild(div);
        }
      });
    });

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
      `attachment; filename="${locale === "en" ? "cover-letter" : "anschreiben"}.pdf"`,
    );
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
});
