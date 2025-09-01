import { getLeaderboard } from "./requests";

// Simple CSV escaper
function escapeCsv(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function downloadLeaderboardCsv(): Promise<void> {
  const first = await getLeaderboard(1);
  if (!first || first.rows.length === 0) return;

  const totalPages = first.totalPages || 1;
  const dateColumns = first.rows[0].totalPerDay.map((d) => d.date);

  const rowsMap = new Map<string, (typeof first.rows)[number]>();

  // Fetch all pages sequentially to avoid rate issues
  for (let page = 1; page <= totalPages; page++) {
    const data = page === 1 ? first : await getLeaderboard(page);
    if (!data) continue;
    for (const r of data.rows) {
      // Deduplicate by userId, keep the lowest rank encountered
      const existing = rowsMap.get(r.userId);
      if (!existing || r.rank < existing.rank) {
        rowsMap.set(r.userId, r);
      }
    }
  }

  const rows = Array.from(rowsMap.values()).sort((a, b) => a.rank - b.rank);

  const header = [
    "rank",
    "userId",
    "userName",
    "total",
    ...dateColumns.map((d) => d),
  ];

  const lines: string[] = [];
  lines.push(header.map(escapeCsv).join(","));

  for (const r of rows) {
    const perDayMap = new Map(
      r.totalPerDay.map((d) => [d.date, `${d.total}/${d.quests.length}`]),
    );
    const record = [
      r.rank,
      r.userId,
      r.userName,
      r.total,
      ...dateColumns.map((d) => perDayMap.get(d) ?? "0/0"),
    ];
    lines.push(record.map(escapeCsv).join(","));
  }

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const now = new Date();
  const ts = now.toISOString().replace(/[:T]/g, "-").split(".")[0];
  link.download = `leaderboard-${ts}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
