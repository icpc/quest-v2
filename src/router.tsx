import React from "react";

import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import App from "@/App";
import SignIn from "@/features/auth/SignIn";
import Rules from "@/features/rules/Rules";
import ValidateSubmissions from "@/features/validation/ValidateSubmissions";
import HomeRoute from "@/routes/HomeRoute";
import LeaderboardRoute, {
  LeaderboardRouteIndex,
} from "@/routes/LeaderboardRoute";
import QuestRoute from "@/routes/QuestRoute";
import { WebsiteSettingsAuthOptions } from "@/types/pocketbase-types";

const LoginSso = () => <SignIn mode={WebsiteSettingsAuthOptions.OIDC} />;
const LoginPassword = () => (
  <SignIn mode={WebsiteSettingsAuthOptions.PASSWORD} />
);

const NotFound = (_props: unknown) => <SignIn />;

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SignIn,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: SignIn,
});

const loginSsoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login/sso",
  component: LoginSso,
});

const loginPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login/password",
  component: LoginPassword,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomeRoute,
});

const rulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rules",
  component: Rules,
});

const questRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quest-details/$questId",
  component: QuestRoute,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardRouteIndex,
});

const leaderboardPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard/$pageNumber",
  component: LeaderboardRoute,
});

const validateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/validate",
  component: ValidateSubmissions,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  loginSsoRoute,
  loginPasswordRoute,
  homeRoute,
  rulesRoute,
  questRoute,
  leaderboardRoute,
  leaderboardPageRoute,
  validateRoute,
]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
