import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Groups2Icon from '@mui/icons-material/Groups2';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArticleIcon from '@mui/icons-material/Article';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import WalletIcon from '@mui/icons-material/Wallet';
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next"
function SideBar() {
  const { t } = useTranslation()

  const MenuItems = [
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
    <Box
    >
      <List>
  {MenuItems.map((item) => (
    <ListItem key={item.text}>
      <ListItemButton
        to={item.path}
        component={NavLink}
        sx={{
          color: '#227FBF',
          '&:hover': { color: '#1A9BC3' },
          '&.active': {
            color: '#808080', // Texte en gris quand actif
          },
          '&.active .MuiListItemIcon-root': {
            color: '#808080', // Icône en gris quand actif
          },
        }}
      >
        <ListItemIcon sx={{ color: '#227FBF', fontWeight: 'bold' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{ fontWeight: 'bold' }}
        />
      </ListItemButton>
    </ListItem>
  ))}
</List>
    </Box>
  );
}

export default SideBar;
