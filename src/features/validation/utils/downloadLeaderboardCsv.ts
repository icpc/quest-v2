import Papa from "papaparse";

import config from "@/config";
import {
  Collections,
  LeaderboardResponse,
  QuestsRecord,
  ValidatedQuestsResponse,
} from "@/types/pocketbase-types";
import { LeaderboardRow, QuestStatus, Status } from "@/types/types";
import { getCurrentUserId } from "@/utils/auth";
import pb from "@/utils/pocketbase";
import { aggregateQuestsByDate } from "@/utils/utils";

import { downloadCsvFile } from "./csv";

function submissionStatus(status: Status | undefined | null) {
  if (!status) return QuestStatus.NOTATTEMPTED;
  return status as QuestStatus;
}

async function getLeaderboardPage(pageNumber: number): Promise<{
  rows: LeaderboardRow[];
  totalPages: number;
}> {
  const currentUserId = getCurrentUserId()!;

  const [leaderboard, currentUserRow] = await Promise.all([
    pb
      .collection(Collections.Leaderboard)
      .getList(pageNumber, config.LEADERBOARD_PAGE_SIZE),
    pb
      .collection(Collections.Leaderboard)
      .getOne(currentUserId)
      .catch(() => undefined),
  ]);

  if (
    currentUserRow &&
    !leaderboard.items.some((user) => user.id === currentUserId)
  ) {
    if (currentUserRow.rank < (leaderboard.items.at(0)?.rank ?? 0)) {
      leaderboard.items.unshift(currentUserRow);
    } else {
      leaderboard.items.push(currentUserRow);
    }
  }

  const [validated_quests, quests] = await Promise.all([
    pb
      .collection(Collections.ValidatedQuests)
      .getFullList<ValidatedQuestsResponse<Status>>({
        filter: leaderboard.items.map((item) => `submitter="${item.id}"`).join("||"),
      }),
    pb.collection(Collections.Quests).getFullList<QuestsRecord>(),
  ]);

  const questsByDate = aggregateQuestsByDate(quests);

  const createLeaderboardRowDayQuest = (
    quest: QuestsRecord,
    userId: string,
  ) => {
    const validated_quest = validated_quests.find(
      (s) => s.quest === quest.id && s.submitter === userId,
    );
    return {
      id: quest.id,
      name: quest.name,
      status: submissionStatus(validated_quest?.status),
    };
  };

  const createLeaderboardRow = (user: LeaderboardResponse): LeaderboardRow => {
    return {
      rank: user.rank,
      userId: user.id,
      userName: user.name,
      total: user.total_solved,
      totalPerDay: questsByDate.map(({ date, detailsQuests }) => {
        const quests = detailsQuests.map((quest) =>
          createLeaderboardRowDayQuest(quest, user.id),
        );
        const total = quests.filter(
          (quest) => quest.status === QuestStatus.CORRECT,
        ).length;
        return {
          date,
          total,
          quests,
        };
      }),
    };
  };

  return {
    rows: leaderboard.items.map(createLeaderboardRow),
    totalPages: leaderboard.totalPages,
  };
}

async function fetchAllLeaderboardRows() {
  const first = await getLeaderboardPage(1);
  if (!first || first.rows.length === 0) return [];

  const totalPages = Math.max(first.totalPages, 1);
  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    pagePromises.push(getLeaderboardPage(page));
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
