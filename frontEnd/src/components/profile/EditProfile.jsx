// components/Global/EditProfileModal.js
import React from 'react';
import { Box, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ModelComponent from '../Global//ModelComponent';
import { ButtonComponent } from '../Global/ButtonComponent';

export default function EditProfileModal({
  open,
  handleClose,
  userData,
  setUserData,
  onSave
}) {
  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Modifier le profil"
      icon={<EditIcon />}
    >
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <TextField
          label="Nom complet"
          value={userData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={userData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
        />
        <TextField
          label="Téléphone"
          value={userData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          fullWidth
        />
        <TextField
          label="Adresse"
          value={userData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          fullWidth
        />
        <TextField
          label="Domaine"
          value={userData.domain}
          onChange={(e) => handleChange('domain', e.target.value)}
          fullWidth
        />
        <ButtonComponent text="Enregistrer" onClick={onSave} />
      </Box>
    </ModelComponent>
  );
}
