import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  checkUserAuthentication,
  localStorageRemoveItem,
  localStorageSetItemWithExpiry,
} from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/requests";

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const isAuthenticated = checkUserAuthentication();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const newLogin = await login({ email, password });
    console.log(newLogin);
    if (newLogin !== null) {
      localStorageSetItemWithExpiry("isAuthenticated", "true", 10000000);
      localStorageSetItemWithExpiry("userInfo", newLogin, 10000000);
      window.location.href = "/home";
    } else {
      localStorageRemoveItem("isAuthenticated");
      localStorageRemoveItem("userInfo");
      alert("Invalid credentials");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
