import { CssBaseline, Toolbar } from "@mui/material";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import styled from "styled-components";

import DrawerAppBar from "@/components/Header";
import config from "@/config";
import { loadWebsiteSettings } from "@/utils/website-settings";

const AppContainer = styled.div`
  background-color: ${config.BACKGROUND_COLOR};
`;

const RootLayout = () => {
  return (
    <AppContainer className="container">
      <CssBaseline />
      <DrawerAppBar />
      <Toolbar />
      <Outlet />
    </AppContainer>
  );
};

export const Route = createRootRoute({
  loader: async () => {
    const website_settings = await loadWebsiteSettings();
    return { website_settings };
  },
  staleTime: 60 * 1000, // 1 minute
  component: RootLayout,
});
