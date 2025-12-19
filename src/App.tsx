import React from "react";
import { HashRouter, Route, Routes } from "react-router";

import { CssBaseline, Toolbar } from "@mui/material";
import styled from "styled-components";

import DrawerAppBar from "@/components/Header";
import config from "@/config";
import SignIn from "@/features/auth/SignIn";
import Rules from "@/features/rules/Rules";
import ValidateSubmissions from "@/features/validation/ValidateSubmissions";
import HomeRoute from "@/routes/HomeRoute";
import LeaderboardRoute from "@/routes/LeaderboardRoute";
import QuestRoute from "@/routes/QuestRoute";
import { WebsiteSettingsAuthOptions } from "@/types/pocketbase-types";

const AppContainer = styled.div`
  background-color: ${config.BACKGROUND_COLOR};
`;

const App = () => {
  return (
    <HashRouter>
      <AppContainer className="container">
        <CssBaseline />
        <DrawerAppBar />
        <Toolbar />
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route
            path="/login/sso"
            element={<SignIn mode={WebsiteSettingsAuthOptions.OIDC} />}
          />
          <Route
            path="/login/password"
            element={<SignIn mode={WebsiteSettingsAuthOptions.PASSWORD} />}
          />
          <Route path="/home" element={<HomeRoute />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/quest-details/:questId" element={<QuestRoute />} />
          <Route path="/leaderboard" element={<LeaderboardRoute />} />
          <Route
            path="/leaderboard/:pageNumber"
            element={<LeaderboardRoute />}
          />
          <Route path="/validate" element={<ValidateSubmissions />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </AppContainer>
    </HashRouter>
  );
};

// LoginDefault removed: SignIn self-resolves default mode from settings.

export default App;
