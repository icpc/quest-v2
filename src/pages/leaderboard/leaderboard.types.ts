// create interface to represent the following object

/*
  {
    "result": [
        {
            "rank": 2,
            "firstName": "Mahmoud",
            "lastName": "Hamdy",
            "email": "mhmorsy@gmail.com",
            "total": "1/11",
            "totalPerDay": [
                {
                    "date": "2024-04-14",
                    "total": "1/2"
                },
                {
                    "date": "2024-04-15",
                    "total": "0/8"
                },
                {
                    "date": "2024-04-16",
                    "total": "0/1"
                }
            ]
        }
    ]
}

*/

export enum QuestStatus {
  PENDING = "PENDING",
  NOTATTEMPTED = "NOT ATTEMPTED",
  CORRECT = "ACCEPTED",
  WRONG = "WRONG",
}

interface Quest {
  id: string;
  name: string;
  status: string;
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
    quests: Quest[];
  }[];
}
export interface ILeaderboard {
  result: LeaderboardPerson[];
  totalUsers: number;
  curUser: LeaderboardPerson;
}
