import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import RoutePending from "@/components/RoutePending";
import LeaderBoard from "@/features/leaderboard/Leaderboard";
import { formatDate } from "@/utils/human-readable-date";
import { aggregateQuestsByDate } from "@/utils/utils";
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

const leaderboardSearchSchema = z.object({
  page: z.coerce.number().default(1),
});

function submissionStatus(status: Status | undefined | null) {
  if (!status) return QuestStatus.NOTATTEMPTED;
  return status as QuestStatus;
}

export const Route = createFileRoute("/_auth/leaderboard")({
  validateSearch: zodValidator(leaderboardSearchSchema),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => {
    const pageNumber =
      Number.isFinite(deps.page) && deps.page > 0 ? deps.page : 1;
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
          filter: leaderboard.items
            .map((item) => `submitter="${item.id}"`)
            .join("||"),
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

    const rows = leaderboard.items.map(createLeaderboardRow);
    const columnsNames =
      rows.length > 0
        ? [
            "Rank",
            "Name",
            "Total",
            ...rows[0].totalPerDay.map((day) =>
              formatDate(day.date, { month: "short", day: "numeric" }),
            ),
          ]
        : [];

    return { rows, totalPages: leaderboard.totalPages, columnsNames, pageNumber };
  },
  pendingComponent: RoutePending,
  component: LeaderboardRouteContent,
});

function LeaderboardRouteContent() {
  const { rows, totalPages, columnsNames, pageNumber } = Route.useLoaderData();

  if (rows.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          color: "#343a40",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <p>No Submissions Yet!</p>
      </div>
    );
  }
  return (
    <LeaderBoard
      rows={rows}
      _columnsNames={columnsNames}
      pageNumber={pageNumber}
      totalPages={totalPages}
    />
  );
}
