// components/profile/ChangePasswordModal.js
import React from 'react';
import { Box, TextField } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import ModelComponent from '../Global//ModelComponent';
import { ButtonComponent } from '../Global/ButtonComponent';

export default function ChangePasswordModal({
  open,
  handleClose,
  oldPassword,
  newPassword,
  setOldPassword,
  setNewPassword,
  onConfirm
}) {
  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Modifier le mot de passe"
      icon={<LockResetIcon />}
    >
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm();
        }}
      >
        <TextField
          label="Ancien mot de passe"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
        />
        <ButtonComponent text="Confirmer" onClick={onConfirm} />
      </Box>
    </ModelComponent>
  );
}
