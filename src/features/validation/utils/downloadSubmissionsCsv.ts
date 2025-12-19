import Papa from "papaparse";

import { downloadCsvFile } from "./csv";
import { getValidatedSubmissions } from "@/utils/requests";

async function fetchAllSubmissions() {
  const perPage = 200;
  const first = await getValidatedSubmissions({ page: 1, perPage });

  if (!first.items.length) {
    return [];
  }

  const totalItems = first.totalItems;

  const items = first.items;
  for (let page = 2; page * perPage <= totalItems; page++) {
    const validatedSubmissions = await getValidatedSubmissions({
      page,
      perPage,
    });
    items.push(...validatedSubmissions.items);
  }
  return items;
}

export async function downloadSubmissionsCsv(): Promise<void> {
  const submissions = await fetchAllSubmissions();

  if (!submissions.length) return;

  const header = [
    "id",
    "created_at",
    "quest",
    "user",
    "status",
    "answer_text",
    "attachment_url",
  ];

  const rows = submissions.map((submission) => [
    submission.id,
    submission.createdAt ?? "",
    submission.questName,
    submission.userName,
    submission.status,
    submission.text ?? "",
    submission.url ?? "",
  ]);

  const csv = Papa.unparse({
    fields: header,
    data: rows,
  });
  downloadCsvFile("submissions", csv);
}
