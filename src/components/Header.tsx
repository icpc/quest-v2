import * as React from "react";
import { useNavigate } from "react-router";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { getSettings, getUserInfo, logout } from "../utils/requests";

const pages = {
  HOME: "/home",
  LEADERBOARD: "/leaderboard/1",
  RULES: "/rules",
};

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [appLogo, setAppLogo] = React.useState<string | null>(null);
  const userInfo = getUserInfo();

  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = React.useCallback(() => {
    logout();
    navigate("/login");
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    getSettings().then((s) => {
      setAppLogo(s.logo);
    });
  }, []);

  const IconProfile = React.useCallback(() => {
    return (
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem disabled>{userInfo?.user?.email}</MenuItem>
          <MenuItem onClick={handleClose}>Log out</MenuItem>
        </Menu>
      </div>
    );
  }, [anchorEl, handleClose, userInfo]);

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar
          style={{
            backgroundImage: "linear-gradient(to left, #164174 , #143356)",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: "flex", cursor: "pointer" }}
            align="center"
            onClick={() => navigate("/home")}
          >
            {appLogo ? <img src={appLogo} alt="Logo" height="38" /> : null}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {Object.entries(pages).map(([name, url]) => (
              <Button
                key={name}
                sx={{ color: "#fff" }}
                onClick={() => navigate(url)}
              >
                {name}
              </Button>
            ))}
          </Box>

          {IconProfile()}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          <Box>
            <List>
              {Object.entries(pages).map(([name, url]) => (
                <ListItem key={name} disablePadding>
                  <ListItemButton
                    sx={{ textAlign: "center" }}
                    onClick={() => {
                      navigate(url);
                      handleDrawerToggle();
                    }}
                  >
                    <ListItemText primary={name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </nav>
    </Box>
  );
}
