import React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { getLeaderboard } from "../../utils/requests";
import { ILeaderboard } from "./leaderboard.types";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Pagination } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(22, 65, 116)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const LeaderBoard = (props: any) => {
  const { rows, _columnsNames, pageNumber } = props;
  const navigate = useNavigate();
  console.log("rows ", rows);
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      navigate(`/leaderboard/${value}`);
    },
    [navigate]
  );

  const leaderboardTableJSX = React.useMemo(() => {
    return (
      <div>
        <div
          style={{
            padding: "20px",
          }}
        >
          <h1>Leaderboard</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {_columnsNames.map((column: string) => (
                      <StyledTableCell>{column}</StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any, index: number) => (
                    <StyledTableRow key={row.name + index}>
                      <StyledTableCell component="th" scope="row">
                        {row.rank}
                      </StyledTableCell>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>{row.total}</StyledTableCell>
                      {row.totalPerday.map((day: any) => (
                        <StyledTableCell>{day.total}</StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <Pagination
          count={10}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
          }}
          page={+pageNumber}
          onChange={handleChange}
        />
      </div>
    );
  }, [_columnsNames, handleChange, pageNumber, rows]);

  return <>{leaderboardTableJSX}</>;
};

export default LeaderBoard;
