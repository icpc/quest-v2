import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Collapse,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import { QuestStatus } from "./leaderboard.types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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

function Row(props: any) {
  const { row, index, isCurUser } = props;
  const [open, setOpen] = React.useState(false);
  const isMobile = window?.innerWidth <= 500;
  return (
    <React.Fragment>
      {
        <>
          <StyledTableRow
            key={row.name + index}
            style={{ backgroundColor: isCurUser ? "rgb(156 178 212)" : "" }}
          >
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <StyledTableCell component="th" scope="row">
              {row.rank}
            </StyledTableCell>
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.total}</StyledTableCell>
            {row.totalPerday.map((day: any) => (
              <StyledTableCell>
                <span>{day.total}</span>
                {!isMobile && (
                  <>
                    <br />
                    {day.quests.map((quest: any) => {
                      const colorIcon: any = {
                        [QuestStatus.CORRECT]: "green",
                        [QuestStatus.WRONG]: "red",
                        [QuestStatus.PENDING]: "rgb(240 231 72)",
                        [QuestStatus.NOTATTEMPTED]: "grey",
                      };
                      return (
                        <span
                          style={{
                            borderRadius: "50%",
                            padding: "2px",
                            margin: "2px",
                            display: "inline-block",
                            cursor: "pointer",
                            backgroundColor:
                              colorIcon[quest?.status.toLocaleUpperCase()],
                            width: "10px",
                            height: "10px",
                          }}
                          onClick={() => {
                            window.open(
                              "quest/quest-details/" + quest.id,
                              "_blank"
                            );
                          }}
                          title={quest.name}
                        ></span>
                      );
                    })}
                  </>
                )}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell style={{ padding: 0 }} colSpan={isMobile ? 5 : 11}>
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                style={{
                  height: "250px",
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Status for Quests
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Quest Name</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.totalPerday.map((day: any) =>
                        day.quests.map((quest: any) => {
                          if (
                            !quest ||
                            quest.status.toLocaleUpperCase() ===
                              QuestStatus.NOTATTEMPTED
                          )
                            return null;
                          return (
                            <TableRow
                              key={row.rank}
                              onClick={() => {
                                window.open(
                                  "/quest/quest-details/" + quest.id,
                                  "_blank"
                                );
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <TableCell component="th" scope="row">
                                {day.date}
                              </TableCell>
                              <TableCell>{quest.name}</TableCell>
                              <TableCell>
                                {quest.status === QuestStatus.CORRECT ? (
                                  <span style={{ color: "green" }}>
                                    {quest.status}
                                  </span>
                                ) : quest.status === QuestStatus.WRONG ? (
                                  <span style={{ color: "red" }}>
                                    {quest.status}
                                  </span>
                                ) : (
                                  <span>{quest.status}</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </StyledTableRow>
        </>
      }
    </React.Fragment>
  );
}

const LeaderBoard = (props: any) => {
  const { rows, _columnsNames, pageNumber, totalUsers } = props;

  const navigate = useNavigate();
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
              <Table sx={{ minWidth: 700 }} aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    {_columnsNames.map((column: string) => (
                      <StyledTableCell>{column}</StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any, index: number) => (
                    <Row
                      row={row}
                      index={index}
                      isCurUser={
                        props.curUser && row.email === props.curUser.email
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <Pagination
          count={Math.ceil(totalUsers / 10)}
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
  }, [
    _columnsNames,
    handleChange,
    pageNumber,
    props.curUser,
    rows,
    totalUsers,
  ]);

  return <>{leaderboardTableJSX}</>;
};

export default LeaderBoard;
