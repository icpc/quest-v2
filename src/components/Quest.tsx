import React from "react";
import { Link } from "react-router";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";

import { Quest, QuestStatus, QuestSubmission } from "@/types/types";

import QuestStatusIcon from "./QuestStatusIcon";
import QuestSubmissionForm from "./QuestSubmissionForm";
import QuestSubmissionsList from "./QuestSubmissionsList";

interface QuestProps {
  quest: Quest;
  submissions: QuestSubmission[];
  onSubmit: () => void;
}

function QuestComponent({ quest, submissions, onSubmit }: QuestProps) {
  return (
    <div>
      <Box sx={{ p: 3, maxWidth: "960px" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Link
            to="/home"
            style={{
              display: "flex",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <ArrowBackIcon />
          </Link>
          <QuestStatusIcon status={quest.status} />
          <Box
            sx={{
              marginLeft:
                quest.status !== QuestStatus.NOTATTEMPTED ? "10px" : "0px",
              fontWeight: 400,
              color: "rgb(12, 26, 68)",
              lineHeight: "32px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {`${quest.category}: ${quest.name}`}
            </Typography>
          </Box>
        </Box>
        <div
          dangerouslySetInnerHTML={{ __html: quest.description }}
          style={{ fontSize: "1rem" }}
        />
        <QuestSubmissionForm quest={quest} onSubmit={onSubmit} />
        <QuestSubmissionsList submissions={submissions} />
      </Box>
    </div>
  );
}

export default QuestComponent;
