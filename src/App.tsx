import React from "react";
import { HashRouter, Route, Routes } from "react-router";

import { Toolbar } from "@mui/material";
import styled from "styled-components";

import DrawerAppBar from "./components/Header";
import SignIn from "./components/Login";
import Rules from "./components/Rules";
import HomeProxy from "./components/proxy/HomeProxy";
import Leaderboard from "./components/proxy/LeaderboardProxy";
import QuestProxy from "./components/proxy/QuestProxy";
import config from "./config";

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
          <Route path="/quest-details/:questId" element={<QuestProxy />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leaderboard/:pageNumber" element={<Leaderboard />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </AppContainer>
    </HashRouter>
  );
};

export default App;
