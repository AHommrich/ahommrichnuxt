// Shared PDF download flow for /lebenslauf and /anschreiben — fetches a PDF
// blob from the given endpoint and triggers a browser download.
export function useDocumentPdf(filename: string) {
  const isPdfLoading = ref(false);

  async function downloadPdf(url: string, init?: RequestInit) {
    isPdfLoading.value = true;
    try {
      const response = await fetch(url, init);
      if (!response.ok) throw new Error("PDF-Generierung fehlgeschlagen");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      isPdfLoading.value = false;
    }
  }

  return { isPdfLoading, downloadPdf };
}
