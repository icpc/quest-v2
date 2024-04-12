import * as React from "react";
import {
  checkUserAuthentication,
  localStorageGetItemWithExpiry,
} from "../../utils/helper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import {
  getQuestsSubmissions,
  updateQuestSubmissionStatus,
} from "../../utils/requests";
import { ClipLoader } from "react-spinners";

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

const Admin = () => {
  const isAuthenticated = checkUserAuthentication();
  const userInfo = React.useMemo(
    () => localStorageGetItemWithExpiry("userInfo") || "{}",
    []
  );
  const [isGetSubmissionsLoading, setIsGetSubmissionsLoading] =
    React.useState(true);
  const [questsSubmissions, setQuestsSubmissions] = React.useState<any[]>([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    // get submissions

    getQuestsSubmissions("PENDING", userInfo).then((response) => {
      if (response) {
        setQuestsSubmissions(response);
        setIsGetSubmissionsLoading(false);
      } else {
        setQuestsSubmissions([]);
        setIsGetSubmissionsLoading(false);
      }
    });
  }, [userInfo]);

  if (isGetSubmissionsLoading) {
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
  if (!questsSubmissions || questsSubmissions.length === 0) {
    return <div>No submissions found</div>;
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Quest Id</StyledTableCell>
            <StyledTableCell>Quest Name</StyledTableCell>
            <StyledTableCell>Answer</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questsSubmissions.map((questsSubmission: any) => {
            return questsSubmission.submissions.map((submission: any) => {
              return (
                <>
                  <StyledTableRow key={submission.id}>
                    <StyledTableCell component="th" scope="row">
                      <a
                        href={`/quest/${questsSubmission.questId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {questsSubmission.questId}{" "}
                      </a>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <a
                        href={`/quest/${questsSubmission.questId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {questsSubmission.name}{" "}
                      </a>
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => {
                        if (submission.submissionType !== "text")
                          window.open(submission.answer, "_blank");
                      }}
                      style={{
                        cursor:
                          submission.submissionType !== "text"
                            ? "pointer"
                            : "default",

                        color:
                          submission.submissionType !== "text"
                            ? "blue"
                            : "black",
                      }}
                      component="th"
                      scope="row"
                    >
                      {submission.submissionType === "text"
                        ? submission.answer
                        : "View Link"}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <button
                        onClick={() => {
                          // update submission
                          updateQuestSubmissionStatus(
                            submission.id,
                            "ACCEPTED",
                            userInfo,
                            questsSubmission.email,
                            questsSubmission.questId
                          ).then((response) => {
                            if (response) {
                              alert("Accepted successfully");
                              setQuestsSubmissions(
                                questsSubmissions.map(
                                  (questSubmission: any) => {
                                    if (
                                      questSubmission.questId ===
                                      questsSubmission.questId
                                    ) {
                                      return {
                                        ...questSubmission,
                                        submissions:
                                          questSubmission.submissions.filter(
                                            (sub: any) =>
                                              sub.id !== submission.id
                                          ),
                                      };
                                    } else {
                                      return questSubmission;
                                    }
                                  }
                                )
                              );
                            } else {
                              alert("Error in accepting submission");
                            }
                          });
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          // update submission
                          updateQuestSubmissionStatus(
                            submission.id,
                            "WRONG",
                            userInfo,
                            questsSubmission.email,
                            questsSubmission.questId
                          ).then((response) => {
                            console.log(response);
                            if (response) {
                              alert("Accepted successfully");

                              setQuestsSubmissions(
                                questsSubmissions.map(
                                  (questSubmission: any) => {
                                    if (
                                      questSubmission.questId ===
                                      questsSubmission.questId
                                    ) {
                                      return {
                                        ...questSubmission,
                                        submissions:
                                          questSubmission.submissions.filter(
                                            (sub: any) =>
                                              sub.id !== submission.id
                                          ),
                                      };
                                    } else {
                                      return questSubmission;
                                    }
                                  }
                                )
                              );
                            } else {
                              alert("Error in accepting submission");
                            }
                          });
                        }}
                      >
                        Reject
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              );
            });
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Admin;
