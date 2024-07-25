export enum QuestStatus {
  PENDING = "PENDING",
  NOTATTEMPTED = "NOT ATTEMPTED",
  CORRECT = "ACCEPTED",
  WRONG = "WRONG",
}

export interface Quest {
  id: number;
  name: string;
  type: string;
  description: string;
  status: string;
  date: string;
  totalAc: string;
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