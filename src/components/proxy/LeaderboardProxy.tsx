import React from "react";
import { useParams } from "react-router-dom";

import { ILeaderboard, UserInfoProps } from "../../types/types";
import { getLeaderboard } from "../../utils/requests";
import LeaderBoard from "../Leaderboard";

import Loader, { LoaderComponent } from "./Loader";

const LeaderboardProxyHelper: React.FC<UserInfoProps> = ({ userInfo }) => {
  const { pageNumber } = useParams() ?? "1";
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = React.useState(true);
  const [leaderboardData, setLeaderboardData] =
    React.useState<ILeaderboard | null>(null);
  const [rows, setRows] = React.useState<any>([]);
  const [columnsNames, setColumnsNames] = React.useState<string[]>([]);
  const [curUser, setCurUser] = React.useState<any>(null);

  React.useEffect(() => {
    getLeaderboard(pageNumber, userInfo).then((response) => {
      if (response) {
        setLeaderboardData(response);
        if (response?.result.length === 0) {
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
          new Date(date.date).toDateString().slice(4, 10),
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
  }, [pageNumber, userInfo]);

  if (isLoadingLeaderboard || !leaderboardData) {
    return <LoaderComponent />;
  }
  if (!leaderboardData?.result || leaderboardData?.result.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          color: "#343a40",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <p>No Submissions Yet!</p>
      </div>
    );
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

const LeaderboardProxy = () => {
  return <Loader component={LeaderboardProxyHelper} />;
};

export default LeaderboardProxy;
