import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';
const SIDEBAR_WIDTH = 300;
const NAVBAR_HEIGHT = 64;
function Dashboard() {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <Box sx={{ height: `${NAVBAR_HEIGHT}px`, width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1100 }}>
        <Navbar />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: `${NAVBAR_HEIGHT}px`, 
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: `${SIDEBAR_WIDTH}px`,
            minWidth: `${SIDEBAR_WIDTH}px`,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            bgcolor: '#F3FAFF',
            color: 'blue',
           
          }}
        >
          <SideBar />
        </Box>
 <Box
  sx={{
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    overflowY: 'auto',
    bgcolor: '#F3FAFF',
    p: 2,
  }}
>
  <Outlet />
</Box>
      </Box>
    </Box>
  );
}
export default Dashboard;