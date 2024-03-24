import React from "react";
import DrawerAppBar from "../../componetns/header/header";
import { useNavigate } from "react-router-dom";
import { checkUserAuthentication } from "../../utils/helper";
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
const Home = () => {
  const isAuthenticated = checkUserAuthentication(); // Implement this function to check if the user is authenticated
  const navigate = useNavigate();
  const [daysTasks, setDaysTasks] = React.useState([
    {
      date: "2021-11-15",
      detailsTasks: [
        {
          taskTitle: "Photo Hunt",
          taskDescription: "hexagonal pattern from our photo",
          status: "correct",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "WF 2011 Coffee Central",
          status: "correct",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "correct",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "wrong",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "pending",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
      ],
    },
    {
      date: "2021-11-14",
      detailsTasks: [
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
      ],
    },
    {
      date: "2021-11-13",
      detailsTasks: [
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
      ],
    },
    {
      date: "2021-11-12",
      detailsTasks: [
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
        {
          taskTitle: "Photo Hunt",
          taskDescription: "Find the photo",
          status: "",
        },
      ],
    },
  ]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const daysTasksListJSX = React.useCallback(() => {
    return daysTasks.map((dayTask, index) => {
      const expanded = index === 0;
      // format date
      const date = new Date(dayTask.date);
      const dateFormated = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const numberOfCorrectTasks = dayTask.detailsTasks.filter(
        (task) => task.status === "correct"
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
              {/* put number of stars according to number of correct tasks */}
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
              {dayTask.detailsTasks.map((task, index) => {
                const status = task.status;
                const bkColor =
                  status === "correct"
                    ? "rgba(0, 128, 0, 0.7)"
                    : status === "pending"
                    ? "rgb(147 143 74)"
                    : status === "wrong"
                    ? "#f44336ba"
                    : "grey";
                const color =
                  status === "correct"
                    ? "white"
                    : status === "pending"
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
                        navigate(`/task/${index}`);
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
                          {task.status === "correct" && (
                            <CheckCircleOutlineIcon fontSize="large" />
                          )}
                          {task.status === "pending" && (
                            <AccessTimeOutlinedIcon fontSize="large" />
                          )}
                          {task.status === "wrong" && (
                            <HighlightOffOutlinedIcon fontSize="large" />
                          )}
                          {task.taskTitle}
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
                            {task.taskDescription}
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
  }, [daysTasks]);

  if (!isAuthenticated) {
    return null; // This will prevent the rest of the render
  }

  return (
    <div>
      <DrawerAppBar />
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        {daysTasksListJSX()}
      </Box>
    </div>
  );
};

export default Home;
