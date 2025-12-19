import { createFileRoute } from "@tanstack/react-router";

import SignIn from "@/components/SignIn";
import { WebsiteSettingsAuthOptions } from "@/types/pocketbase-types";

const LoginPassword = () => {
  return (
    <SignIn mode={WebsiteSettingsAuthOptions.PASSWORD} redirectTo="/home" />
  );
};

export const Route = createFileRoute("/login/password")({
  component: LoginPassword,
});
