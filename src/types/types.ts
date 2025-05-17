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

export type Quest = {
  id: string;
  name: string;
  type: QuestType;
  description: string;
  status: QuestStatus;
  date: string;
  totalAc: number;
  category: string;
}

export interface QuestsDays {
  date: string;
  detailsQuests: Quest[];
}


export interface UserInfo {
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface UserInfoProps {
  userInfo: UserInfo;
}

export interface LeaderboardPerson {
  rank: number;
  firstName: string;
  lastName: string;
  email: string;
  total: string;
  totalPerDay: {
    date: string;
    total: string;
    quests: {
      id: string;
      name: string;
      status: string;
    }[];
  }[];
}

export interface ILeaderboard {
  result: LeaderboardPerson[];
  totalUsers: number;
  curUser: LeaderboardPerson;
}

export enum QuestSubmissionContentType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

export type QuestSubmissionText = {
  type: QuestSubmissionContentType.TEXT;
  text: string;
};

export type QuestSubmissionVideo = {
  type: QuestSubmissionContentType.VIDEO;
  url: string;
};

export type QuestSubmissionImage = {
  type: QuestSubmissionContentType.IMAGE;
  url: string;
};

export type QuestSubmissionContent =
  | QuestSubmissionText
  | QuestSubmissionVideo
  | QuestSubmissionImage;

export type QuestSubmission = {
  id: string;
  uploadTime: string;
  status: QuestStatus;
  content: QuestSubmissionContent;
}

export type QuestWithSubmissions = {
  quest: Quest;
  submissions: QuestSubmission[];
}