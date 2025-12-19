import { Collections } from "@/types/pocketbase-types";

import { getCurrentUserId } from "@/utils/auth";
import pb from "@/utils/pocketbase";

export type TaskSubmission = { text: string; file?: File };

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

export const submitTask = async (
  questId: string,
  submission: TaskSubmission,
) => {
  try {
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
    return false;
  }
};
