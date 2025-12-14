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
  UsersRecord,
  ValidatedQuestsResponse,
  ValidatedSubmissionsResponse,
  WebsiteSettingsAuthOptions,
  WebsiteSettingsResponse,
} from "../types/pocketbase-types";
import {
  LeaderboardRow,
  Quest,
  QuestStatus,
  QuestSubmissionContent,
  QuestSubmissionContentType,
  QuestSummary,
  QuestType,
  QuestWithSubmissions,
  Status,
  ValidatedSubmissionsListResult,
} from "../types/types";

import { POCKETBASE_URL } from "./env";
import { aggregateQuestsByDate } from "./utils";

export type WebsiteSettingsData = {
  auth: WebsiteSettingsAuthOptions[];
  logo?: string;
  name: string;
  rules?: string;
};

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

  return pb.authStore.record as unknown as UsersRecord;
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
      token: pb.authStore.token,
      canValidate: pbUser.can_validate,
      user: {
        firstName: pbUser.name?.split(" ").at(0) || "",
        lastName: pbUser.name?.split(" ").at(1) || "",
        email: pbUser.email,
      },
    };
  }

  return null;
}

function getCurrentUserId() {
  return pb.authStore.record?.id;
}

function getCurrentUserName() {
  return pb.authStore.record?.name || "undefinedUser";
}

function appendSubmissionPrefix(questId: string, file?: File) {
  if (!file) return undefined;
  const newName = `${questId}_${getCurrentUserName()}_${file.name}`;
  return new File([file], newName, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

export const logout = () => {
  pb.authStore.clear();
};

export const getWebsiteSettings =
  async (): Promise<WebsiteSettingsData | null> => {
    try {
      const record = await pb
        .collection(Collections.WebsiteSettings)
        .getFirstListItem<WebsiteSettingsResponse>("");

      return {
        auth: record.auth,
        logo: record.logo?.trim()
          ? pb.files.getURL(record, record.logo)
          : undefined,
        name: record.name,
        rules: record.rules,
      };
    } catch (error) {
      console.error("Error fetching settings:", error);
      return null;
    }
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
    const attachment = appendSubmissionPrefix(questId, submission.file);
    await pb.collection(Collections.Submissions).create({
      quest: questId,
      submitter: getCurrentUserId(),
      text: submission.text,
      attachment,
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

export const loginOIDC = async () => {
  try {
    await pb.collection(Collections.Users).authWithOAuth2({
      provider: "oidc",
      createData: { can_submit: true },
    });

    const userInfo = getUserInfo();

    return userInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

function submissionStatus(status: Status | undefined | null) {
  if (!status) return QuestStatus.NOTATTEMPTED;
  return status as QuestStatus;
}

export const getQuestsWithSubmissionStats = async (): Promise<
  QuestSummary[]
> => {
  try {
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

    const formattedQuests = quests.flatMap((q) => {
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
    const [questRecord, questStatus, validated_submissions] = await Promise.all(
      [
        pb.collection(Collections.Quests).getOne<QuestsRecord>(questId),
        pb
          .collection(Collections.ValidatedQuests)
          .getFullList<
            ValidatedQuestsResponse<Status>
          >({ filter: `quest = "${questId}" && submitter = "${getCurrentUserId()}"` }),
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
          status: submissionStatus(validated_submission.status),
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
        .getList(pageNumber, config.LEADERBOARD_PAGE_SIZE),
      pb
        .collection(Collections.Leaderboard)
        .getOne(currentUserId)
        .catch(() => undefined),
    ]);

    // If current user not in the leaderboard, we need to add them
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
      pb.collection(Collections.Quests).getFullList(),
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

    const createLeaderboardRow = (user: LeaderboardResponse) => {
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
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return null;
  }
};

export const getValidatedSubmissions = async (
  filters: {
    userId?: string;
    questId?: string;
    status?: Status;
    page?: number;
    perPage?: number;
  } = {},
): Promise<ValidatedSubmissionsListResult> => {
  try {
    const filterArr = [];
    if (filters.userId) filterArr.push(`submitter = "${filters.userId}"`);
    if (filters.questId) filterArr.push(`quest = "${filters.questId}"`);
    if (filters.status) filterArr.push(`status = "${filters.status}"`);
    const filter = filterArr.join(" && ");
    const page = filters.page || 1;
    const perPage = filters.perPage || 20;
    const result = await pb
      .collection(Collections.ValidatedSubmissions)
      .getList<
        ValidatedSubmissionsResponse<
          Status,
          {
            submission: SubmissionsRecord;
            quest: QuestsRecord;
            submitter: UsersRecord;
          }
        >
      >(page, perPage, {
        filter: filter || undefined,
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
      console.log(row);
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
  } catch (error) {
    console.error("Error fetching validated submissions:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return { items: [], totalItems: 0 };
  }
};

export const setValidatedSubmissionStatus = async (
  submissionId: string,
  success: boolean | "clear",
) => {
  try {
    // Remove the previous status
    await pb
      .collection(Collections.Validations)
      .getFirstListItem(`submission = "${submissionId}"`)
      .then(
        (validation) =>
          pb.collection(Collections.Validations).delete(validation.id),
        () => null,
      );

    if (success !== "clear") {
      await pb.collection(Collections.Validations).create({
        submission: submissionId,
        success,
      });
    }
    return true;
  } catch (error) {
    console.error("Error creating validation record:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return false;
  }
};

/**
 * Fetch all users and quests for filter dropdowns
 */
export const getUsersAndQuestsForFilters = async (): Promise<{
  users: { id: string; name: string }[];
  quests: { id: string; name: string }[];
}> => {
  try {
    const [users, quests] = await Promise.all([
      pb
        .collection(Collections.Users)
        .getFullList<UsersRecord>({ fields: "id,name" }),
      pb
        .collection(Collections.Quests)
        .getFullList<QuestsRecord>({ fields: "id,name" }),
    ]);
    return {
      users: users.map((u) => ({ id: u.id, name: u.name || "(no name)" })),
      quests: quests.map((q) => ({ id: q.id, name: q.name })),
    };
  } catch (error) {
    console.error("Error fetching users/quests:", error);
    return { users: [], quests: [] };
  }
};
