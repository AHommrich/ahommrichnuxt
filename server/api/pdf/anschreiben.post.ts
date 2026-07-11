import puppeteer from "puppeteer-core";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = Buffer.from(JSON.stringify(body)).toString("base64");
  const port = process.env.PORT || 3000;

  const browser = await puppeteer.launch({
    executablePath: getChromiumPath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.goto(`http://localhost:${port}/anschreiben?data=${data}`, {
      waitUntil: "networkidle0",
    });
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
      'attachment; filename="anschreiben.pdf"',
    );
    return pdf;
  } finally {
    await browser.close();
  }
});
