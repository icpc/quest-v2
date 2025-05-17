import React, { useCallback, useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";

import { Quest, QuestType } from "../types/types";
import { submitTask } from "../utils/requests";

// TODO: Rewrite this completely to use React Hook Form for better form handling
interface QuestSubmissionFormProps {
  quest: Quest;
  onSubmit: () => void;
}
const QuestSubmissionForm: React.FC<QuestSubmissionFormProps> = ({
  quest,
  onSubmit,
}) => {
  const isMobile = window?.innerWidth <= 500;
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [submitTaskStatus, setSubmitTaskStatus] = useState("");

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    [],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const fileType = event.target.files[0].type;
        if (
          quest.type === QuestType.VIDEO &&
          fileType.split("/")[0] !== "video"
        ) {
          setSubmitTaskStatus("File type not supported");
          event.target.value = "";
          return;
        }
        if (
          quest.type === QuestType.VIDEO &&
          event.target.files[0].size > 100000000
        ) {
          setSubmitTaskStatus("File size should be less than 100MB");
          event.target.value = "";
          return;
        }
        if (
          quest.type === QuestType.IMAGE &&
          fileType.split("/")[0] !== "image"
        ) {
          setSubmitTaskStatus("File type not supported");
          event.target.value = "";
          return;
        }
        setSubmitTaskStatus("");
        setFile(event.target.files[0]);
      }
    },
    [quest.type, setSubmitTaskStatus],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitTaskStatus("Submitting task");
      const newSubmit = await submitTask(quest.id, { text, file });
      if (newSubmit) {
        setSubmitTaskStatus("Task submitted successfully");
        alert("Task submitted successfully");
        onSubmit();
      } else {
        setSubmitTaskStatus("Error submitting task");
        alert("Error submitting task");
      }
    },
    [quest.id, text, file, onSubmit],
  );

  return (
    <Box
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{
          m: 0,
          fontFamily:
            '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
          fontSize: "1rem",
          lineHeight: "22px",
        }}
      >
        Submit Task {quest.type === QuestType.VIDEO ? "Video" : ""}{" "}
        {quest.type === QuestType.IMAGE ? "Image" : ""}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <TextField
          margin="normal"
          required
          label={quest.type === QuestType.TEXT ? "Enter the answer here" : ""}
          type={quest.type === QuestType.TEXT ? "text" : "file"}
          onChange={
            quest.type === QuestType.TEXT ? handleInputChange : handleFileChange
          }
          sx={{
            width: isMobile ? "90%" : "400px",
            backgroundColor: "white",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
            borderRadius: "5px",
            ":hover": { boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 2px" },
          }}
          multiline={quest.type === QuestType.TEXT}
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
            (quest.type === QuestType.TEXT ? text === "" : file === null)
          }
        >
          Submit
        </Button>
      </Box>
      <div
        style={{
          color: [
            "File type not supported",
            "Error submitting task",
            "File size should be less than 100MB",
          ].includes(submitTaskStatus)
            ? "red"
            : "black",
        }}
      >
        {submitTaskStatus}
      </div>
    </Box>
  );
};
export default QuestSubmissionForm;
