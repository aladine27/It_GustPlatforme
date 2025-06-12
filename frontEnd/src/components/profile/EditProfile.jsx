import React, { useState, useEffect } from 'react';
import {
  CloseOutlined,
  Edit as EditIcon,
  PhotoCamera,
} from '@mui/icons-material';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Avatar,
  Button,
} from '@mui/material';
import ModelComponent from '../Global/ModelComponent'; // ajustez selon votre projet
import { ButtonComponent } from '../Global/ButtonComponent';

export default function EditProfileModal({
  open,
  handleClose,
  userData,
  setUserData,
  onSave,
}) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (open) {
      if (userData.image instanceof File) {
        setPreviewUrl(URL.createObjectURL(userData.image));
      } else {
        setPreviewUrl(userData.image || '');
      }
    }
    return () => {
      if (previewUrl && userData.image instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [open, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Modifier Profil"
      icon={<EditIcon />}
    >
      <Box sx={{ mt: 1, p: 1 }}>
        <Grid container spacing={2}>
          {/* Avatar + bouton photo */}
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 1 }}>
            <Avatar
              src={previewUrl}
              alt={userData.fullName || 'Avatar'}
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
              size="small"
              sx={{
                textTransform: 'none',
                fontSize: 13,
                borderRadius: 2,
                bgcolor: '#6b48ff',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#5a3dd3',
                },
              }}
            >
              Changer la photo
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Grid>

          {/* Champs texte en deux colonnes */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Nom Complet"
              name="fullName"
              value={userData.fullName || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              name="email"
              value={userData.email || ''}
              onChange={handleChange}
              variant="outlined"
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Téléphone"
              name="phone"
              value={userData.phone || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Adresse"
              name="address"
              value={userData.address || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Domaine"
              name="domain"
              value={userData.domain || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* Boutons */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 1,
            }}
          >
           
            <ButtonComponent
              text="Enregistrer"
              icon={<EditIcon />}
              onClick={onSave}
            />
          </Grid>
        </Grid>
      </Box>
    </ModelComponent>
  );
}
