/* eslint-disable @typescript-eslint/no-explicit-any */
import PocketBase from "pocketbase";

import config from "../config";
import {
  Collections,
  LeaderboardResponse,
  QuestsRecord,
  QuestsWithSubmissionStatsResponse,
  SubmissionsRecord,
  TypedPocketBase,
  ValidatedSubmissionsResponse,
} from "../types/pocketbase-types";
import {
  LeaderboardRow,
  Quest,
  QuestStatus,
  QuestSubmissionContent,
  QuestSubmissionContentType,
  QuestType,
  QuestWithSubmissions,
} from "../types/types";

import { POCKETBASE_URL } from "./env";
import { aggregateQuestsByDate } from "./utils";

// Create a singleton instance with the environment variable
const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;
pb.autoCancellation(false);

// Authentication functions

/**
 * Check if the user is authenticated with PocketBase
 * @returns boolean indicating authentication status
 */
export function checkAuth() {
  return pb.authStore.isValid;
}

/**
 * Get the current authenticated user from PocketBase
 * @returns User record or null if not authenticated
 */
export function getCurrentUser() {
  if (!checkAuth()) {
    return null;
  }

  return pb.authStore.record;
}

/**
 * Get formatted user info in a consistent format
 * @returns User info object with standard fields
 */
export function getUserInfo() {
  const pbUser = getCurrentUser();

  if (pbUser) {
    // Format user from PocketBase
    return {
      id: pbUser.id,
      email: pbUser.email,
      name: pbUser.name || "",
      role: pbUser.role || [],
      token: pb.authStore.token,
      user: {
        firstName: pbUser.name?.split(" ")[0] || "",
        lastName: pbUser.name?.split(" ")[1] || "",
        email: pbUser.email,
      },
    };
  }

  return null;
}

function getCurrentUserId() {
  return pb.authStore.record?.id;
}

export const logout = () => {
  pb.authStore.clear();
};

export type TaskSubmission = { text: string; file?: File };

export const submitTask = async (
  questId: string,
  submission: TaskSubmission,
) => {
  try {
    if (!questId || !checkAuth()) {
      return false;
    }
    await pb.collection(Collections.Submissions).create({
      quest: questId,
      submitter: getCurrentUserId(),
      text: submission.text,
      attachment: submission.file,
    });
    return true;
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return false;
  }
};

export const login = async (user: any) => {
  try {
    await pb
      .collection(Collections.Users)
      .authWithPassword(user.email, user.password);

    const userInfo = getUserInfo();

    return userInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

function submissionStatus(validated_submission: any) {
  if (!validated_submission) return QuestStatus.NOTATTEMPTED;
  if (!validated_submission.validation) return QuestStatus.PENDING;
  if (validated_submission.success) return QuestStatus.CORRECT;
  return QuestStatus.WRONG;
}

export const getQuests = async (): Promise<Quest[]> => {
  try {
    if (!checkAuth()) return [];

    const [quests, validated_submissions] = await Promise.all([
      pb
        .collection(Collections.QuestsWithSubmissionStats)
        .getFullList<
          QuestsWithSubmissionStatsResponse<{ quest: QuestsRecord }>
        >({
          expand: "quest",
        }),
      pb.collection(Collections.ValidatedSubmissions).getFullList({
        filter: `submitter = '${getCurrentUserId()}'`,
      }),
    ]);

    const formattedQuests = quests.flatMap((q) => {
      const quest = q.expand.quest;
      if (!quest) return [];

      const validated_submission = validated_submissions.find(
        (s) => s.quest === quest.id,
      );

      return {
        id: quest.id,
        name: quest.name,
        type: quest.type as unknown as QuestType,
        description: quest.text,
        date: quest.date,
        category: quest.category,
        status: submissionStatus(validated_submission),
        totalAc: q.total_ac,
      };
    });

    return formattedQuests;
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return [];
  }
};

export const getQuestWithSubmissions = async (
  questId: string,
): Promise<QuestWithSubmissions | null> => {
  try {
    const [quest, validated_submissions] = await Promise.all([
      getQuests().then((quests) => quests.find((q) => q.id === questId)),
      pb
        .collection(Collections.ValidatedSubmissions)
        .getFullList<
          ValidatedSubmissionsResponse<{ submission: SubmissionsRecord }>
        >({
          filter: `quest = "${questId}" && submitter = "${getCurrentUserId()}"`,
          expand: "submission",
        }),
    ]);

    if (!quest) return null;

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

        // TODO: Rewrite this to make it more readable
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
          status: submissionStatus(validated_submission),
          content: content,
        };
      },
    );

    return { quest: quest, submissions: submissions };
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return null;
  }
};

export const getLeaderboard = async (
  pageNumber: number,
): Promise<{ rows: LeaderboardRow[]; totalPages: number } | null> => {
  try {
    const currentUserId = getCurrentUserId()!;

    const [leaderboard, currentUserRow] = await Promise.all([
      pb
        .collection(Collections.Leaderboard)
        .getList<
          LeaderboardResponse<number>
        >(pageNumber, config.LEADERBOARD_PAGE_SIZE),
      pb
        .collection(Collections.Leaderboard)
        .getOne<LeaderboardResponse<number>>(currentUserId),
    ]);

    // If our user not in the leaderboard, we need to add them
    if (!leaderboard.items.some((user) => user.id === currentUserId)) {
      if (currentUserRow.rank ?? 0 < (leaderboard.items[0]?.rank ?? 0)) {
        leaderboard.items.unshift(currentUserRow);
      } else {
        leaderboard.items.push(currentUserRow);
      }
    }

    const [validated_submissions, quests] = await Promise.all([
      pb.collection(Collections.ValidatedSubmissions).getFullList({
        filter: leaderboard.items
          .map((item) => `submitter="${item.id}"`)
          .join("||"),
      }),
      pb.collection(Collections.Quests).getFullList(),
    ]);

    const questsByDate = aggregateQuestsByDate(quests);

    const createLeaderboardRowDayQuest = (
      quest: QuestsRecord,
      userId: string,
    ) => {
      const validated_submission = validated_submissions.find(
        (s) => s.quest === quest.id && s.submitter === userId,
      );
      return {
        id: quest.id,
        name: quest.name,
        status: submissionStatus(validated_submission),
      };
    };

    const createLeaderboardRow = (user: LeaderboardResponse<number>) => {
      return {
        rank: user.rank ?? 0,
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
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return null;
  }
};

// Note: userInfo parameter is kept for compatibility but ignored
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getQuestsSubmissions = async (status: string, userInfo?: any) => {
  return null;
};

// Note: userInfo parameter is kept for compatibility but ignored
export const updateQuestSubmissionStatus = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submissionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  status: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  email?: any, // Changed to any to address type error with UserInfo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  questId?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userInfo?: any,
) => {
  return null;
};
