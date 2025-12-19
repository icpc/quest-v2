import { createFileRoute } from "@tanstack/react-router";

import RoutePending from "@/components/RoutePending";
import Home from "@/features/home/Home";
import {
  Collections,
  QuestsRecord,
  QuestsWithSubmissionStatsResponse,
  ValidatedQuestsResponse,
} from "@/types/pocketbase-types";
import { QuestStatus, QuestSummary, Status } from "@/types/types";
import { getCurrentUserId } from "@/utils/auth";
import pb from "@/utils/pocketbase";

function submissionStatus(status: Status | undefined | null) {
  if (!status) return QuestStatus.NOTATTEMPTED;
  return status as QuestStatus;
}

export const Route = createFileRoute("/_auth/home")({
  loader: async (): Promise<QuestSummary[]> => {
    const [quests, validated_quests] = await Promise.all([
      pb.collection(Collections.QuestsWithSubmissionStats).getFullList<
        QuestsWithSubmissionStatsResponse<{
          quest: Pick<QuestsRecord, "id" | "name" | "date" | "category">;
        }>
      >({
        expand: "quest",
        fields:
          "*,expand.quest.id,expand.quest.name,expand.quest.date,expand.quest.category",
      }),
      pb
        .collection(Collections.ValidatedQuests)
        .getFullList<ValidatedQuestsResponse<Status>>({
          filter: `submitter = '${getCurrentUserId()}'`,
        }),
    ]);

    return quests.flatMap((q) => {
      const quest = q.expand.quest;
      if (!quest) return [];

      const validated_quest = validated_quests.find(
        (s) => s.quest === quest.id,
      );

      return [
        {
          id: quest.id,
          name: quest.name,
          date: quest.date,
          category: quest.category,
          status: submissionStatus(validated_quest?.status),
          totalAc: q.total_ac ?? 0,
        },
      ];
    });
  },
  pendingComponent: RoutePending,
  component: HomeRouteContent,
});

function HomeRouteContent() {
  const quests = Route.useLoaderData();

  if (!quests || quests.length === 0) {
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
        <p>🚀 Quests will be available soon!</p>
      </div>
    );
  }
  return <Home quests={quests} />;
}
