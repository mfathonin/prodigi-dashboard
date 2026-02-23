"use client";

export type QRDownloadData = { canvas: HTMLCanvasElement; name: string };

export const downloadQRCodes = async (
  data: QRDownloadData | QRDownloadData[],
  zipName?: string
) => {
  const isBlobSupported = typeof Blob !== "undefined";
  const isCanvasBlobSupported =
    typeof HTMLCanvasElement !== "undefined" &&
    typeof HTMLCanvasElement.prototype.toBlob === "function";

  if (!isBlobSupported || !isCanvasBlobSupported) {
    throw new Error("Browser anda tidak mendukung fitur ini");
  }

  const [{ saveAs }, { default: JSZip }] = await Promise.all([
    import("file-saver"),
    import("jszip"),
  ]);

  if (Array.isArray(data) && zipName) {
    const zip = new JSZip();
    const folder = zip.folder(zipName);
    if (!folder) throw new Error("Error creating zip folder");

    const promises = data.map((item, index) => {
      const { canvas, name } = item;
      return new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Blob is not supported"));
            return;
          }

          folder.file(
            `${(index + 1).toString().padStart(3, "0")}. ${name}.png`,
            blob,
            { binary: true }
          );
          resolve();
        });
      });
    });

    await Promise.all(promises);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${zipName}.zip`);
    return;
  }

  if (!Array.isArray(data)) {
    const { canvas, name } = data;
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `${name}.png`);
    });
  }
};
