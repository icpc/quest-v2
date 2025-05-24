/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link, useNavigate } from "react-router";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Collapse,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import { LeaderboardRow, QuestStatus } from "../types/types";
import { getUserInfo } from "../utils/requests";

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

interface RowProps {
  row: LeaderboardRow;
  isCurrentUser: boolean;
}

const Row: React.FC<RowProps> = ({ row, isCurrentUser }) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = window?.innerWidth <= 500;
  const navigate = useNavigate();
  return (
    <React.Fragment>
      {
        <>
          <StyledTableRow
            key={row.userId}
            style={{ backgroundColor: isCurrentUser ? "rgb(156 178 212)" : "" }}
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
            <StyledTableCell>{row.userName}</StyledTableCell>
            <StyledTableCell>
              {row.total} /{" "}
              {row.totalPerDay.reduce((acc, day) => acc + day.quests.length, 0)}
            </StyledTableCell>
            {row.totalPerDay.map((day) => (
              <StyledTableCell>
                <span>
                  {day.total} / {day.quests.length}
                </span>
                {!isMobile && (
                  <>
                    <br />
                    {day.quests.map((quest) => {
                      const colorIcon = {
                        [QuestStatus.CORRECT]: "green",
                        [QuestStatus.WRONG]: "red",
                        [QuestStatus.PENDING]: "rgb(240 231 72)",
                        [QuestStatus.NOTATTEMPTED]: "grey",
                      };
                      return (
                        <Link
                          style={{
                            borderRadius: "50%",
                            padding: "2px",
                            margin: "2px",
                            display: "inline-block",
                            cursor: "pointer",
                            backgroundColor: colorIcon[quest?.status],
                            width: "10px",
                            height: "10px",
                          }}
                          target="_blank"
                          to={"/quest-details/" + quest.id}
                          title={quest.name}
                        ></Link>
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
                      {row.totalPerDay.map((day) =>
                        day.quests.map((quest) => {
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
                                navigate("/quest-details/" + quest.id);
                                // TODO: open in new tab
                                // window.open(
                                //   "/quest/quest-details/" + quest.id,
                                //   "_blank"
                                // );
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
                        }),
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
};

interface LeaderboardProps {
  rows: LeaderboardRow[];
  _columnsNames: string[];
  pageNumber: number;
  totalPages: number;
}

const Leaderboard: React.FC<LeaderboardProps> = (props) => {
  const { rows, _columnsNames, pageNumber, totalPages } = props;

  const navigate = useNavigate();
  const handleChange = React.useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      navigate(`/leaderboard/${value}`);
    },
    [navigate],
  );
  const userInfo = getUserInfo();

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
                  {_columnsNames.map((column) => (
                    <StyledTableCell>{column}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row row={row} isCurrentUser={row.userId === userInfo?.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Pagination
        count={totalPages}
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
};

export default Leaderboard;
