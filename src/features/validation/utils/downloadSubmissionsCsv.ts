import Papa from "papaparse";

import {
  Collections,
  QuestsRecord,
  SubmissionsRecord,
  UsersRecord,
  ValidatedSubmissionsResponse,
} from "@/types/pocketbase-types";
import { Status } from "@/types/types";
import pb from "@/utils/pocketbase";

import { downloadCsvFile } from "./csv";

async function getValidatedSubmissionsPage(page: number, perPage: number) {
  const result = await pb.collection(Collections.ValidatedSubmissions).getList<
    ValidatedSubmissionsResponse<
      Status,
      {
        submission: SubmissionsRecord;
        quest: QuestsRecord;
        submitter: UsersRecord;
      }
    >
  >(page, perPage, {
    expand: "submission,submitter,quest",
    fields:
      "*,expand.submission.*,expand.submitter.*,expand.quest.id,expand.quest.name,",
  });

  const fileToken = await pb.files.getToken();
  const items = result.items.map((row) => {
    let text: string | undefined = undefined;
    let url: string | undefined = undefined;
    const submission = row.expand?.submission;
    if (submission) {
      text = submission.text;
      if (submission.attachment) {
        url = pb.files.getURL(submission, submission.attachment, {
          token: fileToken,
        });
      }
    }
    return {
      id: row.id,
      userId: row.expand.submitter.id,
      userName: row.expand.submitter.name!,
      questId: row.expand.quest.id,
      questName: row.expand.quest.name,
      status: row.status as Status,
      createdAt: submission?.created,
      text,
      url,
    };
  });

  return { items, totalItems: result.totalItems };
}

async function fetchAllSubmissions() {
  const perPage = 200;
  const first = await getValidatedSubmissionsPage(1, perPage);

  if (!first.items.length) {
    return [];
  }

  const totalItems = first.totalItems;

  const items = first.items;
  for (let page = 2; page * perPage <= totalItems; page++) {
    const validatedSubmissions = await getValidatedSubmissionsPage(
      page,
      perPage,
    );
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
