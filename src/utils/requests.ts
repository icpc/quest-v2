import PocketBase from "pocketbase";

import {
  Quest,
  QuestStatus,
  QuestSubmissionContent,
  QuestSubmissionContentType,
  QuestType,
  QuestWithSubmissions,
} from "../types/types";

import { POCKETBASE_URL } from "./env";

// Create a singleton instance with the environment variable
const pb = new PocketBase(POCKETBASE_URL);
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

/**
 * Log out the current user
 */
export const logout = () => {
  pb.authStore.clear();
  localStorage.removeItem("userInfo");
  localStorage.removeItem("isAuthenticated");
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
    await pb.collection("submissions").create({
      quest: questId,
      submitter: pb.authStore.record?.id,
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
    await pb.collection("users").authWithPassword(user.email, user.password);

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
      pb.collection("quests_with_submission_stats").getFullList({
        expand: "quest",
      }),
      pb.collection("validated_submissions").getFullList({
        filter: `submitter = '${getCurrentUserId()}'`,
      }),
    ]);

    const formattedQuests = quests.flatMap((q) => {
      const quest = q.expand?.quest;
      if (!quest) return [];

      const validated_submission = validated_submissions.find(
        (s) => s.quest === quest.id,
      );

      return {
        id: quest.id,
        name: quest.name,
        type: quest.type,
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
      pb.collection("validated_submissions").getFullList({
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
          return pb.files.getURL(submission, submission.attachment, {
            token: fileToken,
          });
        }

        // TODO: Rewrite this to make it more readable
        const content: QuestSubmissionContent =
          quest.type === QuestType.TEXT
            ? { type: QuestSubmissionContentType.TEXT, text: submission.text }
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
          uploadTime: submission.created,
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

// Note: userInfo parameter is kept for compatibility but ignored
export const getLeaderboard = async (pageNumber: any, userInfo?: any) => {
  try {
    if (!checkAuth()) return null;

    if (!pageNumber) pageNumber = 1;
    const pageSize = 10;

    // Using the total_scores_example view
    const records = await pb
      .collection("total_scores_example")
      .getList(pageNumber, pageSize, {
        sort: "-total_score,-successful_submissions",
      });

    // Get current user info
    const currentUser = getCurrentUser();

    // Find current user's rank and score if available
    let currentUserRank = 0;
    let currentUserTotal = "0";

    // Try to find current user in leaderboard
    if (currentUser) {
      // Get all records to find user's position
      const allRecords = await pb
        .collection("total_scores_example")
        .getFullList({
          sort: "-total_score,-successful_submissions",
        });

      const userIndex = allRecords.findIndex(
        (item) =>
          item.user_name?.split(" ")[0] === currentUser.name?.split(" ")[0] &&
          item.user_name?.split(" ")[1] === currentUser.name?.split(" ")[1],
      );

      if (userIndex !== -1) {
        currentUserRank = userIndex + 1;
        currentUserTotal = allRecords[userIndex].total_score?.toString() || "0";
      }
    }

    // Create a sample totalPerDay with proper structure for frontend
    // Since PocketBase doesn't have this data, we'll create a placeholder
    const today = new Date();
    const sampleTotalPerDay = [
      {
        date: today.toISOString().split("T")[0],
        total: "0",
        quests: [], // Empty quests array
      },
    ];

    // Format response to match ILeaderboard interface
    return {
      result: records.items.map((item, index) => {
        const firstName = item.user_name?.split(" ")[0] || "";
        const lastName = item.user_name?.split(" ")[1] || "";

        return {
          rank: index + 1 + (pageNumber - 1) * pageSize,
          firstName,
          lastName,
          email: "", // Not available in the view
          total: item.total_score?.toString() || "0",
          totalPerDay: sampleTotalPerDay, // Provide the required structure
        };
      }),
      totalUsers: records.totalItems,
      curUser: {
        rank: currentUserRank,
        firstName: currentUser?.name?.split(" ")[0] || "",
        lastName: currentUser?.name?.split(" ")[1] || "",
        email: currentUser?.email || "",
        total: currentUserTotal,
        totalPerDay: sampleTotalPerDay, // Provide the required structure
      },
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
export const getQuestsSubmissions = async (status: string, userInfo?: any) => {
  try {
    if (!checkAuth()) return null;

    let filter = "";

    if (status === "accepted") {
      filter = "validations.success=true";
    } else if (status === "pending") {
      filter = "validations.id=null";
    } else if (status === "rejected") {
      filter = "validations.success=false";
    }

    const records = await pb.collection("submissions").getFullList({
      filter: filter,
      expand: "submitter,quest,validations",
    });

    // Format the submissions for the admin interface
    return records.map((record) => {
      const submitter = record.expand?.submitter || {};
      const quest = record.expand?.quest || {};

      // Determine status from validations
      let submissionStatus = "PENDING";
      if (record.expand?.validations) {
        submissionStatus = record.expand.validations.success
          ? "ACCEPTED"
          : "WRONG";
      }

      return {
        id: record.id,
        questId: quest.id,
        name: quest.name,
        firstName: submitter.name?.split(" ")[0] || "",
        lastName: submitter.name?.split(" ")[1] || "",
        email: submitter.email || "",
        correctAnswer: quest.correctAnswer || "",
        submissions: [
          {
            id: record.id,
            answer:
              record.text ||
              (record.attachments && record.attachments.length > 0
                ? pb.files.getUrl(record, record.attachments[0])
                : ""),
            submissionType: quest.questType || "TEXT",
            status: submissionStatus,
          },
        ],
      };
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return null;
  }
};

// Note: userInfo parameter is kept for compatibility but ignored
export const updateQuestSubmissionStatus = async (
  submissionId: string,
  status: string,
  email?: any, // Changed to any to address type error with UserInfo
  questId?: string,
  userInfo?: any,
) => {
  try {
    if (!checkAuth() || !submissionId) return null;

    // Check if validation record exists
    let validationRecord;
    try {
      validationRecord = await pb
        .collection("validations")
        .getFirstListItem(`submission="${submissionId}"`);
    } catch (e) {
      // If no validation record exists, create one
      validationRecord = null;
    }

    const success = status === "ACCEPTED";

    if (validationRecord) {
      // Update existing validation
      await pb.collection("validations").update(validationRecord.id, {
        success: success,
      });
    } else {
      // Create new validation
      await pb.collection("validations").create({
        submission: submissionId,
        success: success,
      });
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes("401")) {
      logout();
    }
    return null;
  }
};
