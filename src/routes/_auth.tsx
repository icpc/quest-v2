import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { checkAuth } from "@/utils/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    if (!checkAuth()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: Outlet,
});
