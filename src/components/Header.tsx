import * as React from "react";
import { Link, useNavigate } from "react-router";

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

import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { POCKETBASE_URL } from "@/utils/env";
import { getUserInfo, logout } from "@/utils/requests";

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { settings } = useWebsiteSettings();
  const userInfo = getUserInfo();

  type NavPage = {
    name: string;
    url: string;
    external?: boolean;
  };

  const navPages = React.useMemo<NavPage[]>(() => {
    const pageEntries: NavPage[] = [
      { name: "HOME", url: "/home" },
      { name: "LEADERBOARD", url: "/leaderboard" },
      { name: "RULES", url: "/rules" },
    ];
    if (userInfo?.canValidate) {
      pageEntries.push({ name: "ADMIN", url: "/validate" });
      pageEntries.push({
        name: "POCKETBASE",
        url: `${POCKETBASE_URL}/_/#`,
        external: true,
      });
    }
    return pageEntries;
  }, [userInfo?.canValidate]);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = settings.name;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", settings.name);
    }
  }, [settings.name]);

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
            sx={{ flexGrow: 1, display: "flex" }}
            align="center"
          >
            <Link to="/home" style={{ display: "flex", width: "100%" }}>
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" height="38" />
              ) : null}
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navPages.map(({ name, url, external }) => (
              <Button
                key={name}
                sx={{ color: "#fff" }}
                component={Link}
                to={url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                reloadDocument={external}
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
              {navPages.map(({ name, url, external }) => (
                <ListItem key={name} disablePadding>
                  <ListItemButton
                    sx={{ textAlign: "center" }}
                    onClick={() => {
                      if (external) {
                        if (typeof window !== "undefined") {
                          window.open(url, "_blank", "noopener,noreferrer");
                        }
                      } else {
                        navigate(url);
                      }
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
