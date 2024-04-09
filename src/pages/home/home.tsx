import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Card, CardContent, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import { QuestsDays, QuestStatus } from "./home.types";
import { aggregateQuestsByDate } from "./home.utils";

const Home = (pros: any) => {
  const isMobile = window?.innerWidth <= 500;

  const navigate = useNavigate();
  const quests = pros.quests;
  const [questsDays] = React.useState<QuestsDays[]>(
    aggregateQuestsByDate(quests)
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
        (task) => task?.status?.toLocaleUpperCase() === QuestStatus.CORRECT
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
            <Typography variant={isMobile ? "h6" : "h3"}>
              {dateFormated}
              {[...Array(numberOfCorrectTasks)].map((e, i) => (
                <StarBorderOutlinedIcon
                  fontSize={isMobile ? "small" : "large"}
                  key={i}
                  style={{
                    marginLeft: i === 0 ? "20px" : "0px",
                  }}
                />
              ))}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "flex",
              justifyContent: "center",
              padding: isMobile ? "5px" : "10px",
            }}
          >
            <Grid gap={3} container>
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
                  <Grid item key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        width: isMobile ? "150px" : "300px",
                        height: isMobile ? "150px" : "200px",
                        backgroundColor: bkColor,
                        color: color,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(`/task/${questId}`);
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
                              gap: isMobile ? "5px" : "15px",
                              textAlign: "center",
                              fontSize: isMobile ? "12px" : "27px",
                              alignItems: "center",
                            }}
                          >
                            {questStatus === QuestStatus.CORRECT && (
                              <CheckCircleOutlineIcon
                                fontSize={isMobile ? "small" : "large"}
                              />
                            )}
                            {questStatus === QuestStatus.PENDING && (
                              <AccessTimeOutlinedIcon
                                fontSize={isMobile ? "small" : "large"}
                              />
                            )}
                            {questStatus === QuestStatus.WRONG && (
                              <HighlightOffOutlinedIcon
                                fontSize={isMobile ? "small" : "large"}
                              />
                            )}
                            {quest.category}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              textAlign: "center",
                              fontSize: isMobile ? "12px" : "27px",
                              alignItems: "center",
                            }}
                          >
                            {quest?.totalAc}{" "}
                          </div>
                        </div>
                        <div
                          style={{
                            // height: "83%",
                            marginTop: "10px",
                            height: isMobile ? "95px" : "100%",
                            overflowY: "auto",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              justifyContent: isMobile ? "left" : "center",
                              width: "100%",
                              alignItems: isMobile ? "left" : "center",
                              marginBottom: "11px",
                              overflowY: "auto",
                              height: isMobile ? "auto" : "120px",
                            }}
                          >
                            {quest.name}
                          </Typography>
                        </div>
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
