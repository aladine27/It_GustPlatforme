import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Divider,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';

import { ButtonComponent } from '../components/Global/ButtonComponent'; // Remplace par le bon chemin
import ModelComponent from '../components/Global/ModelComponent'; // Remplace par le bon chemin
import EditProfileModal from '../components/profile/EditProfile';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

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
  minHeight: '100vh',
  backgroundColor: '#f5f5f5', // ou '#fff'
  padding: '40px 0',
  display: 'flex',
  alignItems: 'center',
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

const InfoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 0',
  '& svg': {
    marginRight: '16px',
    color: '#6b48ff',
  },
});

const ActionButton = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  marginTop: '16px',
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
    // 🔐 TODO: Appel à l'API pour changer le mot de passe ici
    handleClose();
  };
  const handleEditProfile = () => {
    setEditableUserData({ ...userData });
    setOpenEditModal(true);
  };
  
  const handleSaveProfile = () => {
    console.log('Données mises à jour :', editableUserData);
    // ✅ TODO: envoyer editableUserData à l'API pour mise à jour réelle
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
                <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: '#6b48ff' }}>
                    Informations
                  </Typography>
                  <InfoBox>
                      <EmailIcon />
                      <Typography variant="body1">{userData.email}</Typography>
                  </InfoBox>
                  <InfoBox>
                      <PhoneIcon />
                      <Typography variant="body1">{userData.phone}</Typography>
                  </InfoBox>
                  <InfoBox>
                      <HomeIcon />
                      <Typography variant="body1">{userData.address}</Typography>
                  </InfoBox>
                  <InfoBox>
                      <WorkIcon />
                      <Typography variant="body1">{userData.domain}</Typography>
                  </InfoBox>
                <Divider sx={{ my: 3 }} />
                <ActionButton>
                <ButtonComponent
                   text="Modifier Profil"
                  icon={<EditIcon />}
                  onClick={handleEditProfile}
                />

                  <ButtonComponent
                    text="Déconnexion"
                    icon={<LogoutIcon />}
                    onClick={() => alert('Déconnexion')}
                  />
                  <ButtonComponent
                    text="Changer mot de passe"
                    icon={<LockResetIcon />}
                    onClick={handleOpen}
                  />
                </ActionButton>
              </Box>
            </Grid>
          </Grid>
        </ProfilePaper>
        {/* MODAL DE CHANGEMENT DE MOT DE PASSE */}
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
