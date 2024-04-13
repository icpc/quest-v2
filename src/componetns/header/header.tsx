import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle } from "@material-ui/icons";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import {
  localStorageGetItemWithExpiry,
  localStorageRemoveItem,
} from "../../utils/helper";
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const title = "ICPC Quest";
export default function DrawerAppBar(props: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userInfo, setUserInfo] = React.useState(
    localStorageGetItemWithExpiry("userInfo")
  );

  const [navItems] = React.useState([
    "HOME",
    "LEADERBOARD",
    userInfo?.user?.email,
  ]);
  const navigate = useNavigate();

  React.useEffect(() => {
    // window.addEventListener("storage", () => {
    //   setUserInfo(localStorageGetItemWithExpiry("userInfo"));
    // });
    // return () => {
    //   window.onstorage = null;
    // };
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = React.useCallback(() => {
    localStorageRemoveItem("isAuthenticated");
    localStorageRemoveItem("userInfo");
    setUserInfo({});
    navigate("/quest/login");
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const profileIconMenue = React.useCallback(() => {
    if (!userInfo?.user?.email) return null;
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
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuItem onClick={handleClose}>LogOut</MenuItem>
        </Menu>
      </div>
    );
  }, [anchorEl, handleClose, userInfo]);

  const drawer = React.useMemo(() => {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{ my: 2, textAlign: "center" }}
          align="center"
        >
          {title}
        </Typography>

        {userInfo?.user?.email && (
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item}
                onClick={() => {
                  if (item === "HOME") {
                    navigate("/quest/home");
                  } else if (item === "LEADERBOARD") {
                    navigate("/quest/leaderboard/1");
                  }
                }}
                disablePadding
              >
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText onClick={handleDrawerToggle} primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
            {profileIconMenue()}
          </List>
        )}
      </Box>
    );
  }, [navItems, navigate, profileIconMenue, userInfo]);

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
            sx={{
              mr: 2,
              display: { sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: {
                xs: "flex",
                sm: "flex",
                md: "flex",
                lg: "flex",
                xl: "flex",
              },
              cursor: "pointer",
            }}
            align="center"
            onClick={() => navigate("/quest/home")}
          >
            <img src={logo} alt="ICPC logo" />
          </Typography>

          {userInfo?.user?.email && (
            <Box
              sx={{
                //flexGrow: 1,
                display: {
                  xs: "none",
                  sm: "flex",
                  md: "flex",
                  lg: "flex",
                  xl: "flex",
                },
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{ color: "#fff" }}
                  onClick={() => {
                    if (item === "HOME") {
                      navigate("/quest/home");
                    } else if (item === "LEADERBOARD") {
                      navigate("/quest/leaderboard/1");
                    }
                  }}
                >
                  {item}
                </Button>
              ))}
              {profileIconMenue()}
            </Box>
          )}
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
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
