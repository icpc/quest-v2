import React, { useState } from "react";
import { submitTask, checkAuth } from "../utils/requests";
import { Box, TextField } from "@mui/material";
import {
  QuestStatus,
  QuestSubmission,
  QuestSubmissions,
  QuestType,
} from "../types/types";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function formatDateToCustomFormat(date: Date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hour >= 12 ? "pm" : "am";

  // Convert hour to 12-hour format
  const formattedHour = hour % 12 || 12;

  // Construct the final formatted string
  const formattedDate = `${month} ${day}, ${formattedHour}:${minutes} ${amOrPm}`;

  return formattedDate;
}

function ImgMediaCard(submission: any, index: number, userName: string) {
  const { status, submissionType, answer, uploadTime } = submission;
  const submissionTypeUpper = submissionType?.toLocaleUpperCase();
  return (
    <Card
      sx={{
        width: 345,
        height: 300,
        maxWidth: 345,
        minWidth: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
        cursor: "pointer",
      }}
    >
      {submissionTypeUpper === QuestType.IMAGE ? (
        <CardMedia
          component="img"
          height="195"
          image={answer}
          alt="green iguana"
          onClick={() => {
            // open the submission answer in a new tab
            if (submissionTypeUpper === QuestType.TEXT) return;
            window.open(answer, "_blank");
          }}
        />
      ) : submissionTypeUpper === QuestType.TEXT ? (
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="span"
            style={{
              display: "block",
              //overflow: "hidden",
              textOverflow: "ellipsis",
              height: "150px",
            }}
          >
            {answer}
          </Typography>
        </CardContent>
      ) : (
        <CardMedia
          component="video"
          // className={classes.media}
          image={answer}
          controls
          //autoPlay={index === 0 ? true : false}
          onClick={() => {
            // open the submission answer in a new tab
            if (submissionTypeUpper === QuestType.TEXT) return;
            window.open(answer, "_blank");
          }}
          style={{
            height: "195px",
          }}
        />
      )}
      <CardContent
        style={{
          padding: "0px",
          paddingLeft: "10px",
        }}
      >
        {
          <Typography
            variant="h6"
            component="span"
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            {userName} . {formatDateToCustomFormat(new Date(uploadTime))}
          </Typography>
        }
        <Typography
          gutterBottom
          variant="h5"
          component="span"
          style={{
            display: "block",
            // overflow: "hidden",
            // textOverflow: "ellipsis",
            // whiteSpace: "nowrap",
          }}
        >
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
}

const Quest = (props: any) => {
  const isMobile = window?.innerWidth <= 500;
  const questId = props.questId;
  const userInfo = props.userInfo;
  const navigate = useNavigate();
  const [questSubmissions, setQuestSubmissions] = useState<QuestSubmissions>(
    props.questSubmissions
  );
  const isAuthenticated = checkAuth();
  const [submission, setSubmission] = useState({
    text: "",
    file: null,
    userId: 1,
    questId: questId,
    type:
      questSubmissions?.questType?.toLocaleUpperCase() === QuestType.TEXT
        ? "text"
        : "file",
  });
  const [submitTaskStatus, setSubmitTaskStatus] = useState("");

  const handleInputChange = React.useCallback(
    (event: { target: { value: any } }) => {
      setSubmission({ ...submission, text: event.target.value });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFileChange = React.useCallback(
    (event: any) => {
      if (event.target.files[0]) {
        const fileType = event.target.files[0].type;
        if (
          questSubmissions.questType.toLocaleUpperCase() === QuestType.VIDEO
        ) {
          if (fileType.split("/")[0] !== "video") {
            setSubmitTaskStatus("File type not supported");
            // clear the input
            event.target.value = null;
            return;
          }

          if (event.target.files[0].size > 100000000) {
            setSubmitTaskStatus("File size should be less than 100MB");
            event.target.value = null;
            return;
          }
        }
        if (
          questSubmissions.questType.toLocaleUpperCase() === QuestType.IMAGE
        ) {
          if (fileType.split("/")[0] !== "image") {
            setSubmitTaskStatus("File type not supported");
            event.target.value = null;
            return;
          }
        }
        setSubmitTaskStatus("");
        setSubmission({ ...submission, file: event.target.files[0] });
      } else {
        //setSubmitTaskStatus("File type not supported");
      }
    },
    [questSubmissions.questType, submission]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setSubmitTaskStatus("Submitting task");
    const newSubmit = await submitTask(submission, userInfo);
    if (newSubmit) {
      const newQuestSubmissions = { ...questSubmissions };
      if (
        questSubmissions?.questType?.toLocaleUpperCase() === QuestType.IMAGE ||
        questSubmissions?.questType?.toLocaleUpperCase() === QuestType.VIDEO
      ) {
        newQuestSubmissions.submissions.unshift({
          id: (questSubmissions.submissions.length + 1).toString(),
          answer: newSubmit,
          uploadTime: new Date().toISOString(),
          status: "PENDING",
          submissionType: questSubmissions?.questType?.toLocaleUpperCase(),
        });
      } else {
        newQuestSubmissions.submissions.unshift({
          id: (questSubmissions.submissions.length + 1).toString(),
          answer: submission.text,
          uploadTime: new Date().toISOString(),
          status: "PENDING",
          submissionType: "text",
        });
      }
      setQuestSubmissions(newQuestSubmissions);
      setSubmitTaskStatus("Task submitted successfully");
      alert("Task submitted successfully");
    } else {
      setSubmitTaskStatus("Error submitting task");
      alert("Error submitting task");
    }
  };

  const submssionsJSX = React.useMemo(() => {
    if (!questSubmissions) return null;
    if (
      !questSubmissions.submissions ||
      questSubmissions.submissions.length === 0
    )
      return (
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "400",
          }}
        >
          No submissions yet
        </h3>
      );
    return (
      <>
        <h2>Submissions</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {questSubmissions.submissions.map(
            (submission: QuestSubmission, index: number) => {
              return ImgMediaCard(
                submission as any,
                index,
                userInfo.user.firstName + " " + userInfo.user.lastName
              );
            }
          )}
        </div>
      </>
    );
  }, [questSubmissions, userInfo.user.firstName, userInfo.user.lastName]);

  const submitQuestJSX = React.useMemo(() => {
    if (questSubmissions === null) return null;

    if (!questSubmissions?.questAcceptSubmissions) {
      return (
        <h3
          style={{
            margin: "0",
            fontFamily:
              '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
            fontWeight: "600",
            fontSize: "24px",
            lineHeight: "22px",
          }}
        >
          Submission is closed in this Task
        </h3>
      );
    }
    const questType = questSubmissions?.questType?.toLocaleUpperCase();
    return (
      <div>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              margin: "0",
              fontFamily:
                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
              fontSize: "1rem",
              lineHeight: "22px",
            }}
          >
            Submit Task {questType === QuestType.VIDEO ? "Video" : ""}{" "}
            {questType === QuestType.IMAGE ? "Image" : ""}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <TextField
              margin="normal"
              required
              label={
                questType === QuestType.TEXT ? "Enter the answer here" : ""
              }
              type={questType === QuestType.TEXT ? "text" : "file"}
              onChange={
                questType === QuestType.TEXT
                  ? handleInputChange
                  : handleFileChange
              }
              sx={{
                width: isMobile ? "90%" : "400px",
                backgroundColor: "white",
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
                borderRadius: "5px",
                ":hover": {
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 2px",
                },
              }}
              multiline={questType === QuestType.TEXT}
              maxRows={5}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                width: isMobile ? "90%" : "400px",
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
              }}
              disabled={
                submitTaskStatus === "Submitting task" ||
                (questType === QuestType.TEXT
                  ? submission.text === ""
                  : submission.file === null)
              }
            >
              Submit
            </Button>
          </Box>
        </Box>
        <div
          style={{
            color:
              submitTaskStatus === "File type not supported" ||
              submitTaskStatus === "Error submitting task" ||
              submitTaskStatus === "File size should be less than 100MB"
                ? "red"
                : "black",
          }}
        >
          {submitTaskStatus}
        </div>
      </div>
    );
  }, [
    handleFileChange,
    handleInputChange,
    handleSubmit,
    isMobile,
    questSubmissions,
    submission.file,
    submission.text,
    submitTaskStatus,
  ]);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div>
      <Box component="main" sx={{ p: 3, maxWidth: "960px" }}>
        {questSubmissions && (
          <div>
            <div
              style={{
                display: "flex",
                //alignItems: "center",
                //maxWidth: "960px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
                onClick={() => {
                  navigate("/home");
                }}
              >
                <ArrowBackIcon />
              </div>
              {questSubmissions.questStatus.toLocaleUpperCase() ===
                QuestStatus.CORRECT && (
                <CheckCircleOutlineIcon
                  fontSize={isMobile ? "small" : "large"}
                  style={{
                    marginTop: isMobile ? "6px" : "0px",
                    color: "green",
                  }}
                />
              )}
              {questSubmissions.questStatus.toLocaleUpperCase() ===
                QuestStatus.PENDING && (
                <AccessTimeOutlinedIcon
                  fontSize={isMobile ? "small" : "large"}
                  style={{
                    marginTop: isMobile ? "6px" : "0px",
                  }}
                />
              )}
              {questSubmissions.questStatus.toLocaleUpperCase() ===
                QuestStatus.WRONG && (
                <HighlightOffOutlinedIcon
                  fontSize={isMobile ? "small" : "large"}
                  style={{
                    marginTop: isMobile ? "6px" : "0px",
                  }}
                />
              )}
              <h2
                style={{
                  marginLeft:
                    questSubmissions.questStatus.toLocaleUpperCase() !==
                    QuestStatus.NOTATTEMPTED
                      ? "10px"
                      : "0px",
                  marginTop: "0px",
                }}
              >
                <span
                  style={{
                    fontWeight: "400",
                    color: "rgb(12, 26, 68)",
                    lineHeight: "32px",
                  }}
                >
                  <span
                    style={{
                      fontSize: isMobile ? "1.5rem" : "2rem",
                    }}
                  >
                    {questSubmissions.questCategory + ":"}
                    <span
                      style={{
                        marginLeft: "12px",
                      }}
                    >
                      {questSubmissions.questName}
                    </span>
                  </span>
                </span>
              </h2>
            </div>
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: questSubmissions.questDescription,
          }}
          style={{
            fontSize: "1rem",
          }}
        ></div>
        <div>{submitQuestJSX}</div>
        <div>{submssionsJSX}</div>
      </Box>
    </div>
  );
};

export default Quest;
