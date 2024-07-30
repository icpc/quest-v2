import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/Login";
import QuestProxy from "./components/proxy/QuestProxy";
import HomeProxy from "./components/proxy/HomeProxy";
import Leaderboard from "./components/proxy/LeaderboardProxy";
import DrawerAppBar from "./components/Header";
import { Toolbar } from "@mui/material";
import Admin from "./components/Admin";
import styled from "styled-components";
import config from "./config";
import Rules from "./components/Rules";

const AppContainer = styled.div`
  background-color: ${config.BACKGROUND_COLOR};
`;

const App = () => {
  return (
    <HashRouter>
      <AppContainer className="container">
        <DrawerAppBar />
        <Toolbar />
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/home" element={<HomeProxy />} />
          <Route path="/rules" element={<Rules />} />
          <Route
            path="/quest-details/:questId"
              element={<QuestProxy />}
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/leaderboard/:pageNumber"
            element={<Leaderboard />}
          />
          <Route
            path="/admin/submissionsTable"
            element={<Admin />}
          />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </AppContainer>
    </HashRouter>
  );
};

export default App;
