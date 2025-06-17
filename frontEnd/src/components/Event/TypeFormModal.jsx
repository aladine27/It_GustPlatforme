// src/components/events/TypeFormModal.jsx
import React from "react";
import { TextField, Stack } from "@mui/material";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function TypeFormModal({ open, onClose, value, onChange, onCreate }) {
  return (
    <ModelComponent
      open={open}
      handleClose={onClose}
      title="Créer un type d'événement"
      icon={<AddCircleOutlineIcon />}
    >
      <TextField
        value={value}
        onChange={e => onChange(e.target.value)}
        label="Nom du type"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <ButtonComponent onClick={onClose} text="Annuler" />
        <ButtonComponent onClick={onCreate} text="Créer" icon={<AddCircleOutlineIcon />} />
      </Stack>
    </ModelComponent>
  );
}
