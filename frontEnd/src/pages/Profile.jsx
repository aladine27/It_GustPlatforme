// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Container, Typography, Avatar, Paper, Grid, Divider, List, ListItem,
  ListItemIcon, ListItemText, CircularProgress, IconButton, Menu, MenuItem, Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  FetchUserProfile,
  updateUserAction,
  UpdatePasswordAction,
  clearError
} from '../redux/actions/userAction.js';
import { useTranslation } from 'react-i18next';
import EditProfileModal from '../components/profile/EditProfile';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const ProfileContainer = styled(Box)({
  backgroundColor: '#F3FAFF',
  padding: '40px 0',
  display: 'flex',
  alignItems: 'center',
  minHeight: '600px',
});

const ProfilePaper = styled(Paper)({
  padding: '56px 60px 56px 60px',
  borderRadius: '38px',
  backgroundColor: 'rgba(255, 255, 255, 0.97)',
  boxShadow: '0 16px 48px rgba(25, 118, 210, 0.12)',
  maxWidth: '1250px',
  minWidth: '1050px',
  width: '100%',
  margin: '0 auto',
  transition: 'box-shadow 0.2s',
  '@media (max-width:1100px)': {
    maxWidth: '99vw',
    minWidth: 'unset',
    padding: '32px 8px',
    borderRadius: '16px'
  },
});

const UserAvatar = styled(Avatar)({
  width: 150,
  height: 150,
  border: '6px solid #fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

axios.defaults.baseURL = 'http://localhost:3000';

export default function Profile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser, loading, error, errorMessage } = useSelector(state => state.user);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  // NEW: état du menu “Paramètres”
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);
  const handleOpenMenu = (e) => setMenuAnchor(e.currentTarget);
  const handleCloseMenu = () => setMenuAnchor(null);

  const userData = CurrentUser?.user ? CurrentUser.user : CurrentUser;

  useEffect(() => {
    dispatch(clearError());
    if (!userData) {
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const { token } = JSON.parse(raw);
          if (token?.accessToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
            dispatch(FetchUserProfile());
          }
        } catch (e) { console.error("Parsing user failed:", e); }
      }
    }
  }, [dispatch, userData]);

  const getAvatarSrc = () => {
    if (!userData?.image) return '';
    const raw = userData.image;
    if (raw.startsWith('http')) return `${raw}?t=${Date.now()}`;
    return `${axios.defaults.baseURL}/uploads/users/${encodeURIComponent(raw)}?t=${Date.now()}`;
  };
  const avatarSrc = getAvatarSrc();

  // EDIT
  const handleOpenEditModal = () => {
    if (!userData) return;
    setEditableUser({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      domain: userData.domain,
      image: userData.image,
      _id: userData._id,
    });
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditableUser(null);
  };
  const handleSaveChanges = () => {
    if (!editableUser?._id) return toast.error("ID utilisateur manquant.");
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const { token } = JSON.parse(raw);
        if (token?.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
        }
      } catch {}
    }
    dispatch(updateUserAction({ id: editableUser._id, userData: editableUser }))
      .unwrap()
      .then(() => dispatch(FetchUserProfile()).unwrap())
      .then(() => {
        toast.success("Profil mis à jour avec succès");
        handleCloseEditModal();
      })
      .catch(() => toast.error("Échec de la mise à jour du profil"));
  };

  // PASSWORD
  const handleSavePassword = (oldPassword, newPassword) => {
    if (!userData?._id) return toast.error("Utilisateur non authentifié");
    if (oldPassword === newPassword) return toast.error("Le nouveau mot de passe ne peut pas être le même que l'ancien");

    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const { token } = JSON.parse(raw);
        if (token?.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
        }
      } catch {}
    }
    dispatch(UpdatePasswordAction({ id: userData._id, oldPassword, newPassword }))
      .unwrap()
      .then(res => {
        toast.success(res.message || "Mot de passe mis à jour");
        setOpenPasswordModal(false);
      })
      .catch(errMsg => {
        if (errMsg.includes("Old password incorrect")) toast.error("L'ancien mot de passe est incorrect");
        else if (errMsg.includes("Password is required")) toast.error("Le mot de passe ne peut pas être vide");
        else if (errMsg.includes("same as the old password")) toast.error("Le nouveau mot de passe ne peut pas être identique à l'ancien");
        else toast.error(errMsg);
      });
  };

  if (loading && !userData && !openEditModal && !openPasswordModal) {
    return <ProfileContainer><CircularProgress /></ProfileContainer>;
  }
  if (!loading && error) {
    return (
      <ProfileContainer>
        <Typography color="error">
          Erreur: {errorMessage || 'Une erreur est survenue.'}
        </Typography>
      </ProfileContainer>
    );
  }
  if (!loading && !userData) {
    return (
      <ProfileContainer>
        <Typography>Aucun utilisateur connecté.</Typography>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Container>
        <ProfilePaper elevation={5}>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 1.2,
    }}
  >
    <UserAvatar src={avatarSrc} alt={userData.fullName} />

    <Box sx={{ textAlign: 'center', maxWidth: 280 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 'bold', lineHeight: 1.2, wordBreak: 'break-word' }}
      >
        {userData.fullName}
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mt: 0.2 }}
      >
        {userData.role}
      </Typography>
    </Box>
  </Box>
</Grid>

            <Grid item xs={12} md={8}>
              {/* Titre + Bouton Paramètres alignés sur la même ligne */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ color: '#6b48ff' }}>
                  {t('Informations Personnelles')}
                </Typography>

                <Tooltip title={t('Paramètres')}>
                  <IconButton
                    aria-label="settings"
                    aria-controls={menuOpen ? 'profile-settings-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    onClick={handleOpenMenu}
                    sx={{
                      bgcolor: '#e9f2ff',
                      '&:hover': { bgcolor: '#dbeafe' },
                      borderRadius: 2
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Menu déroulant Paramètres */}
              <Menu
                id="profile-settings-menu"
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => { handleCloseMenu(); handleOpenEditModal(); }}
                >
                  <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={t('Modifier Profil')} />
                </MenuItem>

                <MenuItem
                  onClick={() => { handleCloseMenu(); setOpenPasswordModal(true); }}
                >
                  <ListItemIcon><LockResetIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary={t('Modifier mot de passe')} />
                </MenuItem>
              </Menu>

              {/* Infos */}
              <List>
                {[
                  { icon: <EmailIcon />, label: t('Email'), value: userData.email },
                  { icon: <PhoneIcon />, label: t('Téléphone'), value: userData.phone },
                  { icon: <HomeIcon />, label: t('Adresse'), value: userData.address },
                  { icon: <WorkIcon />, label: t('Domaine'), value: userData.domain },
                ].map((item, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} secondary={item.value || 'Non renseigné'} />
                  </ListItem>
                ))}
              </List>

              {/* ⛔️ Boutons retirés (remplacés par le menu) */}
              {/* <ButtonComponent ... /> */}
            </Grid>
          </Grid>
        </ProfilePaper>
      </Container>

      {editableUser && (
        <EditProfileModal
          open={openEditModal}
          handleClose={handleCloseEditModal}
          userData={editableUser}
          setUserData={setEditableUser}
          onSave={handleSaveChanges}
        />
      )}

      {openPasswordModal && (
        <ChangePasswordModal
          open={openPasswordModal}
          handleClose={() => setOpenPasswordModal(false)}
          onSavePassword={handleSavePassword}
        />
      )}
    </ProfileContainer>
  );
}
