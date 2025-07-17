// components/projet/DeleteProjectModal.jsx
import React from 'react';
import { DeleteOutline, CloseOutlined } from '@mui/icons-material';
import { Grid, Typography, Box } from '@mui/material';
import CustomDeleteForm from '../Global/CustomDeleteForm';
import { ButtonComponent } from '../Global/ButtonComponent';

const DeleteProjectModal = ({ open, handleClose, onDelete, project }) => {
  const handleConfirm = () => {
    onDelete(project);
    handleClose();
  };

  return (
    <CustomDeleteForm
      open={open}
      handleClose={handleClose}
      title={
        <>
          Es-tu sûr de vouloir supprimer le projet&nbsp;
          <strong>{project?.title}</strong> ?
        </>
      }
      icon={<DeleteOutline sx={{ fontSize: 42 }} color="error" />}
    >
      <Box textAlign="center" mt={2}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <ButtonComponent
              text="Annuler"
              onClick={handleClose}
              icon={<CloseOutlined />}
            />
          </Grid>
          <Grid item>
            <ButtonComponent
              text="Supprimer"
              color="error"
              onClick={handleConfirm}
              icon={<DeleteOutline />}
            />
          </Grid>
        </Grid>
      </Box>
    </CustomDeleteForm>
  );
};

export default DeleteProjectModal;
