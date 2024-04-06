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

export interface LeaderboardPerson {
  rank: number;
  firstName: string;
  lastName: string;
  email: string;
  total: string;
  totalPerDay: {
    date: string;
    total: string;
  }[];
}

export interface ILeaderboard {
  result: LeaderboardPerson[];
}
