import { createFileRoute } from "@tanstack/react-router";

import SignIn from "@/components/SignIn";
import { WebsiteSettingsAuthOptions } from "@/types/pocketbase-types";

const LoginSso = () => {
  return <SignIn mode={WebsiteSettingsAuthOptions.OIDC} redirectTo="/home" />;
};

export const Route = createFileRoute("/login/sso")({
  component: LoginSso,
});
