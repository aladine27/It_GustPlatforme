import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Flag from 'react-world-flags';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutAction } from '../redux/actions/userAction';
import { Buttons } from './Global/ButtonComponent';
import logo from '../assets/logo.jpeg';
import { toast } from 'react-toastify';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  position: 'relative',
  textDecoration: 'none',
  color: '#227FBF',
  fontWeight: 500,
  margin: theme.spacing(0, 2),
  transition: 'color 0.3s',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -3,
    left: 0,
    height: 2,
    width: 0,
    background: '#ffeb3b',
    transition: 'width 0.3s',
  },
  '&:hover': {
    color: '#ffeb3b',
  },
  '&:hover::after': {
    width: '100%',
  },
  '&.active': {
    color: '#ffeb3b',
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state.user.CurrentUser);

  const navItems = ['Home', 'About', 'Contact', 'Nos Offres'];

  const handleDrawerToggle = () => setMobileOpen((o) => !o);
  const handleFlagClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await dispatch(LogoutAction()).unwrap();
      toast.success("Déconnexion réussie !");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(90deg,rgb(244, 245, 246) 0%,rgb(244, 245, 246) 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        px: 2,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Logo + menu */}
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: '#fff', display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "90px", height: "60px" }}
            />
          </Link>
        </Box>

        {/* Middle: nav links */}
        <Box sx={{ display: { xs: 'none', sm: 'flex', flex: 1 }, alignItems: 'center' }}>
          {navItems.map((item) => (
            <StyledNavLink key={item} to={`/${item.toLowerCase()}`}>
              {item}
            </StyledNavLink>
          ))}
        </Box>

        {/* Right: login/logout + langue */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
          {CurrentUser ? (
            <Box
              component="button"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#C62828",
                color: "#fff",
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 'bold',
                border: "none",
                cursor: "pointer",
                '&:hover': {
                  backgroundColor: "#b71c1c"
                }
              }}
            >
              {t("logout")}
            </Box>
          ) : (
            <Buttons to="/login" bgColor="#09759D">
              {t("login")}
            </Buttons>
          )}

          <IconButton
            onClick={handleFlagClick}
            sx={{ p: 0.5, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
          >
            <Flag
              code={selectedLanguage === 'fr' ? 'FR' : 'GB'}
              style={{ width: 28, height: 18, borderRadius: 3 }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
          >
            <MenuItem
              value="FR"
              onClick={() => handleLanguageChange({ target: { value: 'fr' } })}
            >
              🇫🇷 Français
            </MenuItem>
            <MenuItem
              value="EN"
              onClick={() => handleLanguageChange({ target: { value: 'en' } })}
            >
              🇬🇧 English
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
