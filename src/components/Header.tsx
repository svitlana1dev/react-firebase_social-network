import { FC, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { AccountCircle } from "@mui/icons-material";
import { Avatar, Button, Typography } from "@mui/material";
import { useUserAuth, userAuthContext } from "../context/UserAuthContext";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export const Header: FC = (props: Props) => {
  const { window } = props;
  const { user, logOut } = useUserAuth() as userAuthContext;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const routs = [
    {
      path: "/",
      title: "Home",
    },
    {
      path: `/profile/${user.uid}`,
      title: "Profile",
    },
    {
      path: "/settings",
      title: "Settings",
    },
  ];

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {routs.map(({ path, title }) => (
          <ListItem key={title} disablePadding>
            <NavLink
              to={path}
              style={({ isActive }) => {
                return {
                  color: isActive ? "#1565C0" : "#757575",
                };
              }}
            >
              <ListItemButton>
                <Typography variant="overline" display="block" gutterBottom>
                  {title}
                </Typography>
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Button
          style={{ paddingLeft: 16, color: "#757575" }}
          size={"small"}
          onClick={() => logOut()}
        >
          Log Out
        </Button>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{ backgroundColor: "#fff" }}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
          borderBottom: 0.5,
          borderColor: "#bdbdbd",
        }}
      >
        <Toolbar sx={{ justifyContent: "end" }}>
          <IconButton
            color="default"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {user.photoURL ? (
            <Avatar alt={user.displayName} src={user.photoURL} />
          ) : (
            <AccountCircle style={{ fill: "#bdbdbd" }} />
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
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
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {Object.keys(user).length === 0 && <p>Loading...</p>}
        {Object.keys(user).length > 0 && <Outlet />}
      </Box>
    </Box>
  );
};
