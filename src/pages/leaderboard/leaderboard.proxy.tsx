import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { getLeaderboard } from "../../utils/requests";
import { ILeaderboard } from "./leaderboard.types";
import LeaderBoard from "./leaderboard";

const LeaderboardProxy = () => {
  const { pageNumber } = useParams() ?? "1";
  const isAuthenticated = checkUserAuthentication();
  const userInfo = React.useMemo(
    () => localStorageGetItemWithExpiry("userInfo") || "{}",
    []
  );
  const navigate = useNavigate();
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = React.useState(true);
  const [leaderboardData, setLeaderboardData] =
    React.useState<ILeaderboard | null>(null);
  const [rows, setRows] = React.useState<any>([]);
  const [columnsNames, setColumnsNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (isAuthenticated) {
      getLeaderboard(pageNumber, userInfo).then((response) => {
        if (response) {
          setLeaderboardData(response);
          const rowsData = response?.result.map((person: any) => {
            return {
              name: `${person.firstName} ${person.lastName}`,
              rank: person.rank,
              total: person.total,
              totalPerday: person.totalPerDay,
            };
          });
          setRows(() => rowsData);
          const columnsNamesData = ["Rank", "Name", "Total"];
          const dates = response?.result[0].totalPerDay.map((date: any) =>
            new Date(date.date).toDateString().slice(4, 10)
          );
          if (dates) {
            dates.forEach((date: any) => {
              columnsNamesData.push(date);
            });
          }
          setColumnsNames(columnsNamesData);
          setIsLoadingLeaderboard(false);
        }
      });
    }
  }, [isAuthenticated, pageNumber, userInfo]);

  if (isLoadingLeaderboard || !leaderboardData) {
    return <div>Loading...</div>;
  }

  return (
    <LeaderBoard
      rows={rows}
      _columnsNames={columnsNames}
      pageNumber={pageNumber}
    />
  );
};
export default LeaderboardProxy;
