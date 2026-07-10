import {
  PDFDocument,
  PDFName,
  PDFArray,
  PDFDict,
  PDFString,
  PDFNumber,
} from "pdf-lib";

/**
 * Composites background PDF (full A4 pattern) with content PDF, then
 * re-attaches link annotations that pdf-lib's XObject embedding strips.
 *
 * When embedPdf() + drawPage() is used, PDF pages become Form XObjects.
 * Per the PDF spec, XObjects cannot carry Annots — they are silently dropped.
 * We restore them by reading the original content PDF's /Annots arrays and
 * reconstructing equivalent Link annotations in the merged document.
 */
export async function mergeContentWithBackground(
  contentPdf: Buffer,
  backgroundPdf: Buffer,
): Promise<Buffer> {
  const contentDoc = await PDFDocument.load(contentPdf);
  const bgDoc = await PDFDocument.load(backgroundPdf);
  const mergedDoc = await PDFDocument.create();

  const [bgEmbed] = await mergedDoc.embedPdf(bgDoc, [0]);
  const pageIndices = contentDoc.getPages().map((_, i) => i);
  const contentEmbeds = await mergedDoc.embedPdf(contentDoc, pageIndices);

  for (let i = 0; i < contentDoc.getPageCount(); i++) {
    const { width, height } = contentDoc.getPages()[i].getSize();
    const newPage = mergedDoc.addPage([width, height]);
    newPage.drawPage(bgEmbed, { x: 0, y: 0, width, height });
    newPage.drawPage(contentEmbeds[i], { x: 0, y: 0, width, height });
  }

  // Re-attach link annotations stripped by XObject embedding.
  for (let i = 0; i < mergedDoc.getPageCount(); i++) {
    const contentPage = contentDoc.getPages()[i];
    const mergedPage = mergedDoc.getPages()[i];

    let annotsArray: PDFArray | undefined;
    try {
      annotsArray = contentPage.node.lookupMaybe(
        PDFName.of("Annots"),
        PDFArray,
      );
    } catch {
      continue;
    }
    if (!annotsArray || annotsArray.size() === 0) continue;

    const newAnnotRefs = [];

    for (let j = 0; j < annotsArray.size(); j++) {
      try {
        const annotObj = contentDoc.context.lookup(annotsArray.get(j));
        if (!(annotObj instanceof PDFDict)) continue;

        const subtype = annotObj.lookupMaybe(PDFName.of("Subtype"), PDFName);
        if (!subtype || subtype.toString() !== "/Link") continue;

        const rect = annotObj.lookupMaybe(PDFName.of("Rect"), PDFArray);
        if (!rect) continue;

        const actionObj = annotObj.lookup(PDFName.of("A"));
        if (!(actionObj instanceof PDFDict)) continue;

        const uriObj = actionObj.get(PDFName.of("URI"));
        if (!uriObj) continue;

        // Extract URI — handles both PDF literal strings (...) and hex <...>.
        const raw = uriObj.toString();
        let uri = raw;
        if (raw.startsWith("(")) uri = raw.slice(1, -1);
        else if (raw.startsWith("<"))
          uri = Buffer.from(raw.slice(1, -1), "hex").toString("utf8");
        if (!uri.startsWith("http") && !uri.startsWith("mailto:")) continue;

        const newAnnot = mergedDoc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: [
            rect.lookup(0, PDFNumber).asNumber(),
            rect.lookup(1, PDFNumber).asNumber(),
            rect.lookup(2, PDFNumber).asNumber(),
            rect.lookup(3, PDFNumber).asNumber(),
          ],
          A: { Type: "Action", S: "URI", URI: PDFString.of(uri) },
          Border: [0, 0, 0],
        });

        newAnnotRefs.push(mergedDoc.context.register(newAnnot));
      } catch {
        // Skip malformed annotation entries.
      }
    }

    if (newAnnotRefs.length > 0) {
      mergedPage.node.set(
        PDFName.of("Annots"),
        mergedDoc.context.obj(newAnnotRefs),
      );
    }
  }

  return Buffer.from(await mergedDoc.save());
}
