import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from './env';
import { QuestStatus, Quest } from '../types/types';

// Create a singleton instance with the environment variable
const pb = new PocketBase(POCKETBASE_URL);

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

  return pb.authStore.model;
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
      name: pbUser.name || '',
      role: pbUser.role || [],
      token: pb.authStore.token,
      user: {
        firstName: pbUser.name?.split(' ')[0] || '',
        lastName: pbUser.name?.split(' ')[1] || '',
        email: pbUser.email
      }
    };
  }

  return null;
}

/**
 * Log out the current user
 */
export const logout = () => {
  pb.authStore.clear();
  localStorage.removeItem("userInfo");
  localStorage.removeItem("isAuthenticated");
};

// API Functions

// Note: userInfo parameter is kept for compatibility but ignored
export const submitTask = async (submission: any, userInfo?: any) => {
  try {
    if (!submission.questId || !checkAuth()) {
      return null;
    }

    const submitterId = pb.authStore.model?.id

    if (submission.type === "text") {
      if (!submission.text || submission.text === "") {
        return null;
      }
      const record = await pb.collection('submissions').create({
        "quest": submission.questId,
        "submitter": submitterId,
        "text": submission.text
      });

      return record.text || '';
    } else {
      // Create the submission using the blob approach
      const record = await pb.collection('submissions').create({
        "quest": submission.questId,
        "submitter": submitterId,
        "attachments": [submission.file]
      });

      // For file submissions, return the file URL to be shown in the UI
      if (submission.type !== "text" && record.attachments && record.attachments.length > 0) {
        return pb.files.getUrl(record, record.attachments[0]);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes('401')) {
      logout();
    }
    return null;
  }
};

export const login = async (user: any) => {
  try {
    const authData = await pb.collection('users').authWithPassword(
      user.email,
      user.password
    );

    // Store auth in localStorage for persistence across page reloads
    localStorage.setItem("isAuthenticated", "true");

    // Get user info
    const userInfo = getUserInfo();

    return userInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getQuests = async (): Promise<Quest[]> => {
  try {
    if (!checkAuth()) return [];

    const [quests, userSubmissions] = await Promise.all([
      pb.collection('quests_with_submission_stats').getFullList({
        expand: 'quest'
      }),
      pb.collection('validated_submissions').getFullList({
        filter: `submitter = '${pb.authStore.record?.id}'`
      })
    ]);

    const formattedQuests = quests.flatMap(q => {
      if (!q.expand?.quest) return [];

      const quest = q.expand.quest;
      const submission = userSubmissions.find(s => s.quest === quest.id);
      const status = (() => {
        if (!submission) return QuestStatus.NOTATTEMPTED;
        if (!submission.validation) return QuestStatus.PENDING;
        if (submission.success) return QuestStatus.CORRECT;
        return QuestStatus.WRONG;
      })();

      return {
        id: quest.id,
        name: quest.name,
        type: quest.type,
        description: quest.text,
        date: quest.date,
        category: quest.category,
        status: status,
        totalAc: q.total_ac,
      };
    });

    return formattedQuests;
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes('401')) {
      logout();
    }
    return [];
  }
};

// Note: userInfo parameter is kept for compatibility but ignored
export const getQuestSubmissions = async (questId: any, userInfo?: any) => {
  try {
    if (!checkAuth() || !questId) return null;

    try {
      // Get quest details
      const quest = await pb.collection('quests').getOne(questId);

      // Get submissions for this quest
      const submissions = await pb.collection('submissions').getFullList({
        filter: `quest = "${questId}"`,
        expand: 'submitter,quest,validations'
      });

      // Get current user submissions statuses
      const currentUserId = pb.authStore.model?.id;
      let questStatus = 'NOT ATTEMPTED';

      // Check if there are any submissions and update status accordingly
      const userSubmissions = submissions.filter(sub => sub.submitter === currentUserId);
      if (userSubmissions.length > 0) {
        const lastSubmission = userSubmissions[0];
        if (lastSubmission.expand?.validations) {
          questStatus = lastSubmission.expand.validations.success ? 'ACCEPTED' : 'WRONG';
        } else {
          questStatus = 'PENDING';
        }
      }

      // Format response to match QuestSubmissions interface
      const formattedResponse = {
        id: quest.id,
        questName: quest.name || '',
        questDate: quest.created,
        questType: quest.questType || 'TEXT',
        questDescription: quest.text || '',
        questStatus: questStatus,
        questAcceptSubmissions: true,
        questCategory: quest.category || '',
        submissions: userSubmissions
          .map(sub => {
            // Determine status from validations
            let status = 'PENDING';
            if (sub.expand?.validations) {
              status = sub.expand.validations.success ? 'ACCEPTED' : 'WRONG';
            }

            return {
              id: sub.id,
              answer: sub.text || (sub.attachments && sub.attachments.length > 0 ?
                pb.files.getUrl(sub, sub.attachments[0]) : ''),
              uploadTime: sub.created,
              status: status,
              submissionType: quest.questType || 'TEXT'
            };
          })
          .sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()) // Sort newest first
      };

      return formattedResponse;
    } catch (e) {
      console.error("Error in quest processing:", e);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes('401')) {
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
    const records = await pb.collection('total_scores_example').getList(pageNumber, pageSize, {
      sort: '-total_score,-successful_submissions'
    });

    // Get current user info
    const currentUser = getCurrentUser();

    // Find current user's rank and score if available
    let currentUserRank = 0;
    let currentUserTotal = '0';

    // Try to find current user in leaderboard
    if (currentUser) {
      // Get all records to find user's position
      const allRecords = await pb.collection('total_scores_example').getFullList({
        sort: '-total_score,-successful_submissions'
      });

      const userIndex = allRecords.findIndex(item =>
        item.user_name?.split(' ')[0] === currentUser.name?.split(' ')[0] &&
        item.user_name?.split(' ')[1] === currentUser.name?.split(' ')[1]
      );

      if (userIndex !== -1) {
        currentUserRank = userIndex + 1;
        currentUserTotal = allRecords[userIndex].total_score?.toString() || '0';
      }
    }

    // Create a sample totalPerDay with proper structure for frontend
    // Since PocketBase doesn't have this data, we'll create a placeholder
    const today = new Date();
    const sampleTotalPerDay = [
      {
        date: today.toISOString().split('T')[0],
        total: "0",
        quests: [] // Empty quests array
      }
    ];

    // Format response to match ILeaderboard interface
    return {
      result: records.items.map((item, index) => {
        const firstName = item.user_name?.split(' ')[0] || '';
        const lastName = item.user_name?.split(' ')[1] || '';

        return {
          rank: index + 1 + (pageNumber - 1) * pageSize,
          firstName,
          lastName,
          email: '', // Not available in the view
          total: item.total_score?.toString() || '0',
          totalPerDay: sampleTotalPerDay // Provide the required structure
        };
      }),
      totalUsers: records.totalItems,
      curUser: {
        rank: currentUserRank,
        firstName: currentUser?.name?.split(' ')[0] || '',
        lastName: currentUser?.name?.split(' ')[1] || '',
        email: currentUser?.email || '',
        total: currentUserTotal,
        totalPerDay: sampleTotalPerDay // Provide the required structure
      }
    };
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes('401')) {
      logout();
    }
    return null;
  }
};

// Note: userInfo parameter is kept for compatibility but ignored
export const getQuestsSubmissions = async (status: string, userInfo?: any) => {
  try {
    if (!checkAuth()) return null;

    let filter = '';

    if (status === 'accepted') {
      filter = 'validations.success=true';
    } else if (status === 'pending') {
      filter = 'validations.id=null';
    } else if (status === 'rejected') {
      filter = 'validations.success=false';
    }

    const records = await pb.collection('submissions').getFullList({
      filter: filter,
      expand: 'submitter,quest,validations'
    });

    // Format the submissions for the admin interface
    return records.map(record => {
      const submitter = record.expand?.submitter || {};
      const quest = record.expand?.quest || {};

      // Determine status from validations
      let submissionStatus = 'PENDING';
      if (record.expand?.validations) {
        submissionStatus = record.expand.validations.success ? 'ACCEPTED' : 'WRONG';
      }

      return {
        id: record.id,
        questId: quest.id,
        name: quest.name,
        firstName: submitter.name?.split(' ')[0] || '',
        lastName: submitter.name?.split(' ')[1] || '',
        email: submitter.email || '',
        correctAnswer: quest.correctAnswer || '',
        submissions: [{
          id: record.id,
          answer: record.text || (record.attachments && record.attachments.length > 0 ?
            pb.files.getUrl(record, record.attachments[0]) : ''),
          submissionType: quest.questType || 'TEXT',
          status: submissionStatus
        }]
      };
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes('401')) {
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
  userInfo?: any
) => {
  try {
    if (!checkAuth() || !submissionId) return null;

    // Check if validation record exists
    let validationRecord;
    try {
      validationRecord = await pb.collection('validations').getFirstListItem(`submission="${submissionId}"`);
    } catch (e) {
      // If no validation record exists, create one
      validationRecord = null;
    }

    const success = status === 'ACCEPTED';

    if (validationRecord) {
      // Update existing validation
      await pb.collection('validations').update(validationRecord.id, {
        success: success,
      });
    } else {
      // Create new validation
      await pb.collection('validations').create({
        submission: submissionId,
        success: success,
      });
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error && error.message.includes('401')) {
      logout();
    }
    return null;
  }
};

