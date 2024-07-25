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
      localStorageSetItemWithExpiry("isAuthenticated", "true", 10000000000);
      localStorageSetItemWithExpiry("userInfo", newLogin, 10000000000);
      navigate("/home");
    } else {
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
              disabled={isLoginLoading}
            >
              Sign In
            </Button>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScWCrO2xwR0R3tXx1g4P9rgWNAAh1QGKLtP8Qq4oBmEJlkrVA/viewform"
              target="_blank"
              rel="noreferrer"
            >
              Don't use your ICPC account password,Fill this form with your icpc
              email to get your password
            </a>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
