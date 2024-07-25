import React from "react";
import { useParams } from "react-router-dom";
import { getLeaderboard } from "../../utils/requests";
import { ILeaderboard } from "./leaderboard.types";
import LeaderBoard from "./leaderboard";
import { ClipLoader } from "react-spinners";
import { UserInfoProps } from "../home/home.types";
import Loader from "../login/Loader";
import styled from "styled-components";

const LeaderBoardProxyWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;


const LeaderBoardProxyHelper: React.FC<UserInfoProps> = ({ userInfo }) => {
  const { pageNumber } = useParams() ?? "1";
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = React.useState(true);
  const [leaderboardData, setLeaderboardData] = React.useState<ILeaderboard | null>(null);
  const [rows, setRows] = React.useState<any>([]);
  const [columnsNames, setColumnsNames] = React.useState<string[]>([]);
  const [curUser, setCurUser] = React.useState<any>(null);

  React.useEffect(() => {
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
  }, [pageNumber, userInfo]);

  if (isLoadingLeaderboard || !leaderboardData) {
    return (
      <LeaderBoardProxyWrapper>
        <ClipLoader color={"#123abc"} size={150} />
      </LeaderBoardProxyWrapper>
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
}

const LeaderboardProxy = () => {
  return <Loader component={LeaderBoardProxyHelper} />;
};

export default LeaderboardProxy;
