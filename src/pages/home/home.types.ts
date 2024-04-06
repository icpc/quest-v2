export enum QuestStatus {
  PENDING = "PENDING",
  NOTATTEMPTED = "NOT ATTEMPTED",
  CORRECT = "ACCEPTED",
  WRONG = "WRONG",
}

interface Quest {
  id: number;
  name: string;
  type: string;
  description: string;
  status: string;
  date: string;
}

export interface QuestsDays {
  date: string;
  detailsQuests: Quest[];
}
