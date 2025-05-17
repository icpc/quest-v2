import React from "react";
import { Box } from "@mui/material";
import { QuestSubmission } from "../types/types";
import ImgMediaCard from "./ImgMediaCard";

interface QuestSubmissionsListProps {
  submissions: QuestSubmission[];
}
const QuestSubmissionsList: React.FC<QuestSubmissionsListProps> = ({
  submissions,
}) => {
  if (!submissions || submissions.length === 0) {
    return (
      <h3 style={{ fontSize: "1rem", fontWeight: 400 }}>No submissions yet</h3>
    );
  }
  return (
    <>
      <h2>Submissions</h2>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        {submissions.map((submission, idx) => (
          <ImgMediaCard key={idx} submission={submission} />
        ))}
      </Box>
    </>
  );
};
export default QuestSubmissionsList;
