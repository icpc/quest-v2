import * as React from "react";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { WebsiteSettingsAuthOptions } from "@/types/pocketbase-types";
import { checkAuth, login, loginOIDC } from "@/utils/requests";

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
        {error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : null}
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
              backgroundColor: grey[900],
              ":hover": { backgroundColor: grey[800] },
            }}
            startIcon={
              <img
                src="/icpc.ico"
                alt="ICPC"
                style={{ width: 20, height: 20 }}
              />
            }
            disabled={submitting}
            onClick={async () => {
              try {
                setError(null);
                setSubmitting(true);
                await loginOIDC();
                setSubmitting(false);
                navigate("/home");
              } catch {
                setError(
                  "Single sign-on is unavailable. Please contact your administrator.",
                );
              }
            }}
          >
            Login with icpc.global
          </Button>
        ) : null}
        {submitting ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
              mt: 2,
            }}
          >
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Redirecting, hang tight...
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}
