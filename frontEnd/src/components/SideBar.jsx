import React from "react";
import {
  Sidebar,
  Menu,
  Logo,
} from "react-mui-sidebar";
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
import { Box, Typography } from "@mui/material";

const SidebarPro = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { text: t("Employe"), icon: <Groups2Icon />, path: '/dashboard/employe' },
    { text: t("Evenement"), icon: <EventIcon />, path: '/dashboard/evenement' },
    { text: t("Projet"), icon: <AppRegistrationIcon />, path: '/dashboard/projet' },
    { text: t("Tache"), icon: <CheckCircleIcon />, path: '/dashboard/tache' },
    { text: t("Document"), icon: <ArticleIcon />, path: '/dashboard/document' },
    { text: t("Congé"), icon: <EventAvailableIcon />, path: '/dashboard/conge' },
    { text: t("Recrutement"), icon: <WalletIcon />, path: '/dashboard/recrutement' },
    { text: t("Frais"), icon: <WalletIcon />, path: '/dashboard/frais' },
    { text: t("Profil"), icon: <PersonIcon />, path: '/dashboard/profile' },
  ];

  return (
    <Sidebar width="270px" showProfile={false}>
    

      <Menu subHeading={t("")}>
        {menuItems.map((item) => {
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
                gap: 1,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: isActive ? '#1976d2' : '#333',
                backgroundColor: isActive ? '#E3F2FD' : 'transparent',
                fontWeight: isActive ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              {item.icon}
              <Typography fontWeight="inherit">{item.text}</Typography>
            </Box>
          );
        })}
      </Menu>
    </Sidebar>
  );
};

export default SidebarPro;
