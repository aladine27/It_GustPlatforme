import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Badge,
  Avatar, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Flag from 'react-world-flags';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutAction } from '../redux/actions/userAction';
import { Buttons } from './Global/ButtonComponent';
import logo from '../assets/logo.jpeg';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import io from 'socket.io-client';
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
    background: '#451991ff',
    transition: 'width 0.3s',
  },
  '&:hover': { color: '#451991ff' },
  '&:hover::after': { width: '100%' },
  '&.active': { color: '#451991ff' },
}));

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state.user.CurrentUser);

  
  const userImage   = CurrentUser?.image   || CurrentUser?.user?.image;
  const userFullName= CurrentUser?.fullName|| CurrentUser?.user?.fullName;
  const userEmail   = CurrentUser?.email   || CurrentUser?.user?.email;
  const userRole    = CurrentUser?.role    || CurrentUser?.user?.role;
  const userId      = CurrentUser?._id    || CurrentUser?.user?._id;

  // Séparation des états des menus
  const [userMenu, setUserMenu] = useState(null);
  const [langMenu, setLangMenu] = useState(null);
  const [unReadNotifications,setUnReadNotifications]=useState(0);
  const [viewNotifications,setViewNotifications]=useState(false);
  

  const navItems = ['Home', 'About', 'Contact', 'Offres'];

  const handleDrawerToggle = () => setMobileOpen((o) => !o);

  // Menu utilisateur
  const handleUserClick = (event) => setUserMenu(event.currentTarget);
  const handleUserClose = () => setUserMenu(null);

  // Menu langue
  const handleFlagClick = (e) => setLangMenu(e.currentTarget);
  const handleFlagClose = () => setLangMenu(null);
  const [notifications,setNotifications]=useState([]);
  const [socket,setSocket]=useState(null);
  

  // Changement de langue
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    handleFlagClose();
  };

  // Déconnexion
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
 useEffect(() => {
  const token = localStorage.getItem("token");

  const newSocket = io("http://localhost:3000", {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    //reconnectionDelay: 1000,
    //reconnectionAttempts: Infinity,
  });
  setSocket(newSocket);
 if (userId) {
  newSocket.emit("register", { userId }); // ✅ envoyer un objet
}

  return () => {
    newSocket.disconnect();
  };
}, [userId]);
useEffect(() => {            
  let aborted = false;
  (async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/notification/getUserNotifByUserId/${userId}`,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!aborted) {
        setNotifications(Array.isArray(data) ? data : []);
        setUnReadNotifications((Array.isArray(data) ? data : []).filter(n => !n.status).length);
        console.log("all notification", data);
      }
    } catch (error) {
      if (!aborted) console.error("Erreur lors de la récupération des notifications", error);
    }
  })();
  return () => { aborted = true; };
}, [userId]);

useEffect(() => {
  if (!socket || !userId) return;
  const handleNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnReadNotifications((prev) => prev + 1);
    console.log(" Nouvelle notification :", notification);
  };
  socket.on("newNotification", handleNotification);
  return () => {
    socket.off("newNotification", handleNotification);
  };
}, [socket, userId]);

const handleOpenNotification = async (event) => {

  setViewNotifications(event.currentTarget);
  setUnReadNotifications(0);
  try {
    const token = localStorage.getItem("token");
    const Response = await fetch(`http://localhost:3000/notification/marqueAsRead/${userId}`,
      {
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}` },
      },
    );

    if(Response.ok){
      const data = await Response.json();
      console.log(data);
    }else{
      console.log("error");
    }
  
    
  } catch (error) {
    console.error(" Erreur lors de la récupération des notifications ",error);
  }

}
const handleCloseNotification = () => {
  setViewNotifications(false);
 
}







  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(90deg,rgb(244, 245, 246) 0%,rgb(244, 245, 246) 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        px: 2,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <img src={logo} alt="Logo" style={{ width: "90px", height: "60px" }} />
          </Link>
        </Box>

        {/* Middle: nav links */}
        <Box sx={{ display: { xs: 'none', sm: 'flex', flex: 1 }, alignItems: 'center' }}>
          {!CurrentUser &&
            navItems.map((item) => (
              <StyledNavLink key={item} to={`/${item.toLowerCase()}`}>
                {item}
              </StyledNavLink>
            ))
          }
        </Box>
        
        {/* Right: login/logout + langue */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
          {CurrentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleOpenNotification} >
                <Badge color="error" badgeContent={unReadNotifications}>
                  <NotificationsIcon sx={{ color: '#227FBF' }} />
                </Badge>
              </IconButton>
              <Menu
  anchorEl={viewNotifications}
  open={Boolean(viewNotifications)}
  onClose={handleCloseNotification}
   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
   transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  PaperProps={{
    sx: {
      borderRadius: 1.5,
      minWidth: 280,
      maxHeight: 340,
      boxShadow: '0 6px 20px rgba(25,118,210,0.12)',
      backgroundColor: 'background.paper',
      border: '1px solid #e3f2fd',
      p: 0,
    },
  }}
>
  <Box
  sx={{
    maxHeight: 320,
    overflowY: 'auto',
    pr: 0.5,
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: (theme) => `${theme.palette.primary.main} transparent`,
    '&::-webkit-scrollbar': { width: 8 }, // Chrome/Edge
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: (theme) => theme.palette.primary.main,
      borderRadius: 8,
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: (theme) => theme.palette.primary.dark,
    },
    '&::-webkit-scrollbar-corner': { background: 'transparent' },
  }}
>

    {(notifications?.length || 0) > 0 ? (
      notifications
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((n) => (
          <MenuItem
            key={n._id}
            dense
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 1,
              px: 1.8,
              borderBottom: '1px solid #e3f2fd',
              '&:hover': {
                backgroundColor: '#f4f8fd',
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                fontSize: '0.9rem',
                mb: 0.3,
              }}
            >
              {n.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.82rem',
                lineHeight: 1.2,
                mb: 0.2,
              }}
            >
              {n.message}
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: '0.75rem' }}
            >
              {new Date(n.createdAt).toLocaleString()}
            </Typography>
          </MenuItem>
        ))
    ) : (
      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: '0.9rem',
        }}
      >
        Aucune notification
      </Box>
    )}
  </Box>
</Menu>


              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 0.7,
                  bgcolor: '#F3FAFF',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(34,127,191,0.07)',
                  gap: 1.3,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, background 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(34,127,191,0.15)',
                    bgcolor: '#e9f4fb',
                  },
                  ml: 2,
                  minWidth: 140,
                }}
                onClick={handleUserClick}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    border: '2px solid #227FBF',
                    bgcolor: '#eaf6fb',
                  }}
                  src={
                    userImage
                      ? `http://localhost:3000/uploads/users/${encodeURIComponent(userImage)}?t=${Date.now()}`
                      : undefined
                  }
                />
                {/* Bloc nom et rôle en colonne */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: '#1976d2',
                      fontWeight: 700,
                      fontSize: '1.12rem',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      
                    }}
                  >
                    {userFullName}
                  </Typography>
                  {userRole && (
                    <Typography
                      sx={{
                        color: '#227FBF',
                        fontWeight: 500,
                        fontSize: '0.97rem',
                        lineHeight: 1.1,
                        mt: '1px',
                        letterSpacing: 0.3,
                        textTransform: 'capitalize',
                      }}
                    >
                      {userRole}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#227FBF">
                    <path d="M5.5 8l4.5 4.5L14.5 8" stroke="#227FBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
              </Box>

              {/* Menu déroulant User */}
              <Menu
                anchorEl={userMenu}
                open={Boolean(userMenu)}
                onClose={handleUserClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    minWidth: 220,
                    boxShadow: '0 6px 24px rgba(34,127,191,0.10)',
                    mt: 1,
                  },
                }}
              >
                {/* Header du menu (avatar + nom + email) */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 2,
                  px: 2,
                  bgcolor: '#f5faff',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottom: '1px solid #E0E7EF',
                  mb: 1
                }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      mb: 1,
                      bgcolor: '#eaf6fb',
                      border: '2px solid #227FBF',
                    }}
                    src={
                      userImage
                        ? `http://localhost:3000/uploads/users/${encodeURIComponent(userImage)}?t=${Date.now()}`
                        : undefined
                    }
                  />
                  <Typography sx={{ fontWeight: 700, color: '#1976d2', fontSize: '1.07rem', mb: 0.2 }}>
                    {userFullName}
                  </Typography>
                  {userEmail && (
                    <Typography sx={{ color: '#608AB3', fontSize: '0.93rem' }}>
                      {userEmail}
                    </Typography>
                  )}
                </Box>
                {/* Bouton Profil */}
                <MenuItem
                  onClick={() => {
                    handleUserClose();
                    window.location.href = "profile";
                  }}
                  sx={{
                    color: '#1976d2',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    gap: 1.2,
                    borderRadius: 2,
                    my: 0.2,
                    '&:hover': {
                      bgcolor: '#eaf6fb',
                      color: '#094466',
                    },
                    fontSize: '0.97rem'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 20, color: 'inherit', mr: 1 }} />
                  {t('Mon Profil')}
                </MenuItem>
                {/* Bouton Déconnexion */}
                <MenuItem
                  onClick={() => {
                    handleUserClose();
                    handleLogout();
                  }}
                  sx={{
                    color: '#1976d2',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    gap: 1.2,
                    borderRadius: 2,
                    my: 0,
                    '&:hover': {
                      bgcolor: '#f5faff',
                      color: '#094466',
                    },
                    fontSize: '0.97rem'
                  }}
                >
                  <LogoutIcon sx={{ fontSize: 20, color: 'inherit', mr: 1 }} />
                  {t('Déconnexion')}
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Buttons to="/login" bgColor="#09759D">
              {t("login")}
            </Buttons>
          )}

          {/* ==== Bouton langue ==== */}
          <IconButton
            onClick={handleFlagClick}
            sx={{ p: 0.5, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
          >
            <Flag
              code={selectedLanguage === 'fr' ? 'FR' : 'GB'}
              style={{ width: 28, height: 18, borderRadius: 3 }}
            />
          </IconButton>
          {/* ==== Menu langue ==== */}
          <Menu
            anchorEl={langMenu}
            open={Boolean(langMenu)}
            onClose={handleFlagClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleLanguageChange('fr')}>
              <Flag code="FR" style={{ width: 26, marginRight: 10 }} />
              Français
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')}>
              <Flag code="GB" style={{ width: 26, marginRight: 10 }} />
              English
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
