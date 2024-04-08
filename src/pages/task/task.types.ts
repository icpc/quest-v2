export enum QuestStatus {
  PENDING = "PENDING",
  NOTATTEMPTED = "NOT ATTEMPTED",
  CORRECT = "ACCEPTED",
  WRONG = "WRONG",
}

export enum QuestType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

// want to create interfaces for the following objects
/*
  {
    questId: 1,
    questName: "Quest 1",
    questDate: "2021-10-10T10:00:00",
    questType: "VIDEO",
    questDescription: "Create a video",
    questStatus: "PENDING",
    submissions: [
      {
        id: 1,
        value: "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
        uploadTime: "2021-10-10T10:00:00",
        status: "PENDING",
        submissionType: "VIDEO",
      },
      {
        id: 2,
        value: "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
        uploadTime: "2021-10-10T10:00:00",
        status: "PENDING",
        submissionType: "VIDEO",
      },
      {
        id: 3,
        value: "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
        uploadTime: "2021-10-10T10:00:00",
        status: "PENDING",
        submissionType: "VIDEO",
      },
      {
        id: 4,
        value: "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
        uploadTime: "2021-10-10T10:00:00",
        status: "PENDING",
        submissionType: "VIDEO",
      },
      {
        id: 5,
        value: "35de78e9-357d-4b87-8f3a-d9dc0672825b.mp4",
        uploadTime: "2021-10-10T10:00:00",
        status: "PENDING",
        submissionType: "VIDEO",
      },
    ],
  };
*/
export interface QuestSubmission {
  id: number;
  answer: string;
  uploadTime: string;
  status: string;
  submissionType: string;
}
export interface QuestSubmissions {
  questId: number;
  questName: string;
  questDate: string;
  questType: string;
  questDescription: string;
  questStatus: string;
  questAcceptSubmissions: boolean;
  submissions: QuestSubmission[];
}
