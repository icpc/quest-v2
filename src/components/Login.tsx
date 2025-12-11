import * as React from "react";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useWebsiteSettings } from "../hooks/useWebsiteSettings";
import { WebsiteSettingsAuthOptions } from "../types/pocketbase-types";
import { checkAuth, login, loginOIDC } from "../utils/requests";

export default function SignIn({
  mode,
}: {
  mode?: WebsiteSettingsAuthOptions;
}) {
  const navigate = useNavigate();
  const isAuthenticated = checkAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { settings } = useWebsiteSettings();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const authOptions = React.useMemo(() => {
    return mode ? [mode] : settings.auth;
  }, [mode, settings.auth]);

  return (
    <Container component="main" maxWidth="xs" sx={{ padding: 8 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4">Sign in</Typography>
        {authOptions.includes(WebsiteSettingsAuthOptions.PASSWORD) ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setSubmitting(true);
              const user = await login({ email, password });
              setSubmitting(false);
              if (user) {
                navigate("/home");
              } else {
                setError("Incorrect email or password");
              }
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              {error ? (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              ) : null}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </Box>
          </form>
        ) : null}
        {authOptions.includes(WebsiteSettingsAuthOptions.OIDC) ? (
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "rgb(0, 67, 147)",
            }}
            startIcon={
              <img
                src="/icpc.ico"
                alt="ICPC"
                style={{ width: 20, height: 20 }}
              />
            }
            onClick={() =>
              loginOIDC().then(() => {
                navigate("/home");
              })
            }
          >
            Login with icpc.global
          </Button>
        ) : null}
      </Box>
    </Container>
  );
}
