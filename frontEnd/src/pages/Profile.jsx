import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Container, Typography, Avatar, Paper, Grid, Divider,
  List, ListItem, ListItemIcon, ListItemText, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  FetchUserProfile,
  updateUserAction,
  clearError
} from '../redux/actions/userAction.js';

import { ButtonComponent } from '../components/Global/ButtonComponent';
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
  padding: '32px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  maxWidth: '900px',
  margin: '0 auto',
});
const UserAvatar = styled(Avatar)({
  width: 150,
  height: 150,
  border: '6px solid #fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

axios.defaults.baseURL = 'http://localhost:3000';

export default function Profile() {
  const dispatch = useDispatch();
  const { CurrentUser, loading, error, errorMessage } = useSelector(state => state.user);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const userData = CurrentUser?.user ? CurrentUser.user : CurrentUser;

  // Charger le profil et mettre le header Authorization
  useEffect(() => {
    // Avant de fetch, on efface une ancienne erreur éventuelle
    dispatch(clearError());
    if (!userData) {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        try {
          const parsedUser = JSON.parse(rawUser);
          const token = parsedUser?.token?.accessToken;
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            dispatch(FetchUserProfile());
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
    }
  }, [dispatch, userData]);

  const getAvatarSrc = () => {
    if (!userData?.image) return '';
    const raw = userData.image;
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return `${raw}?t=${Date.now()}`;
    }
    const base = axios.defaults.baseURL || window.location.origin;
    return `${base}/uploads/users/${encodeURIComponent(raw)}?t=${Date.now()}`;
  };
  const avatarSrc = getAvatarSrc();

  useEffect(() => {
    console.log("userData.image changé :", userData?.image, "=> avatarSrc:", avatarSrc);
  }, [userData?.image]);

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
    if (!editableUser?._id) {
      console.error("ID utilisateur manquant pour la mise à jour.");
      return;
    }
    // Réassigner header Authorization si besoin
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        const token = parsedUser?.token?.accessToken;
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch {}
    }
    dispatch(updateUserAction({ id: editableUser._id, userData: editableUser }))
      .unwrap()
      .then(() => {
        return dispatch(FetchUserProfile()).unwrap();
      })
      .then((fresh) => {
        console.log("Refetch terminé, nouvelle image:", fresh.data.image);
        toast.success("Profil mis à jour avec succès");
        handleCloseEditModal();
      })
      .catch((err) => {
        console.error("Erreur update ou fetch:", err);
        toast.error("Échec de la mise à jour du profil");
      });
  };

  // Condition loader : on affiche uniquement si loading true ET pas encore de userData
  if (loading && !userData && !openEditModal && !openPasswordModal) {
    return <ProfileContainer><CircularProgress /></ProfileContainer>;
  }

  // Si erreur après fetch
  if (!loading && error) {
    return (
      <ProfileContainer>
        <Typography color="error">
          Erreur: {errorMessage || 'Une erreur est survenue.'}
        </Typography>
      </ProfileContainer>
    );
  }

  // Si pas d’utilisateur après chargement (et pas d’erreur), message ou redirection
  if (!loading && !userData) {
    return (
      <ProfileContainer>
        <Typography>Aucun utilisateur connecté ou données non disponibles.</Typography>
      </ProfileContainer>
    );
  }

  // Sinon on a userData et loading est false : on affiche le profil
  return (
    <ProfileContainer>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
      <Container>
        <ProfilePaper elevation={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <UserAvatar src={avatarSrc} alt={userData.fullName} sx={{ margin: '0 auto 20px' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{userData.fullName}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{userData.role}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, color: '#6b48ff' }}>Informations Personnelles</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {[
                  { icon: <EmailIcon />, label: 'Email', value: userData.email },
                  { icon: <PhoneIcon />, label: 'Téléphone', value: userData.phone },
                  { icon: <HomeIcon />, label: 'Adresse', value: userData.address },
                  { icon: <WorkIcon />, label: 'Domaine', value: userData.domain }
                ].map((item, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.value || 'Non renseigné'}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 3 }} />
              <ButtonComponent
                text="Modifier Profil"
                icon={<EditIcon />}
                onClick={handleOpenEditModal}
              />
              <ButtonComponent
                text="Modifier mot de passe"
                icon={<LockResetIcon />}
                onClick={() => setOpenPasswordModal(true)}
                sx={{ mt: 2 }}
              />
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
      <ChangePasswordModal
        open={openPasswordModal}
        handleClose={() => setOpenPasswordModal(false)}
      />
    </ProfileContainer>
  );
}
