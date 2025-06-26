import React, { useState } from "react";
import { Sidebar, Menu } from "react-mui-sidebar";
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
import { Box, Typography, IconButton, Divider } from "@mui/material";
import { useSelector } from "react-redux";

const SidebarPro = ({ collapsed, setCollapsed }) => {

  const { t } = useTranslation();
  const location = useLocation();
  const { CurrentUser } = useSelector((state) => state.user);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;

  const menuItems = [
    { text: t("adminDashboard"), icon: <DashboardIcon />, path: '/dashboard/adminDashboard', roles: ['Admin'] },
    { text: t("Employe"), icon: <Groups2Icon />, path: '/dashboard/employe', roles: ['Admin'] },
    { text: t("Evenement"), icon: <EventIcon />, path: '/dashboard/evenement', roles: ['Admin', 'Manager', 'Rh', 'Employe'] },
    { text: t("Projet"), icon: <AppRegistrationIcon />, path: '/dashboard/projet', roles: ['Admin', 'Manager', 'Employe'] },
    { text: t("Tache"), icon: <CheckCircleIcon />, path: '/dashboard/tache', roles: ['Admin', 'Manager', 'Employe'] },
    { text: t("Document"), icon: <ArticleIcon />, path: '/dashboard/document', roles: ['Admin', 'Manager', 'Rh', 'Employe'] },
    { text: t("Congé"), icon: <EventAvailableIcon />, path: '/dashboard/conge', roles: ['Admin', 'Manager', 'Rh', 'Employe'] },
    { text: t("Recrutement"), icon: <WalletIcon />, path: '/dashboard/recrutement', roles: ['Admin', 'Manager', 'Rh'] },
    { text: t("Frais"), icon: <WalletIcon />, path: '/dashboard/frais', roles: ['Admin', 'Manager', 'Rh', 'Employe'] },
    { text: t("Profil"), icon: <PersonIcon />, path: '/dashboard/profile', roles: ['Admin', 'Manager', 'Rh', 'Employe'] },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole));

  // Largeur dynamique en fonction de l'état collapsed
  const SIDEBAR_WIDTH = collapsed ? 72 : 270;

  return (
    <Sidebar width={`${SIDEBAR_WIDTH}px`} showProfile={false} style={{ padding: 0 ,display:"flex",flexDirection:"row"}}>
      {/* Header / Toggle button */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: 2,
        py: 2,
        minHeight: 64
        
      }}>
       
        <IconButton
          size="small"
          onClick={() => setCollapsed((c) => !c)}
          sx={{
            color: "primary.main",
            bgcolor: "#e3f2fd",
           
            transition: "all 0.2s",
            "&:hover": { bgcolor: "#bbdefb" }
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      <Menu subHeading={t("")}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Box
              key={item.text}
              component={NavLink}
              to={item.path}
              style={{ textDecoration: "none" }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 0 : 2,
                py: 1.5,
                borderRadius: 2,
                color: isActive ? '#1976d2' : '#333',
                backgroundColor: isActive ? '#E3F2FD' : 'transparent',
                fontWeight: isActive ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                transition: "all 0.2s"
              }}
            >
              {item.icon}
              {!collapsed && (
                <Typography fontWeight="inherit" sx={{ ml: 1 }}>
                  {item.text}
                </Typography>
              )}
            </Box>
          );
        })}
      </Menu>
    </Sidebar>
  );
};

export default SidebarPro;
