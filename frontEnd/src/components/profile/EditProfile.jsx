import React, { useState, useEffect } from 'react';
import { CloseOutlined, Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Avatar,
  Button,
} from '@mui/material';
import ModelComponent from '../Global/ModelComponent'; // ajustez le chemin
import { ButtonComponent } from '../Global/ButtonComponent';

export default function EditProfileModal({ open, handleClose, userData, setUserData, onSave }) {
  // previewUrl sert à afficher l'avatar actuel ou la nouvelle image choisie
  const [previewUrl, setPreviewUrl] = useState('');

  // À chaque ouverture / changement de userData, on initialise la preview à l'URL existante
  useEffect(() => {
    if (open) {
      // userData.image peut être soit une URL (string), soit un File si déjà changé
      if (userData.image instanceof File) {
        setPreviewUrl(URL.createObjectURL(userData.image));
      } else {
        setPreviewUrl(userData.image || ''); // URL existante ou vide
      }
    }
    // Clean-up de l'URL.createObjectURL lors du démontage ou nouveau fichier
    return () => {
      if (previewUrl && userData.image instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [open, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Met à jour l'état parent avec le File
      setUserData(prev => ({
        ...prev,
        image: file,
      }));
      // Met à jour la preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Note : l'URL sera révoquée dans useEffect cleanup
    }
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Modifier Profil"
      icon={<EditIcon />}
    >
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {/* Prévisualisation de l'avatar */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Avatar
              src={previewUrl}
              alt={userData.fullName || 'Avatar'}
              sx={{ width: 80, height: 80, margin: '0 auto' }}
            />
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ textTransform: 'none' }}
              >
                Changer la photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
          </Grid>

          {/* Champs texte */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom Complet"
              name="fullName"
              value={userData.fullName || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Téléphone"
              name="phone"
              value={userData.phone || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              name="address"
              value={userData.address || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Domaine"
              name="domain"
              value={userData.domain || ''}
              onChange={handleChange}
            />
          </Grid>

          {/* Boutons Annuler / Enregistrer */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <ButtonComponent
              text="Annuler"
              icon={<CloseOutlined />}
              onClick={handleClose}
            />
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
