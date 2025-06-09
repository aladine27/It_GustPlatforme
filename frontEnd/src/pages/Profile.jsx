import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';

import { ButtonComponent } from '../components/Global/ButtonComponent';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import EditProfileModal from '../components/profile/EditProfile';

// Données statiques de l'utilisateur
const userData = {
  fullName: 'Alice Dupont',
  email: 'alice.dupont@example.com',
  address: '456 Rue Principale, Paris',
  phone: '+33 06 12 34 56 78',
  domain: 'Développement Web',
  image: 'https://randomuser.me/api/portraits/women/65.jpg',
  role: 'Développeuse Front-End',
};

// Styles
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

export default function Profile() {
  const [openModal, setOpenModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableUserData, setEditableUserData] = useState({ ...userData });

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setOldPassword('');
    setNewPassword('');
  };

  const handleChangePassword = () => {
    console.log('Ancien mot de passe :', oldPassword);
    console.log('Nouveau mot de passe :', newPassword);
    handleClose();
  };

  const handleEditProfile = () => {
    setEditableUserData({ ...userData });
    setOpenEditModal(true);
  };

  const handleSaveProfile = () => {
    console.log('Données mises à jour :', editableUserData);
    setOpenEditModal(false);
  };

  return (
    <ProfileContainer>
      <Container>
        <ProfilePaper elevation={3}>
          <Grid container spacing={1}>
            {/* Avatar et nom */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <UserAvatar src={userData.image} alt="Profile" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Nom complet</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                    {userData.fullName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {userData.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Informations et boutons */}
            <Grid item xs={12} md={8}>
              <Box sx={{ pl: { md: 2 } }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#6b48ff' }}>
                  Informations
                </Typography>
                <Divider sx={{ my: 3 }} />

                <List>
                  <ListItem>
                    <ListItemIcon><EmailIcon sx={{ color: '#6b48ff' }} /></ListItemIcon>
                    <ListItemText primary="Email" secondary={userData.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon sx={{ color: '#6b48ff' }} /></ListItemIcon>
                    <ListItemText primary="Téléphone" secondary={userData.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><HomeIcon sx={{ color: '#6b48ff' }} /></ListItemIcon>
                    <ListItemText primary="Adresse" secondary={userData.address} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WorkIcon sx={{ color: '#6b48ff' }} /></ListItemIcon>
                    <ListItemText primary="Domaine" secondary={userData.domain} />
                  </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <ButtonComponent
                      text="Modifier Profil"
                      icon={<EditIcon />}
                      onClick={handleEditProfile}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ButtonComponent
                      text="Changer mot de passe"
                      icon={<LockResetIcon />}
                      onClick={handleOpen}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </ProfilePaper>

        <ChangePasswordModal
          open={openModal}
          handleClose={handleClose}
          oldPassword={oldPassword}
          newPassword={newPassword}
          setOldPassword={setOldPassword}
          setNewPassword={setNewPassword}
          onConfirm={handleChangePassword}
        />

        <EditProfileModal
          open={openEditModal}
          handleClose={() => setOpenEditModal(false)}
          userData={editableUserData}
          setUserData={setEditableUserData}
          onSave={handleSaveProfile}
        />
      </Container>
    </ProfileContainer>
  );
}