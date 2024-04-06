import React, { useState, useEffect } from "react";
import { checkUserAuthentication } from "../../utils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { submitTask } from "../../utils/requests";
import DrawerAppBar from "../../componetns/header/header";
import { Box, TextField, Toolbar } from "@mui/material";
import { QuestSubmission, QuestSubmissions, QuestType } from "./task.types";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ImgMediaCard(submission: any) {
  console.log(submission.id);
  const { id, name, description, status, submissionType, answer } = submission;
  const submissionTypeUpper = submissionType?.toLocaleUpperCase();
  return (
    <Card
      sx={{
        width: 345,
        height: 250,
        maxWidth: 345,
        minWidth: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {submissionTypeUpper === QuestType.IMAGE ? (
        <CardMedia
          component="img"
          height="195"
          image={answer}
          alt="green iguana"
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
          autoPlay
        />
      )}
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="span"
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
}

const Task = (props: any) => {
  // is mobile view or not
  const isMobileView = window.innerWidth < 600;
  const questId = props.questId;
  const userInfo = props.userInfo;
  const [questSubmissions, setQuestSubmissions] = useState<QuestSubmissions>(
    props.questSubmissions
  );
  const isAuthenticated = checkUserAuthentication(); // Implement this function to check if the user is authenticated
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
      console.log(event.target.value);
      setSubmission({ ...submission, text: event.target.value });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const handleFileChange = React.useCallback(
    (event: any) => {
      // validate input type file to be image or video only
      if (event.target.files[0]) {
        const fileType = event.target.files[0].type;
        if (
          fileType !== "image/jpeg" &&
          fileType !== "image/png" &&
          fileType !== "video/mp4"
        ) {
          setSubmitTaskStatus("File type not supported");
          // clear the input
          event.target.value = null;
          return;
        }
      }
      setSubmitTaskStatus("");
      setSubmission({ ...submission, file: event.target.files[0] });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSubmit = React.useCallback(async (event: any) => {
    console.log(submission);
    event.preventDefault();
    setSubmitTaskStatus("Submitting task");
    const newSubmit = await submitTask(submission, userInfo);
    if (newSubmit) {
      console.log(newSubmit);
      setSubmitTaskStatus("Task submitted successfully");
      const newQuestSubmissions = { ...questSubmissions };
      if (
        questSubmissions?.questType?.toLocaleUpperCase() === QuestType.IMAGE ||
        questSubmissions?.questType?.toLocaleUpperCase() === QuestType.VIDEO
      ) {
        newQuestSubmissions.submissions.unshift({
          id: questSubmissions.submissions.length + 1,
          answer: newSubmit,
          uploadTime: new Date().toISOString(),
          status: "PENDING",
          submissionType: questSubmissions?.questType?.toLocaleUpperCase(),
        });
      } else {
        newQuestSubmissions.submissions.unshift({
          id: questSubmissions.submissions.length + 1,
          answer: submission.text,
          uploadTime: new Date().toISOString(),
          status: "PENDING",
          submissionType: "text",
        });
      }
      setQuestSubmissions(newQuestSubmissions);
    } else {
      setSubmitTaskStatus("Error submitting task");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submssionsJSX = React.useMemo(() => {
    if (!questSubmissions) return null;
    if (
      !questSubmissions.submissions ||
      questSubmissions.submissions.length === 0
    )
      return <h3>No submissions yet</h3>;
    return (
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
            return ImgMediaCard(submission as any);
          }
        )}
      </div>
    );
  }, [questSubmissions]);

  const submitTaskJSX = React.useMemo(() => {
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
          <Typography component="h1" variant="h5">
            Submit Task
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
              sx={{ width: isMobileView ? "90%" : "400px" }}
              multiline={questType === QuestType.TEXT}
              maxRows={5}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, width: isMobileView ? "90%" : "400px" }}
              disabled={
                questType === QuestType.TEXT
                  ? submission.text === ""
                  : submission.file === null
              }
            >
              Submit
            </Button>
          </Box>
        </Box>
        <br></br>
        <div>{submitTaskStatus}</div>
      </div>
    );
  }, [
    handleFileChange,
    handleInputChange,
    handleSubmit,
    isMobileView,
    questSubmissions.questType,
    submission.file,
    submission.text,
    submitTaskStatus,
  ]);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div>
      <Box component="main" sx={{ p: 3 }}>
        {questSubmissions && (
          <div>
            <h2
              style={{
                marginBottom: "0px",
              }}
            >
              Task {questSubmissions?.questName}
            </h2>
            <div>
              <h4
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                  marginLeft: "5px",
                }}
              >
                {" " + questSubmissions.questDescription}
              </h4>
              {/* Status */}
              <h4
                style={{
                  marginTop: "0px",
                  marginLeft: "5px",
                }}
              >
                Task Status : {questSubmissions.questStatus}
              </h4>
            </div>
          </div>
        )}
        <div>{submitTaskJSX}</div>
        <div>
          <h2>Submissions</h2>
          {submssionsJSX}
        </div>
      </Box>
    </div>
  );
};

export default Task;
