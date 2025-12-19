import React from "react";
import { Link } from "react-router";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import { QuestStatus, QuestSummary, QuestsDays } from "@/types/types";
import { formatDate } from "@/utils/human-readable-date";
import { aggregateQuestsByDate } from "@/utils/utils";

const statusBackground: Record<QuestStatus, string> = {
  [QuestStatus.CORRECT]: "rgba(0, 128, 0, 0.7)",
  [QuestStatus.PENDING]: "rgb(147 143 74)",
  [QuestStatus.WRONG]: "#f44336ba",
  [QuestStatus.NOTATTEMPTED]: "grey",
};

type QuestStatusIconProps = {
  status: QuestStatus;
};

function QuestStatusIconComponent({ status }: QuestStatusIconProps) {
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
}

interface QuestCardProps {
  quest: QuestSummary;
}

function QuestCard({ quest }: QuestCardProps) {
  const backgroundColor = statusBackground[quest.status];

  return (
    <Grid size="auto">
      <Link
        to={`/quest-details/${quest.id}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <Card
          sx={{
            display: "flex",
            width: { xs: 150, md: 250 },
            height: 150,
            backgroundColor,
            color: "white",
            cursor: "pointer",
          }}
        >
          <CardContent sx={{ color: "white", width: "100%", p: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <QuestStatusIconComponent status={quest.status} />
                {quest.category}
              </Box>
              <Typography
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {quest.totalAc}
              </Typography>
            </Box>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: 110,
                alignItems: "center",
                overflow: "hidden",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              {quest.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

interface DayAccordionProps {
  questDay: QuestsDays;
  expanded: boolean;
}

function DayAccordion({ questDay, expanded }: DayAccordionProps) {
  const formattedDate = formatDate(questDay.date, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const numberOfCorrectTasks = questDay.detailsQuests.filter(
    (task) => task.status === QuestStatus.CORRECT,
  ).length;

  return (
    <Accordion defaultExpanded={expanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {formattedDate}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            ml: 2,
          }}
        >
          {Array.from({ length: numberOfCorrectTasks }).map((_, index) => (
            <StarBorderOutlinedIcon key={index} sx={{ fontSize: "2rem" }} />
          ))}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          {questDay.detailsQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

interface HomeProps {
  quests: QuestSummary[];
}

function Home({ quests }: HomeProps) {
  const questsDays = aggregateQuestsByDate(quests);

  return (
    <Container sx={{ mt: 4 }}>
      {questsDays.map((questDay, index) => (
        <DayAccordion
          key={questDay.date}
          questDay={questDay}
          expanded={index === 0}
        />
      ))}
    </Container>
  );
}

export default Home;
