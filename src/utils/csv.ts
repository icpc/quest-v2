export function downloadCsvFile(filenameBase: string, csv: string): void {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const ts = now.toISOString().replace(/[:T]/g, "-").split(".")[0];
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenameBase}-${ts}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
