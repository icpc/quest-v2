import React from "react";
import { useParams } from "react-router";

import { LeaderboardRow } from "../../types/types";
import { formatDate } from "../../utils/human-readable-date";
import { getLeaderboard } from "../../utils/requests";
import LeaderBoard from "../Leaderboard";

import Loader, { LoaderComponent } from "./Loader";

const LeaderboardProxyHelper: React.FC = () => {
  // page number is the first path in the URL
  const { pageNumber } = useParams();
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = React.useState(true);
  const [rows, setRows] = React.useState<LeaderboardRow[]>([]);
  const [columnsNames, setColumnsNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    getLeaderboard(Number(pageNumber) - 1).then((leaderboardResult) => {
      if (leaderboardResult && leaderboardResult.rows.length > 0) {
        setRows(leaderboardResult.rows);
        setColumnsNames([
          "Rank",
          "Name",
          "Total",
          ...leaderboardResult.rows[0].totalPerDay.map((day) =>
            formatDate(day.date, { month: "short", day: "numeric" }),
          ),
        ]);
        setTotalPages(leaderboardResult.totalPages);
      }

      setIsLoadingLeaderboard(false);
    });
  }, [pageNumber]);

  if (isLoadingLeaderboard) {
    return <LoaderComponent />;
  }
  if (rows.length === 0) {
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
      pageNumber={Number(pageNumber)}
      totalPages={totalPages}
    />
  );
};

const LeaderboardProxy = () => {
  return <Loader component={LeaderboardProxyHelper} />;
};

export default LeaderboardProxy;
