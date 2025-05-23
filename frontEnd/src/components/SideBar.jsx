import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

function SideBar() {
  return (
    <>
    <Box padding={2}  sx={{ width: 250, backgroundColor: '#f0f0f0', height: '100vh',position: 'fixed' }}>
    <List>
        <ListItem >
            <ListItemButton/>
            <ListItemIcon/>
            <ListItemText primary="Dashboard"  />
        </ListItem>
        <ListItem >
        <ListItemButton/>   
            <ListItemText primary="Profile"  />
        </ListItem>
        <ListItem >
            <ListItemText primary="Settings" />
        </ListItem>
        <ListItem >
            <ListItemText primary="Logout" />
        </ListItem>
    </List>

    </Box>
      
    </>
  )
}

export default SideBar
