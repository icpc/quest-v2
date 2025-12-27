import { createFileRoute, useRouter } from "@tanstack/react-router";

import RoutePending from "@/components/RoutePending";
import QuestComponent from "@/features/quests/Quest";
import {
  Collections,
  QuestsRecord,
  SubmissionsRecord,
  ValidatedQuestsResponse,
  ValidatedSubmissionsResponse,
} from "@/types/pocketbase-types";
import {
  Quest,
  QuestStatus,
  QuestSubmissionContent,
  QuestSubmissionContentType,
  QuestType,
  QuestWithSubmissions,
  Status,
} from "@/types/types";
import { getCurrentUserId } from "@/utils/auth";
import pb from "@/utils/pocketbase";

function submissionStatus(status: Status | undefined | null) {
  if (!status) return QuestStatus.NOTATTEMPTED;
  return status as QuestStatus;
}

export const Route = createFileRoute("/_auth/quest-details/$questId")({
  loader: async ({
    params: { questId },
  }): Promise<QuestWithSubmissions | null> => {
    const [questRecord, questStatus, validated_submissions] = await Promise.all(
      [
        pb.collection(Collections.Quests).getOne<QuestsRecord>(questId),
        pb
          .collection(Collections.ValidatedQuests)
          .getFullList<ValidatedQuestsResponse<Status>>({
            filter: `quest = "${questId}" && submitter = "${getCurrentUserId()}"`,
          }),
        pb
          .collection(Collections.ValidatedSubmissions)
          .getFullList<
            ValidatedSubmissionsResponse<
              Status,
              { submission: SubmissionsRecord }
            >
          >({
            filter: `quest = "${questId}" && submitter = "${getCurrentUserId()}"`,
            expand: "submission",
          }),
      ],
    );

    const quest: Quest = {
      id: questRecord.id,
      name: questRecord.name,
      type: questRecord.type as unknown as QuestType,
      description: questRecord.text,
      status: submissionStatus(questStatus.at(0)?.status),
      date: questRecord.date,
      category: questRecord.category,
    };

    const fileToken = await pb.files.getToken();
    const submissions = validated_submissions.flatMap(
      (validated_submission) => {
        const submission = validated_submission.expand?.submission;
        if (!submission) return [];

        function getAttachmentUrl() {
          return pb.files.getURL(submission, submission.attachment!, {
            token: fileToken,
          });
        }

        const content: QuestSubmissionContent =
          quest.type === QuestType.TEXT
            ? {
                type: QuestSubmissionContentType.TEXT,
                text: submission.text!,
              }
            : quest.type === QuestType.IMAGE
              ? {
                  type: QuestSubmissionContentType.IMAGE,
                  url: getAttachmentUrl(),
                }
              : {
                  type: QuestSubmissionContentType.VIDEO,
                  url: getAttachmentUrl(),
                };

        return {
          id: submission.id,
          uploadTime: submission.created!,
          status: submissionStatus(validated_submission.status),
          content,
        };
      },
    );

    return { quest, submissions };
  },
  pendingComponent: RoutePending,
  component: QuestRouteContent,
});

function QuestRouteContent() {
  const router = useRouter();
  const questWithSubmissions = Route.useLoaderData();

  if (!questWithSubmissions) {
    return <div>This quest not found</div>;
  }
  return (
    <QuestComponent
      quest={questWithSubmissions.quest}
      submissions={questWithSubmissions.submissions}
      onSubmit={() => router.invalidate()}
    />
  );
}
