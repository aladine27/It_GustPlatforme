import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box, Paper, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, useTheme, IconButton
} from '@mui/material';
import {
  DateTimePicker, LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AddCircle, Delete, Save, Close } from '@mui/icons-material';

const localizer = momentLocalizer(moment);

const Evenement = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Réunion',
      start: new Date(2023, 5, 12, 10, 0),
      end: new Date(2023, 5, 12, 11, 0),
    },
  ]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ start, end });
    setOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSave = (eventData) => {
    if (selectedEvent && selectedEvent.id) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...eventData } : e));
    } else {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
    handleClose();
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main" mb={2}>
          📅 Gestion des Événements
        </Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={{
            event: ({ event }) => (
              <Box
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  p: 0.5,
                  borderRadius: 1,
                  fontSize: '0.85rem',
                  textAlign: 'center'
                }}
              >
                {event.title}
              </Box>
            )
          }}
        />
      </Paper>

      {/* Formulaire modale */}
      <EventForm
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={handleDelete}
        event={selectedEvent}
      />
    </Box>
  );
};

const EventForm = ({ open, onClose, onSave, onDelete, event }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [start, setStart] = useState(event?.start || new Date());
  const [end, setEnd] = useState(event?.end || new Date());

  const handleSubmit = () => {
    if (title.trim()) {
      onSave({ title, start, end });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {event?.id ? 'Modifier un événement' : 'Ajouter un événement'}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Titre de l'événement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <DateTimePicker
            label="Date de début"
            value={start}
            onChange={(newStart) => setStart(newStart)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />

          <DateTimePicker
            label="Date de fin"
            value={end}
            onChange={(newEnd) => setEnd(newEnd)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {event?.id && (
            <Button
              onClick={() => onDelete(event.id)}
              color="error"
              startIcon={<Delete />}
              variant="outlined"
            >
              Supprimer
            </Button>
          )}
          <Button onClick={onClose} variant="text">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            startIcon={<Save />}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default Evenement;
