import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, LockReset as LockResetIcon } from '@mui/icons-material';
import ModelComponent from '../Global/ModelComponent';
import { ButtonComponent } from '../Global/ButtonComponent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  oldPassword: yup.string().required("L'ancien mot de passe est requis"),
  newPassword: yup.string().min(6,'Le mot de passe doit contenir au moins 6 caractères').required('Le nouveau mot de passe est requis'),
});

export default function ChangePasswordModal({ open, handleClose, onSavePassword }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const submit = data => onSavePassword(data.oldPassword, data.newPassword);

  return (
    <ModelComponent open={open} handleClose={()=>{reset();handleClose();}}
      title="Modifier le mot de passe" icon={<LockResetIcon />}>
      <Box component="form" onSubmit={handleSubmit(submit)} sx={{display:'flex',flexDirection:'column',gap:2,mt:2}}>
        <TextField label="Ancien mot de passe" type={showOld?'text':'password'} placeholder="••••••••"
          {...register('oldPassword')} error={!!errors.oldPassword} helperText={errors.oldPassword?.message} fullWidth
          InputProps={{ endAdornment:(<InputAdornment position="end"><IconButton onClick={()=>setShowOld(v=>!v)} edge="end">{showOld?<VisibilityOff/>:<Visibility/>}</IconButton></InputAdornment>) }} />
        <TextField label="Nouveau mot de passe" type={showNew?'text':'password'} placeholder="••••••••"
          {...register('newPassword')} error={!!errors.newPassword} helperText={errors.newPassword?.message} fullWidth
          InputProps={{ endAdornment:(<InputAdornment position="end"><IconButton onClick={()=>setShowNew(v=>!v)} edge="end">{showNew?<VisibilityOff/>:<Visibility/>}</IconButton></InputAdornment>) }} />
        <ButtonComponent text="Confirmer" type="submit" disabled={isSubmitting} />
      </Box>
    </ModelComponent>
  );
}
