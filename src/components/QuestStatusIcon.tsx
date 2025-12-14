import React from "react";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

import { QuestStatus } from "../types/types";
import { checkIsMobile } from "../utils/responsive";

interface QuestStatusIconProps {
  status: QuestStatus;
}

function QuestStatusIcon({ status }: QuestStatusIconProps) {
  const isMobile = checkIsMobile();

  const iconProps = {
    fontSize: isMobile ? "small" : ("large" as "small" | "large"),
    style: { marginTop: isMobile ? "6px" : "0px" },
  };

  switch (status) {
    case QuestStatus.CORRECT:
      return (
        <CheckCircleOutlineIcon
          {...iconProps}
          style={{ ...iconProps.style, color: "green" }}
        />
      );
    case QuestStatus.PENDING:
      return <AccessTimeOutlinedIcon {...iconProps} />;
    case QuestStatus.WRONG:
      return <HighlightOffOutlinedIcon {...iconProps} />;
    default:
      return null;
  }
}

export default QuestStatusIcon;
