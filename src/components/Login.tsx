import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  checkUserAuthentication,
  localStorageRemoveItem,
  localStorageSetItemWithExpiry,
} from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/requests";
import config from "../config";

const defaultTheme = createTheme();

const LoginFormWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export default function SignIn() {
  const navigate = useNavigate();
  const isAuthenticated = checkUserAuthentication();
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
      localStorageSetItemWithExpiry(
        "isAuthenticated",
        "true",
        config.LOGIN_EXPIRED_TIME
      );
      localStorageSetItemWithExpiry(
        "userInfo",
        newLogin,
        config.LOGIN_EXPIRED_TIME
      );
      navigate("/home");
    } else {
      // why remove? idk
      localStorageRemoveItem("isAuthenticated");
      localStorageRemoveItem("userInfo");
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoginLoading}
            >
              Sign In
            </Button>
            <Link
              href="https://forms.gle/GFVDxQRJXiAqYXVaA"
              target="_blank"
              rel="noreferrer"
            >
              Don't use your ICPC.global password! Fill this form with your icpc
              email to receive dedicated Quest password.
            </Link>
          </Box>
        </LoginFormWrapper>
      </Container>
    </ThemeProvider>
  );
}
