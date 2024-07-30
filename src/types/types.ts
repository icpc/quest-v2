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

export enum QuestType {
    VIDEO = "VIDEO",
    TEXT = "TEXT",
    IMAGE = "IMAGE",
}

export interface QuestSubmission {
    id: number;
    answer: string;
    uploadTime: string;
    status: string;
    submissionType: string;
}

export interface QuestSubmissions {
    id: number;
    questName: string;
    questDate: string;
    questType: string;
    questDescription: string;
    questStatus: string;
    questAcceptSubmissions: boolean;
    questCategory: string;
    submissions: QuestSubmission[];
}
