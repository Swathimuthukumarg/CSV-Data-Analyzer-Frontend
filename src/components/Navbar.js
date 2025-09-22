// src/components/Navbar.js
import React from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);

  // --- Handle avatar menu ---
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // --- Tabs setup ---
  const tabRoutes = [
    "/dashboard/upload",
    "/dashboard/data-table",
    "/dashboard/charts",
  ];

  const currentTab = tabRoutes.find((route) =>
    location.pathname.startsWith(route)
  );

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Title (left) */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/dashboard/upload")}
        >
          CSV Data Analyzer
        </Typography>

        {/* Center Tabs */}
        <Tabs
          value={currentTab || false}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{ flexGrow: 1, ml: 5 }}
          centered
        >
          <Tab label="Upload CSV" value="/dashboard/upload" />
          <Tab label="Data Table" value="/dashboard/data-table" />
          <Tab label="Charts" value="/dashboard/charts" />
        </Tabs>

        {/* User avatar + menu (right) */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {user?.name || "Guest"}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar alt={user?.name} src={user?.picture} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
