import * as React from "react";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

import { SettingsAuthOptions } from "../types/pocketbase-types";
import { checkAuth, getSettings, login, loginOIDC } from "../utils/requests";

const defaultTheme = createTheme();

const LoginFormWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export default function SignIn({ mode }: { mode?: SettingsAuthOptions }) {
  const navigate = useNavigate();
  const isAuthenticated = checkAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [auth, setAuth] = React.useState<SettingsAuthOptions>(
    SettingsAuthOptions.PASSWORD,
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (mode) {
      setAuth(mode);
      return;
    }
    getSettings().then((s) => setAuth(s.auth));
  }, [mode]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <LoginFormWrapper>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </LoginFormWrapper>
        {auth === SettingsAuthOptions.OIDC ? (
          <Button
            variant="outlined"
            fullWidth
            onClick={() =>
              loginOIDC().then(() => {
                navigate("/home");
              })
            }
          >
            Login with icpc.global
          </Button>
        ) : (
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
                setError("Invalid email or password");
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
        )}
      </Container>
    </ThemeProvider>
  );
}
