export enum QuestStatus {
  PENDING = "PENDING",
  NOTATTEMPTED = "NOT ATTEMPTED",
  CORRECT = "CORRECT",
  WRONG = "WRONG",
}

export enum QuestType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

export interface Quest {
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

export interface LeaderboardRowDayQuest {
  id: string;
  name: string;
  status: QuestStatus;
}

export interface LeaderboardRowDay {
  date: string;
  total: number;
  quests: LeaderboardRowDayQuest[];
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  userName: string;
  total: number;
  totalPerDay: LeaderboardRowDay[];
}

export enum QuestSubmissionContentType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

export interface QuestSubmissionText {
  type: QuestSubmissionContentType.TEXT;
  text: string;
}

export interface QuestSubmissionVideo {
  type: QuestSubmissionContentType.VIDEO;
  url: string;
}

export interface QuestSubmissionImage {
  type: QuestSubmissionContentType.IMAGE;
  url: string;
}

export type QuestSubmissionContent =
  | QuestSubmissionText
  | QuestSubmissionVideo
  | QuestSubmissionImage;

export interface QuestSubmission {
  id: string;
  uploadTime: string;
  status: QuestStatus;
  content: QuestSubmissionContent;
}

export interface QuestWithSubmissions {
  quest: Quest;
  submissions: QuestSubmission[];
}

export type Status = "CORRECT" | "WRONG" | "PENDING";

export interface ValidatedSubmissionListItem {
  id: string;
  userId: string;
  userName: string;
  questId: string;
  questName: string;
  status: Status;
  createdAt?: string;
  text?: string;
  url?: string;
}

export interface ValidatedSubmissionsListResult {
  items: ValidatedSubmissionListItem[];
  totalItems: number;
}
