// components/projet/CreateProjectModal.jsx
import React, { useState } from 'react';
import { AddOutlined, CloseOutlined } from '@mui/icons-material';
import { Grid, TextField, Typography } from '@mui/material';

import ModelComponent from '../Global/ModelComponent';
import { ButtonComponent } from '../Global/ButtonComponent';

const CreateProjectModal = ({ open, handleClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    if (title.trim() !== '') {
      onCreate({ title, description });
      setTitle('');
      setDescription('');
      handleClose();
    }
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Créer un nouveau projet"
      icon={<AddOutlined />}
    >
      <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
        <Grid >
          <Typography>Remplis les informations du nouveau projet :</Typography>
        </Grid>

        <Grid >
          <TextField
            fullWidth
            label="Titre du projet"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>

        <Grid >
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        <Grid  container justifyContent="center" spacing={2}>
          <Grid >
            <ButtonComponent text="Annuler" onClick={handleClose} icon={<CloseOutlined />} />
          </Grid>
          <Grid >
            <ButtonComponent text="Créer" onClick={handleConfirm} icon={<AddOutlined />} />
          </Grid>
        </Grid>
      </Grid>
    </ModelComponent>
  );
};

export default CreateProjectModal;
