import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import SidebarPro from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH_EXPANDED = 280;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const NAVBAR_HEIGHT = 64;

function Dashboard({ darkMode, onToggleDarkMode }) {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        bgcolor: theme.palette.background.default,
        overflow: 'hidden',
        width: '100vw',
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          height: `${NAVBAR_HEIGHT}px`,
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1100,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 2px 8px 0 rgba(25,118,210,0.07)',
        }}
      >
        <Navbar darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      </Box>
      {/* Layout principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          position: 'fixed', // <-- Force le layout à rester plein écran
          top: `${NAVBAR_HEIGHT}px`,
          left: 0,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          width: '100vw',
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            height: '100%',
            borderRight: `1.5px solid ${theme.palette.divider}`,
            zIndex: 1,
            transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
            bgcolor: theme.palette.background.default,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SidebarPro collapsed={collapsed} setCollapsed={setCollapsed} />
        </Box>
        {/* Main (outlet) */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            minHeight: '100%',
            maxHeight: '100%',
            p: 3,
            overflowY: 'auto',
            bgcolor: theme.palette.background.default,
            transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
