import Papa from "papaparse";

import { getLeaderboard } from "@/utils/requests";

import { downloadCsvFile } from "./csv";

async function fetchAllLeaderboardRows() {
  const first = await getLeaderboard(1);
  if (!first || first.rows.length === 0) return [];

  const totalPages = Math.max(first.totalPages, 1);
  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    pagePromises.push(getLeaderboard(page));
  }
  const otherPages = await Promise.all(pagePromises);

  const allRows = [first, ...otherPages.filter(Boolean)].flatMap(
    (result) => result!.rows,
  );

  const rowsMap = new Map<string, (typeof allRows)[number]>();
  for (const r of allRows) {
    const existing = rowsMap.get(r.userId);
    if (!existing || r.rank < existing.rank) {
      rowsMap.set(r.userId, r);
    }
  }

  return Array.from(rowsMap.values()).sort((a, b) => a.rank - b.rank);
}

export async function downloadLeaderboardCsv(): Promise<void> {
  const rows = await fetchAllLeaderboardRows();
  if (!rows.length) return;

  const dateColumns = Array.from(
    new Set(rows.flatMap((row) => row.totalPerDay.map((d) => d.date))),
  ).sort();

  const header = ["rank", "userId", "userName", "total", ...dateColumns];

  const csvRows = rows.map((row) => {
    const perDayMap = new Map(
      row.totalPerDay.map((d) => [d.date, `${d.total}/${d.quests.length}`]),
    );
    return [
      row.rank,
      row.userId,
      row.userName,
      row.total,
      ...dateColumns.map((date) => perDayMap.get(date) ?? "0/0"),
    ];
  });

  const csv = Papa.unparse({
    fields: header,
    data: csvRows,
  });
  downloadCsvFile("leaderboard", csv);
}
