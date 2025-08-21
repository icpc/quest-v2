import * as React from "react";
import { useNavigate } from "react-router";

import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

import { checkAuth, login, loginOIDC } from "../utils/requests";

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
  const [isLoginLoading, setIsLoginLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const newLogin = await login({ email, password });
    if (newLogin !== null) {
      navigate("/home");
    } else {
      alert("Invalid credentials please fill the form to get your password");
    }
    setIsLoginLoading(false);
  };

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
