import * as React from 'react'
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';
import { NavLink } from 'react-router-dom';
const Navbar = () => {
    const drawerWidth = 240;
    const navItems = ['Home', 'About', 'Contact'];
    //management of the state
    const [open, setOpen] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('I18next');
    const [anchorEl,setAnchorEl] = useState(null);
    const [t,i18n]= useTranslation();
    

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      };
      const handleClose = (event) => {
        setAnchorEl(null);
      };
    
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
      };
    const handleLanguageChange = (event) => { 
      const newLanguage=event.target.value 
        setSelectedLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
      handleClose();
      }
      const getFlagIcon = (language) => {
        switch (language) {
          case 'En':
            return '🇬🇧';
          case 'FR':
            return '🇫🇷';
          default:
            return '🏳️';
        }
      };
      
    


  return (
    <>
     <Box sx={{ display: 'flex' }}>
     <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
      
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Gust
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            
            ))}
          
        
          </Box>
          <Box>
          <NavLink to="/login">
              <Button color='red' >
                    se connecter
              </Button>
          </NavLink>
        
          <IconButton onClick={handleClick}>
          <Flag code={selectedLanguage === 'FR' ? 'FR' : 'GB'} style={{ width: 24, height: 16 }} />
          </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem value="FR" onClick={() => handleLanguageChange({target:{value:'FR'}})}>Français</MenuItem>
              <MenuItem  value="EN" onClick={() => handleLanguageChange({target:{value:'En'}})}>Anglais</MenuItem>
            </Menu>

          </Box>
        
        </Toolbar>
      </AppBar>

     </Box> 


    </>
  )
}

export default Navbar
