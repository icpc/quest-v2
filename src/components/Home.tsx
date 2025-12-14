import React from "react";
import { useNavigate } from "react-router";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import { QuestStatus, QuestSummary, QuestsDays } from "../types/types";
import { formatDate } from "../utils/human-readable-date";
import { checkIsMobile } from "../utils/responsive";
import { aggregateQuestsByDate } from "../utils/utils";

const statusBackground: Record<QuestStatus, string> = {
  [QuestStatus.CORRECT]: "rgba(0, 128, 0, 0.7)",
  [QuestStatus.PENDING]: "rgb(147 143 74)",
  [QuestStatus.WRONG]: "#f44336ba",
  [QuestStatus.NOTATTEMPTED]: "grey",
};

type QuestStatusIconProps = {
  status: QuestStatus;
};

const QuestStatusIconComponent = ({ status }: QuestStatusIconProps) => {
  switch (status) {
    case QuestStatus.CORRECT:
      return <CheckCircleOutlineIcon fontSize="small" />;
    case QuestStatus.PENDING:
      return <AccessTimeOutlinedIcon fontSize="small" />;
    case QuestStatus.WRONG:
      return <HighlightOffOutlinedIcon fontSize="small" />;
    default:
      return null;
  }
};

interface QuestCardProps {
  quest: QuestSummary;
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const navigate = useNavigate();
  const isMobile = checkIsMobile();
  const backgroundColor = statusBackground[quest.status];

  return (
    <Grid size="auto">
      <Card
        sx={{
          display: "flex",
          width: isMobile ? "150px" : "250px",
          height: "150px",
          backgroundColor,
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/quest/${quest.id}`)}
      >
        <CardContent
          sx={{
            color: "white",
            width: "100%",
            padding: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                textAlign: "center",
                fontSize: isMobile ? "12px" : "1rem",
                alignItems: "center",
              }}
            >
              <QuestStatusIconComponent status={quest.status} />
              {quest.category}
            </div>
            <div
              style={{
                display: "flex",
                textAlign: "center",
                fontSize: isMobile ? "12px" : "1rem",
                alignItems: "center",
              }}
            >
              {quest.totalAc}
            </div>
          </div>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              overflowY: "auto",
              height: "120px",
              fontSize: isMobile ? "1rem" : "1.5rem",
              textAlign: "center",
            }}
          >
            {quest.name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface DayAccordionProps {
  questDay: QuestsDays;
  expanded: boolean;
}

const DayAccordion = ({ questDay, expanded }: DayAccordionProps) => {
  const isMobile = checkIsMobile();
  const formattedDate = formatDate(questDay.date, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const numberOfCorrectTasks = questDay.detailsQuests.filter(
    (task) => task.status === QuestStatus.CORRECT,
  ).length;

  return (
    <Accordion
      defaultExpanded={expanded}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 2px",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{
          paddingLeft: isMobile ? "4px" : "10px",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h3"}
          style={{
            fontSize: "2rem",
          }}
        >
          {formattedDate}
          {Array.from({ length: numberOfCorrectTasks }).map((_, index) => (
            <StarBorderOutlinedIcon
              fontSize={isMobile ? "small" : "large"}
              key={`${questDay.date}-star-${index}`}
              style={{
                marginLeft: index === 0 ? "20px" : "0px",
                fontSize: "2rem",
              }}
            />
          ))}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          padding: isMobile ? "5px" : "10px",
        }}
      >
        <Grid container spacing={3}>
          {questDay.detailsQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

const Home = ({ quests }: { quests: QuestSummary[] }) => {
  const isMobile = checkIsMobile();

  const questsDays = aggregateQuestsByDate(quests);

  return (
    <Box component="main" sx={{ p: isMobile ? 1 : 3 }}>
      {questsDays.map((questDay, index) => (
        <DayAccordion
          key={questDay.date}
          questDay={questDay}
          expanded={index === 0}
        />
      ))}
    </Box>
  );
};

export default Home;
