/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import { QuestStatus, QuestsDays } from "../types/types";
import { aggregateQuestsByDate } from "../utils/utils";

const Home = (pros: any) => {
  const isMobile = window?.innerWidth <= 500;

  const navigate = useNavigate();
  const quests = pros.quests;
  const [questsDays] = React.useState<QuestsDays[]>(
    aggregateQuestsByDate(quests),
  );
  const daysTasksListJSX = React.useCallback(() => {
    const questsDaysRev = [...questsDays];
    return questsDaysRev.map((questDay, index) => {
      const expanded = index === 0;
      const date = new Date(questDay.date);
      const dateFormated = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const numberOfCorrectTasks = questDay?.detailsQuests?.filter(
        (task) => task?.status?.toLocaleUpperCase() === QuestStatus.CORRECT,
      ).length;

      return (
        <Accordion
          defaultExpanded={expanded}
          key={index}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 2px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
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
              {dateFormated}
              {[...Array(numberOfCorrectTasks)].map((e, i) => (
                <StarBorderOutlinedIcon
                  fontSize={isMobile ? "small" : "large"}
                  key={i}
                  style={{
                    marginLeft: i === 0 ? "20px" : "0px",
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
            <Grid spacing={3} container>
              {questDay?.detailsQuests.map((quest, index) => {
                const questStatus = quest?.status?.toLocaleUpperCase();
                const questId = quest.id;
                const bkColor =
                  questStatus === QuestStatus.CORRECT
                    ? "rgba(0, 128, 0, 0.7)"
                    : questStatus === QuestStatus.PENDING
                      ? "rgb(147 143 74)"
                      : questStatus === QuestStatus.WRONG
                        ? "#f44336ba"
                        : "grey";
                const color =
                  questStatus === QuestStatus.CORRECT
                    ? "white"
                    : questStatus === QuestStatus.PENDING
                      ? "white"
                      : "white";
                return (
                  <Grid key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        width: isMobile ? "150px" : "250px",
                        height: "150px",
                        backgroundColor: bkColor,
                        color: color,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(`/quest-details/${questId}`);
                      }}
                    >
                      <CardContent
                        sx={{
                          color: color,
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
                              // marginLeft:
                              //   questStatus === QuestStatus.NOTATTEMPTED
                              //     ? "15px"
                              //     : "0px",
                            }}
                          >
                            {questStatus === QuestStatus.CORRECT && (
                              <CheckCircleOutlineIcon fontSize={"small"} />
                            )}
                            {questStatus === QuestStatus.PENDING && (
                              <AccessTimeOutlinedIcon fontSize={"small"} />
                            )}
                            {questStatus === QuestStatus.WRONG && (
                              <HighlightOffOutlinedIcon fontSize={"small"} />
                            )}
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
                            {quest?.totalAc}{" "}
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
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    });
  }, [isMobile, navigate, questsDays]);

  return (
    <div>
      <Box component="main" sx={{ p: isMobile ? 1 : 3 }}>
        {daysTasksListJSX()}
      </Box>
    </div>
  );
};

export default Home;
