import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import Groups2Icon from '@mui/icons-material/Groups2';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArticleIcon from '@mui/icons-material/Article';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import WalletIcon from '@mui/icons-material/Wallet';
import WorkIcon from '@mui/icons-material/Work';
import { NavLink } from "react-router-dom";
import Navbar from './Navbar';
function SideBar() {
    const MenuItems= [
        { text: 'Employe', icon: <Groups2Icon />,path: '/employe' },
        { text: 'Evenement', icon: <EventIcon />,path: '/evenement' },
        { text: 'Projet', icon: <AppRegistrationIcon/>,path: '/projet' },
        { text: 'Tache', icon: <CheckCircleIcon/>,path: '/tache' },
        { text: 'Document', icon: <ArticleIcon/>,path: '/document' },
        { text: 'Congé', icon: <EventAvailableIcon/>,path: '/conge' },
        { text: 'Recrutement', icon:<WalletIcon/>,path: '/recrutement' },
        { text: 'frais', icon: <WalletIcon/>,path: '/frais' },
        { text: 'profile', icon: <PersonIcon/>,path: '/profile' },
    ]
    //const VisibleMenuItems = MenuItems.filter((item) => 

  return (
    <>
    <Box padding={1}  style={{ width: 300, backgroundColor: 'red', height: '100vh',position: 'fixed' }}>
    <List>
        {MenuItems.map((Item) => (
            <ListItem key = {Item.text}  >
                <ListItemButton to ={Item.path} component={NavLink}>
                    <ListItemIcon >
                        {Item.icon}
                    </ListItemIcon>
                <ListItemText primary={Item.text} />
                </ListItemButton>
            </ListItem>        
        ),)} 
    </List>
    </Box>
      
    </>
  )
}

export default SideBar
