import { createFileRoute, useRouterState } from "@tanstack/react-router";

import SignIn from "@/components/SignIn";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  const search = useRouterState({
    select: (state) => state.location.search as Record<string, unknown>,
  });
  const redirect =
    typeof search.redirect === "string" ? search.redirect : undefined;
  return <SignIn redirectTo={redirect} />;
}
