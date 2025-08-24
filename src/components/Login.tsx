import * as React from "react";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

import { checkAuth, loginOIDC } from "../utils/requests";

const defaultTheme = createTheme();

const LoginFormWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export default function SignIn() {
  const navigate = useNavigate();
  const isAuthenticated = checkAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <LoginFormWrapper>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </LoginFormWrapper>
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
      </Container>
    </ThemeProvider>
  );
}
