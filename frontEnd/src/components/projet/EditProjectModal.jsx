// components/Global/EditProjectModal.jsx
import React, { useEffect, useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ModelComponent from '../Global//ModelComponent';

const EditProjectModal = ({ open, onClose, project, onSave }) => {
  const [editedProject, setEditedProject] = useState(project || {});

  useEffect(() => {
    setEditedProject(project || {});
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(editedProject);
    onClose();
  };

  return (
    <ModelComponent
      open={open}
      handleClose={onClose}
      title="Modifier le projet"
      icon={<EditOutlinedIcon />}
    >
      <Stack spacing={2}>
        <TextField
          label="Titre"
          name="title"
          fullWidth
          value={editedProject.title || ''}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          value={editedProject.description || ''}
          onChange={handleChange}
        />
        <TextField
          label="Durée"
          name="duration"
          fullWidth
          value={editedProject.duration || ''}
          onChange={handleChange}
        />
        <TextField
          label="Date début"
          name="start"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          value={editedProject.start || ''}
          onChange={handleChange}
        />
        <TextField
          label="Date fin"
          name="end"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          value={editedProject.end || ''}
          onChange={handleChange}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>
    </ModelComponent>
  );
};

export default EditProjectModal;
