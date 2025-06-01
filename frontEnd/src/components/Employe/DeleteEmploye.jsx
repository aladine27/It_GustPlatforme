// DeleteEmploye.js
import React from 'react';
import { DeleteOutline, CloseOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import ModelComponent from '../Global/ModelComponent';
import { ButtonComponent } from '../Global/ButtonComponent';

const DeleteEmploye = ({ open, handleClose, handleConfirm, employeName }) => {
  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Confirmer la suppression"
      icon={<DeleteOutline />}
    >
      <Grid container direction="column" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Typography>Es-tu sûr de vouloir supprimer <strong>{employeName}</strong> ?</Typography>
        </Grid>
        <Grid item container justifyContent="center" spacing={2}>
          <Grid item>
            <ButtonComponent text="Annuler" onClick={handleClose} icon={<CloseOutlined />} />
          </Grid>
          <Grid item>
            <ButtonComponent text="Supprimer" onClick={handleConfirm} icon={<DeleteOutline />} />
          </Grid>
        </Grid>
      </Grid>
    </ModelComponent>
  );
};

export default DeleteEmploye;
