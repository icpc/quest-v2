import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { getLeaderboard } from "../../utils/requests";
import { ILeaderboard } from "./leaderboard.types";
import LeaderBoard from "./leaderboard";
import { ClipLoader } from "react-spinners";

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
  const [curUser, setCurUser] = React.useState<any>(null);

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
          if (response?.result.length === 0 || response?.result === undefined) {
            setIsLoadingLeaderboard(false);
            return;
          }
          const rowsData = response?.result.map((person: any) => {
            return {
              name: `${person.firstName} ${person.lastName}`,
              rank: person.rank,
              total: person.total,
              totalPerday: person.totalPerDay,
              email: person?.email,
            };
          });

          if (
            response.curUser &&
            rowsData.length > 0 &&
            !rowsData.find((row: any) => row.email === response.curUser?.email)
          ) {
            rowsData.push({
              name: `${response.curUser.firstName} ${response.curUser.lastName}`,
              rank: response.curUser?.rank,
              total: response.curUser?.total,
              totalPerday: response?.curUser?.totalPerDay,
              email: response?.curUser?.email,
            });
            rowsData.sort((a: any, b: any) => a.rank - b.rank);
          }
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
          setCurUser(response.curUser);
          setIsLoadingLeaderboard(false);
        }
      });
    }
  }, [isAuthenticated, pageNumber, userInfo]);

  if (isLoadingLeaderboard || !leaderboardData) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ClipLoader color={"#123abc"} size={150} />
      </div>
    );
  }
  if (!leaderboardData?.result || leaderboardData?.result.length === 0) {
    return <div>No users found</div>;
  }
  return (
    <LeaderBoard
      rows={rows}
      _columnsNames={columnsNames}
      pageNumber={pageNumber}
      totalUsers={leaderboardData.totalUsers}
      curUser={curUser}
    />
  );
};
export default LeaderboardProxy;
