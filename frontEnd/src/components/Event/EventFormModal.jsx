// src/components/events/EventFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Grid, TextField, Chip, Autocomplete, FormControl, InputLabel, Select, MenuItem, Stack
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CloseOutlined, DeleteOutline, SaveOutlined } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";

export default function EventFormModal({
  open, onClose, onSave, onDelete, event, eventTypes, employes, loadingEmployes
}) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.startDate ? new Date(event?.startDate) : new Date());
  const [duration, setDuration] = useState(event?.duration || '');
  const [location, setLocation] = useState(event?.location || '');
  const [status, setStatus] = useState(event?.status || 'Planifié');
  const [selectedTypes, setSelectedTypes] = useState(event?.types || []);
  const [invitedUsers, setInvitedUsers] = useState(event?.invited || []);

  useEffect(() => {
    if (open) {
      setTitle(event?.title || '');
      setDescription(event?.description || '');
      setStartDate(event?.startDate ? new Date(event?.startDate) : new Date());
      setDuration(event?.duration || '');
      setLocation(event?.location || '');
      setStatus(event?.status || 'Planifié');
      setSelectedTypes(event?.types || []);
      setInvitedUsers(event?.invited || []);
    }
  }, [open, event]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Le titre est requis');
      return;
    }
    if (!selectedTypes[0]?._id) {
      alert("Le type d’événement est requis");
      return;
    }
    const eventData = {
      id: event?.id || event?._id || undefined,
      title,
      description,
      startDate,
      duration,
      location,
      status,
      types: selectedTypes,
      invited: invitedUsers
    };
    onSave(eventData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ModelComponent
        open={open}
        handleClose={onClose}
        title={event?.id || event?._id ? 'Modifier un événement' : 'Ajouter un événement'}
        icon={<SaveOutlined />}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Titre"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Date de début"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Durée (ex: 1h, 90min)"
              fullWidth
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emplacement"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                label="Statut"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Planifié">Planifié</MenuItem>
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Terminé">Terminé</MenuItem>
                <MenuItem value="Annulé">Annulé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {/* Sélection d'un seul type */}
            <Autocomplete
              options={eventTypes || []}
              getOptionLabel={(option) => option.name}
              value={selectedTypes[0] || null}
              isOptionEqualToValue={(opt, val) => opt._id === val._id}
              onChange={(_, newValue) => setSelectedTypes(newValue ? [newValue] : [])}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Type d'événement"
                  placeholder="Sélectionner"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={employes || []}
              getOptionLabel={(option) => option.fullName}
              value={invitedUsers}
              isOptionEqualToValue={(opt, val) => opt._id === val._id}
              onChange={(_, newValue) => setInvitedUsers(newValue)}
              loading={loadingEmployes}
              renderTags={(value, getTagProps) =>
                value.map((user, index) => (
                  <Chip key={user._id} label={user.fullName} color="secondary" {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Inviter des employés"
                  placeholder="Rechercher un employé"
                />
              )}
            />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          {(event?.id || event?._id) && (
            <ButtonComponent
              onClick={() => onDelete(event.id || event._id)}
              text="Supprimer"
              icon={<DeleteOutline />}
              color="error"
            />
          )}
          <ButtonComponent
            onClick={onClose}
            text="Annuler"
            icon={<CloseOutlined />}
          />
          <ButtonComponent
            onClick={handleSubmit}
            text="Enregistrer"
            icon={<SaveOutlined />}
          />
        </Stack>
      </ModelComponent>
    </LocalizationProvider>
  );
}
