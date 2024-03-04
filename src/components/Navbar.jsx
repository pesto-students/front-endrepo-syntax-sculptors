import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
  CssBaseline,
  Link,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
const mobileNavItems = [
  { title: "Home", path: "/" },
  { title: "Post a Task", path: "/create-post" },
  { title: "My Tasks", path: "/mytasks" },
  { title: "Browse Tasks", path: "/tasks" },
  { title: "My Wallet", path: "/wallet" },
  { title: "Account", path: "/account" },
];

const desktopNavItems = [
  { title: "Post a Task", path: "/create-post" },
  { title: "My Tasks", path: "/mytasks" },
  { title: "Browse Tasks", path: "/browse-tasks" },
];
const drawerWidth = 360;

// todo: move navlink to components
const NavLink = ({ title, path }) => {
  return <Link sx={{ textDecoration: "none" }}>{title}</Link>;
};

const Navbar = (props) => {
  const dispatch = useDispatch();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    // toggle the prevState
    setMobileOpen((prevState) => !prevState);
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  const drawer = (
    <Box>
      <Stack direction={"column"}>
        <Box>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ position: "relative", top: "10px", left: "13px" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mt: "14px" }} />
        <Box>
          <List>
            {mobileNavItems.map(({ title, path }) => (
              <ListItem key={title}>
                <Link
                  sx={{ textDecoration: "none", color: "#171a1f" }}
                  href={path}
                >
                  <Typography>{title}</Typography>
                </Link>
              </ListItem>
            ))}
            <ListItem
              key='logout-button'
              onClick={handleLogout}
            >
              Logout
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Box>
  );
  const container = window !== undefined ? window().documents.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      {/* Normalise css */}
      <CssBaseline />
      <AppBar
        component={"nav"}
        position='static'
        sx={{
          backgroundColor: "white",
          color: "#8659d3",
          position: "relative",
        }}
      >
        <Toolbar>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {/* Show on sm and greater screen */}
            <Typography
              variant='h5'
              sx={{ fontWeight: 700 }}
            >
              TaskGenie
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", sm: "block" }, ml: "16px" }}>
            {/* Nav Items */}
            <Stack
              direction={"row"}
              gap={"1rem"}
            >
              {desktopNavItems.map(({ title, path }) => (
                <NavLink
                  key={title}
                  title={title}
                  path={path}
                />
              ))}
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "100%",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Navbar;
