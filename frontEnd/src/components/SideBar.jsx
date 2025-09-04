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

  // 🎨 Couleurs
  const appBackground = '#f7f9fc';
  const sidebarBackground = '#eaf4ff';   // fond bleu clair
  const primaryBrandBlue = '#1890ff';
  const lightAccentBlue = '#d6ebff';
  const textLightGrey = '#444444';

  const menuItems = [
    { text: t("adminDashboard"), icon: <DashboardIcon/>, path:'/dashboard/adminDashboard', roles:['Admin'] },
    { text: t("Employe"),        icon: <Groups2Icon/>,   path:'/dashboard/employe',         roles:['Admin'] },
    { text: t("Evenement"),      icon: <EventIcon/>,     path:'/dashboard/evenement',       roles:['Admin','Manager','Rh','Employe'] },
    { text: t("Projet"),         icon: <AppRegistrationIcon/>, path:'/dashboard/projet',   roles:['Admin','Manager','Employe'] },
    { text: t("Document"),       icon: <ArticleIcon/>,   path:'/dashboard/document',        roles:['Admin','Manager','Rh','Employe'] },
    { text: t("Congé"),          icon: <EventAvailableIcon/>, path:'/dashboard/conge',     roles:['Admin','Manager','Rh','Employe'] },
    { text: t("Recrutement"),    icon: <WalletIcon/>,    path:'/dashboard/recrutement',     roles:['Admin','Rh'] },
    { text: t("Profil"),         icon: <PersonIcon/>,    path:'/dashboard/profile',         roles:['Admin','Manager','Rh','Employe'] },
  ];

  const filteredMenuItems = menuItems.filter((i)=> i.roles.includes(userRole));
  const SIDEBAR_WIDTH = collapsed ? 72 : 270;

  return (
    <Box sx={{ display:'flex', height:'100%', bgcolor: appBackground }}>
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          height: '100%',
          bgcolor: sidebarBackground,
          boxShadow: theme.shadows[2],
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          fontSize: "1.15rem"   // taille de base plus grande
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: collapsed ? 1 : 2,
            py: 1.25,
            minHeight: 56,
            flexShrink: 0,
            bgcolor: sidebarBackground,
            borderBottom: '1px solid #dbeafe'
          }}
        >
          {filteredMenuItems.length > 0 && (
            <Box
              component={NavLink}
              to={filteredMenuItems[0].path}
              sx={{
                display:'flex',
                alignItems:'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position:'relative',
                color: location.pathname.startsWith(filteredMenuItems[0].path) ? primaryBrandBlue : textLightGrey,
                pl: collapsed ? 0 : 1,
                pr: 1,
                textDecoration:'none',
                flexGrow: collapsed ? 0 : 1,
                '&::before': location.pathname.startsWith(filteredMenuItems[0].path) ? {
                  content:'""',
                  position:'absolute',
                  left:0,
                  top:'50%',
                  transform:'translateY(-50%)',
                  width:3,
                  height:'70%',
                  backgroundColor: primaryBrandBlue,
                  borderRadius:'0 3px 3px 0'
                } : {},
              }}
            >
              <ListItemIcon sx={{ minWidth:0, color:primaryBrandBlue, mr: collapsed ? 0 : 1 }}>
                {filteredMenuItems[0].icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={filteredMenuItems[0].text}
                  primaryTypographyProps={{ fontWeight:400, fontSize:"1rem", noWrap:true }}
                />
              )}
            </Box>
          )}
          <IconButton
            size="small"
            onClick={() => setCollapsed(c => !c)}
            sx={{
              width:32,
              height:32,
              color: primaryBrandBlue,
              bgcolor: lightAccentBlue,
              '&:hover': { bgcolor: primaryBrandBlue, color:'#fff' },
              borderRadius: 2
            }}
          >
            {collapsed ? <MenuIcon/> : <ChevronLeftIcon/>}
          </IconButton>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flexGrow:1, display:'flex', flexDirection:'column', overflow:'hidden', py: 0.5 }}>
          <List
            disablePadding
            sx={{
              px: 0.5,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: 0.8,  // espacement un peu plus large
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
                      borderRadius: 1.5,
                      minHeight: 46,
                      px: collapsed ? 0.5 : 1.5,
                      color: isActive ? primaryBrandBlue : textLightGrey,
                      bgcolor: isActive ? lightAccentBlue : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: lightAccentBlue,
                        color: primaryBrandBlue
                      },
                      '&::before': isActive ? {
                        content:'""',
                        position:'absolute',
                        left:0,
                        top:'50%',
                        transform:'translateY(-50%)',
                        width:3,
                        height:'70%',
                        backgroundColor: primaryBrandBlue,
                        borderRadius:'0 3px 3px 0'
                      } : {}
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 'auto' : 38,
                        color: isActive ? primaryBrandBlue : textLightGrey,
                        justifyContent: 'center',
                        mr: collapsed ? 0 : 1,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize:'1.1rem',
                          fontWeight:600,
                          noWrap:true
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

      {/* Zone principale */}
      <Box sx={{ flex:1, minHeight:'100%', bgcolor: appBackground }} />
    </Box>
  );
};

export default SidebarPro;
