import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import SidebarPro from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH_EXPANDED = 280;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const NAVBAR_HEIGHT = 64;

function Dashboard() {
  const theme = useTheme();
  // Sidebar collapsed state (partagé entre Dashboard et SidebarPro)
  const [collapsed, setCollapsed] = useState(false);

  // largeur de la sidebar selon l’état collapsed
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <Box sx={{ height: '100vh', bgcolor: theme.palette.background.default, overflow: 'hidden' }}>
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
          boxShadow: '0 2px 8px 0 rgba(25,118,210,0.07)'
        }}
      >
        <Navbar />
      </Box>
      {/* Layout principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: `${NAVBAR_HEIGHT}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            height: '100%',
            bgcolor: theme.palette.background.paper,
            boxShadow: '2px 0 14px 0 rgba(25,118,210,0.08)',
            borderRight: `1.5px solid ${theme.palette.divider}`,
            zIndex: 1,
            transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
            // Permet le smooth resize
          }}
        >
          <SidebarPro collapsed={collapsed} setCollapsed={setCollapsed} />
        </Box>
        {/* Main (outlet) */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: 'auto',
            bgcolor: theme.palette.background.default,
            minHeight: 0,
            transition: "all 0.22s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
