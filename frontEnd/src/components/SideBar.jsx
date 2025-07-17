import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Groups2Icon from '@mui/icons-material/Groups2';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArticleIcon from '@mui/icons-material/Article';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import WalletIcon from '@mui/icons-material/Wallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from "@mui/material";
import { useSelector } from "react-redux";
const SidebarPro = ({ collapsed, setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { CurrentUser } = useSelector((state) => state.user);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;
  const theme = useTheme();
  const sidebarBackground = '#ffffff';
  const primaryBrandBlue = '#1890ff';
  const lightAccentBlue = '#e6f7ff';
  const textDarkGrey = '#333333';
  const textLightGrey = '#666666';
  const menuItems = [
    {
      text: t("adminDashboard"),
      icon: <DashboardIcon />,
      path: '/dashboard/adminDashboard',
      roles: ['Admin']
    },
    {
      text: t("Employe"),
      icon: <Groups2Icon />,
      path: '/dashboard/employe',
      roles: ['Admin']
    },
    {
      text: t("Evenement"),
      icon: <EventIcon />,
      path: '/dashboard/evenement',
      roles: ['Admin', 'Manager', 'Rh', 'Employe']
    },
    {
      text: t("Projet"),
      icon: <AppRegistrationIcon />,
      path: '/dashboard/projet',
      roles: ['Admin', 'Manager', 'Employe']
    },
    {
      text: t("Tache"),
      icon: <CheckCircleIcon />,
      path: '/dashboard/tache',
      roles: ['Admin', 'Manager', 'Employe']
    },
    {
      text: t("Document"),
      icon: <ArticleIcon />,
      path: '/dashboard/document',
      roles: ['Admin', 'Manager', 'Rh', 'Employe']
    },
    {
      text: t("Congé"),
      icon: <EventAvailableIcon />,
      path: '/dashboard/conge',
      roles: ['Admin', 'Manager', 'Rh', 'Employe']
    },
    {
      text: t("Recrutement"),
      icon: <WalletIcon />,
      path: '/dashboard/recrutement',
      roles: ['Admin', 'Manager', 'Rh']
    },
    {
      text: t("Profil"),
      icon: <PersonIcon />,
      path: '/dashboard/profile',
      roles: ['Admin', 'Manager', 'Rh', 'Employe']
    },
  ];
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );
  const SIDEBAR_WIDTH = collapsed ? 72 : 270;
  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        background: sidebarBackground,
        boxShadow: theme.shadows[2],
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease, box-shadow 0.3s ease',
        overflowX: 'hidden',
      }}
    >
      {/* Header with first menu item at left and collapse button at right */}
 <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: collapsed ? 1 : 2.5,
    py: 2,
    minHeight: 64,
    flexShrink: 0,
    background: sidebarBackground,
  }}
>
  {/* À gauche : icône seule (collapsed) ou icône + texte */}
  {filteredMenuItems.length > 0 && (
    <Box
      component={NavLink}
      to={filteredMenuItems[0].path}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative',
        color: location.pathname.startsWith(filteredMenuItems[0].path)
          ? primaryBrandBlue
          : textLightGrey,
        pl: collapsed ? 0 : 2,
        pr: 1,
        textDecoration: 'none',
        flexGrow: collapsed ? 0 : 1, // ❗️ éviter que ça pousse l'IconButton
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&::before': location.pathname.startsWith(filteredMenuItems[0].path)
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: '70%',
              backgroundColor: primaryBrandBlue,
              borderRadius: '0 3px 3px 0',
            }
          : {},
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          color: primaryBrandBlue,
          mr: collapsed ? 0 : 1,
        }}
      >
        {filteredMenuItems[0].icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={filteredMenuItems[0].text}
          primaryTypographyProps={{
            fontWeight: 600,
            fontSize: "1rem",
            noWrap: true,
          }}
        />
      )}
    </Box>
  )}
  {/* Collapse/expand button */}
  <IconButton
    size="small"
    onClick={() => setCollapsed((c) => !c)}
    sx={{
       width: 29,
  height: 30,
  border:"none",
      color: primaryBrandBlue,
      bgcolor: lightAccentBlue,
      ml: collapsed ? 0 : 1, // un peu d'espace à gauche si non collapsed
      transition: "all 0.3s ease",
      "&:hover": {
        bgcolor: primaryBrandBlue,
        color: '#fff',
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[4],
      },
      borderRadius: theme.shape.borderRadius * 2,
    }}
  >
    {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
  </IconButton>
</Box>
      {/* Menu Items */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'hidden',
          overflowX: 'hidden',
          py: 1,
        }}
      >
        <List
          sx={{
            px: 1,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          {filteredMenuItems.slice(1).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    color: isActive ? primaryBrandBlue : textLightGrey,
                    backgroundColor: isActive ? lightAccentBlue : 'transparent',
                    fontWeight: isActive ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    position: 'relative',
                    transition: "all 0.25s ease-in-out",
                    '&:hover': {
                      backgroundColor: lightAccentBlue,
                      color: primaryBrandBlue,
                      transform: 'translateX(3px)',
                    },
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: '70%',
                      backgroundColor: primaryBrandBlue,
                      borderRadius: '0 3px 3px 0',
                    } : {}
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : 40,
                      color: isActive ? primaryBrandBlue : textLightGrey,
                      justifyContent: 'center',
                      mr: collapsed ? 0 : 1,
                      transition: 'margin 0.25s ease-in-out, color 0.25s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 'inherit',
                        fontSize: '0.9rem',
                        noWrap: true,
                        transition: 'opacity 0.2s ease-in-out',
                        opacity: collapsed ? 0 : 1,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};
export default SidebarPro;