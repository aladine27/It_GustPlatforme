import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import SidebarPro from '../components/SideBar';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH = 280; // ou 300 selon ton style
const NAVBAR_HEIGHT = 64;

function Dashboard() {
  return (
    <Box sx={{ height: '100vh', bgcolor: '#F3FAFF', overflow: 'hidden' }}>
      {/* Navbar */}
      <Box
        sx={{
          height: `${NAVBAR_HEIGHT}px`,
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1100,
        }}
      >
        <Navbar />
      </Box>
      {/* Le vrai contenu en flex row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: `${NAVBAR_HEIGHT}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        {/* Sidebar */}
        <Box sx={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, height: '100%', bgcolor: 'transparent' }}>
          <SidebarPro />
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#F3FAFF' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
