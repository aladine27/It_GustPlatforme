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
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme // Import useTheme to access the theme palette
} from "@mui/material";
import { useSelector } from "react-redux";

const SidebarPro = ({ collapsed, setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { CurrentUser } = useSelector((state) => state.user);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;
  const theme = useTheme(); // Access the default Material-UI theme

  // Refined color palette to match your application's light, professional aesthetic
  const sidebarBackground = '#ffffff'; // Clean white, matching the overall app's background
  const primaryBrandBlue = '#1890ff'; // The vibrant blue from your buttons/active states
  const lightAccentBlue = '#e6f7ff'; // Very light blue for subtle active/hover backgrounds
  const textDarkGrey = '#333333'; // Darker grey for standard text (more readable)
  const textLightGrey = '#666666'; // Slightly lighter grey for inactive text/secondary info
  const dividerColor = '#e0e0e0'; // Standard light grey for dividers

  // Définition des éléments du menu avec leurs rôles autorisés
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
      text: t("Frais"),
      icon: <WalletIcon />,
      path: '/dashboard/frais',
      roles: ['Admin', 'Manager', 'Rh', 'Employe']
    },
    {
      text: t("Profil"),
      icon: <PersonIcon />,
      path: '/dashboard/profile',
      roles: ['Admin', 'Manager', 'Rh', 'Employe']
    },
  ];

  // Filtrage des éléments du menu selon le rôle de l'utilisateur
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  // Largeur dynamique du sidebar selon l'état collapsed
  const SIDEBAR_WIDTH = collapsed ? 72 : 270;

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%', // Fills the height of its parent (Dashboard's main layout box)
        background: sidebarBackground,
        boxShadow: theme.shadows[2],
        display: 'flex',
        flexDirection: 'column',
        // Removed fixed positioning and zIndex, as Dashboard component manages overall layout
        transition: 'width 0.3s ease, box-shadow 0.3s ease',
        overflowX: 'hidden', // Still hide horizontal overflow during collapse/expand
      }}
    >
      {/* Header with toggle button and optional logo/title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 1 : 2.5,
          py: 2,
          minHeight: 64, // Keep a fixed min height for the header
          borderBottom: `1px solid ${dividerColor}`,
          flexShrink: 0, // Prevent header from shrinking
          background: sidebarBackground,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              color: primaryBrandBlue, // Vibrant blue for the title
              fontWeight: 700,
              letterSpacing: '0.03em', // Slightly less spacing for elegance
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ITGUST
          </Typography>
        )}
        <IconButton
          size="medium"
          onClick={() => setCollapsed((c) => !c)}
          sx={{
            color: primaryBrandBlue, // Icon in brand blue
            bgcolor: lightAccentBlue, // Light blue background for the button
            transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
            "&:hover": {
              bgcolor: primaryBrandBlue, // Brand blue on hover
              color: '#fff', // White text/icon on blue hover
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[4], // More subtle shadow on hover
            },
            borderRadius: theme.shape.borderRadius * 2,
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Separator */}
      <Divider sx={{ borderColor: dividerColor }} />

      {/* Container for the menu - Now with flexGrow and no scroll by default */}
      <Box
        sx={{
          flexGrow: 1, // Allows this Box to take up all available space
          display: 'flex',
          flexDirection: 'column', // Essential for aligning list items vertically
          overflowY: 'hidden', // Hide scrollbar if items exceed space
          overflowX: 'hidden',
          py: 1, // Add some vertical padding
        }}
      >
        {/* List of menu items - flexGrow ensures items distribute evenly */}
        <List
          sx={{
            px: 1,
            flexGrow: 1, // Allows the List to fill the available height
            display: 'flex',
            flexDirection: 'column', // Stacks items vertically
            justifyContent: 'space-around', // Distributes space evenly between items
            // Removed scrollbar styles as scrolling is no longer desired for this section
          }}
        >
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  // No mb: 0.8 here, as justifyContent: 'space-around' handles spacing
                }}
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    color: isActive ? primaryBrandBlue : textLightGrey, // Active blue, inactive light grey
                    backgroundColor: isActive ? lightAccentBlue : 'transparent', // Light blue background for active
                    fontWeight: isActive ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
                    minHeight: 48, // Maintain a minimum height for each button for good touch targets
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    position: 'relative',
                    transition: "all 0.25s ease-in-out",
                    '&:hover': {
                      backgroundColor: lightAccentBlue, // Light blue background on hover for all
                      color: primaryBrandBlue, // Brand blue text on hover for all
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
                      backgroundColor: primaryBrandBlue, // Brand blue indicator
                      borderRadius: '0 3px 3px 0',
                    } : {}
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : 40,
                      color: isActive ? primaryBrandBlue : textLightGrey, // Active blue icon, inactive light grey icon
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