import React from "react";
import { useNavigate } from "react-router";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";

import { Quest, QuestStatus, QuestSubmission } from "../types/types";
import { checkIsMobile } from "../utils/responsive";

import QuestStatusIcon from "./QuestStatusIcon";
import QuestSubmissionForm from "./QuestSubmissionForm";
import QuestSubmissionsList from "./QuestSubmissionsList";

interface QuestProps {
  quest: Quest;
  submissions: QuestSubmission[];
  onSubmit: () => void;
}

const QuestComponent: React.FC<QuestProps> = ({
  quest,
  submissions,
  onSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <Box sx={{ p: 3, maxWidth: "960px" }}>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{ display: "flex", cursor: "pointer", mt: "5px" }}
            onClick={() => navigate("/home")}
          >
            <ArrowBackIcon />
          </Box>
          <QuestStatusIcon status={quest.status} />
          <h2
            style={{
              marginLeft:
                quest.status !== QuestStatus.NOTATTEMPTED ? "10px" : "0px",
              marginTop: "0px",
            }}
          >
            <span
              style={{
                fontWeight: 400,
                color: "rgb(12, 26, 68)",
                lineHeight: "32px",
              }}
            >
              <span
                style={{
                  fontSize: checkIsMobile() ? "1.5rem" : "2rem",
                }}
              >
                {quest.category + ":"}
                <span style={{ marginLeft: "12px" }}>{quest.name}</span>
              </span>
            </span>
          </h2>
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
};

export default QuestComponent;
