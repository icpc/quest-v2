import React from "react";

import { CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import styled from "styled-components";

import DrawerAppBar from "@/components/Header";
import config from "@/config";

const AppContainer = styled.div`
  background-color: ${config.BACKGROUND_COLOR};
`;

const App = () => {
  return (
    <AppContainer className="container">
      <CssBaseline />
      <DrawerAppBar />
      <Toolbar />
      <Outlet />
    </AppContainer>
  );
};

export default App;
