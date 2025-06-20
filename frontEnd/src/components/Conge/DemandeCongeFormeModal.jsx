import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import { EventNote } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";

const leaveTypes = [
  { value: "Congé payé", label: "Congé payé" },
  { value: "Congé maladie", label: "Congé maladie" },
  { value: "RTT", label: "RTT" },
  { value: "Congé sans solde", label: "Congé sans solde" },
];

const DemandeCongeFormModal = ({ open, handleClose, onSubmit }) => {
  // Champs du formulaire
  const [form, setForm] = useState({
    title: "",
    Duration: "",
    startDate: "",
    endDate: "",
    reason: "",
    reasonfile: null,
  });

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Gestion de la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    // L’attribut status = "pending" par défaut
    const leaveRequest = {
      ...form,
      status: "pending",
    };
    // Tu peux faire un appel API ici ou utiliser le callback parent
    if (onSubmit) onSubmit(leaveRequest);
    handleClose();
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Demande de Congé"
      icon={<EventNote />}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Type de congé */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Type de congé</InputLabel>
              <Select
                label="Type de congé"
                name="title"
                value={form.title}
                onChange={handleChange}
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Date de début */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Date de début"
              type="date"
              name="startDate"
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={handleChange}
            />
          </Grid>
          {/* Date de fin */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Date de fin"
              type="date"
              name="endDate"
              InputLabelProps={{ shrink: true }}
              value={form.endDate}
              onChange={handleChange}
            />
          </Grid>
          {/* Durée (calculée ou manuelle) */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Durée (en jours)"
              name="Duration"
              value={form.Duration}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 1 }}
            />
          </Grid>
          {/* Raison */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              minRows={2}
              label="Motif"
              name="reason"
              value={form.reason}
              onChange={handleChange}
            />
          </Grid>
          {/* Fichier justificatif (optionnel) */}
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Joindre un justificatif
              <input
                type="file"
                name="reasonfile"
                hidden
                onChange={handleChange}
                accept=".pdf,.jpg,.png,.jpeg"
              />
            </Button>
            {form.reasonfile && (
              <Typography variant="caption" color="text.secondary">
                Fichier sélectionné : {form.reasonfile.name}
              </Typography>
            )}
          </Grid>
          {/* Bouton valider */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: 700, borderRadius: 3 }}
            >
              Envoyer la demande
            </Button>
          </Grid>
        </Grid>
      </form>
    </ModelComponent>
  );
};

export default DemandeCongeFormModal;
