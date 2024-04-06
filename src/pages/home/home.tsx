import React from "react";
import DrawerAppBar from "../../componetns/header/header";
import { useNavigate } from "react-router-dom";
import {
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
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
  const navigate = useNavigate();
  const quests = pros.quests;
  const [questsDays, setQuestsDays] = React.useState<QuestsDays[]>(
    aggregateQuestsByDate(quests)
  );

  const daysTasksListJSX = React.useCallback(() => {
    return questsDays.map((questDay, index) => {
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
          style={{
            marginBottom: "30px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h3">
              {dateFormated}
              {[...Array(numberOfCorrectTasks)].map((e, i) => (
                <StarBorderOutlinedIcon
                  fontSize="large"
                  key={i}
                  style={{
                    marginLeft: i === 0 ? "20px" : "0px",
                  }}
                />
              ))}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
                        width: 300,
                        height: 200,
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
                            gap: "15px",
                            textAlign: "center",
                            fontSize: "27px",
                            alignItems: "center",
                          }}
                        >
                          {questStatus === QuestStatus.CORRECT && (
                            <CheckCircleOutlineIcon fontSize="large" />
                          )}
                          {questStatus === QuestStatus.PENDING && (
                            <AccessTimeOutlinedIcon fontSize="large" />
                          )}
                          {questStatus === QuestStatus.WRONG && (
                            <HighlightOffOutlinedIcon fontSize="large" />
                          )}
                          {quest.name}
                        </div>
                        <div
                          style={{
                            height: "83%",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                              alignItems: "center",
                            }}
                          >
                            {quest.description}
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
  }, [navigate, questsDays]);

  return (
    <div>
      <Box component="main" sx={{ p: 3 }}>
        {daysTasksListJSX()}
      </Box>
    </div>
  );
};

export default Home;
