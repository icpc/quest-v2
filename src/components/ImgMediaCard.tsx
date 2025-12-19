import React from "react";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";

import {
  QuestStatus,
  QuestSubmission,
  QuestSubmissionContentType,
} from "@/types/types";
import { formatDate } from "@/utils/human-readable-date";

interface ImgMediaCardProps {
  submission: QuestSubmission;
}
function ImgMediaCard({ submission }: ImgMediaCardProps) {
  const { status, content, uploadTime } = submission;
  return (
    <Card
      sx={{
        width: 345,
        height: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
        cursor: "pointer",
        color:
          status === QuestStatus.CORRECT
            ? "green"
            : status === QuestStatus.WRONG
              ? "red"
              : undefined,
      }}
    >
      {content.type === QuestSubmissionContentType.IMAGE ? (
        <CardMedia
          component="img"
          height="195"
          image={content.url}
          alt="submission image"
          onClick={() => window.open(content.url, "_blank")}
        />
      ) : content.type === QuestSubmissionContentType.VIDEO ? (
        <CardMedia
          component="video"
          image={content.url}
          controls
          onClick={() => window.open(content.url, "_blank")}
          style={{ height: "195px" }}
        />
      ) : (
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="span"
            sx={{ display: "block", textOverflow: "ellipsis", height: "150px" }}
          >
            {content.text}
          </Typography>
        </CardContent>
      )}
      <CardContent sx={{ p: 0, pl: 1 }}>
        <Typography
          variant="h6"
          component="span"
          sx={{ display: "block", fontSize: 14, mb: 0.5 }}
        >
          {formatDate(uploadTime, {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Typography>
        <Typography
          gutterBottom
          variant="h5"
          component="span"
          sx={{ display: "block" }}
        >
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
}
export default ImgMediaCard;
