import { Collections } from "@/types/pocketbase-types";

import pb from "@/utils/pocketbase";

export const setValidatedSubmissionStatus = async (
  submissionId: string,
  success: boolean | "clear",
) => {
  try {
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
    return false;
  }
};
