// Evenement.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box, Paper, Typography, IconButton, TextField, Button, Grid,
  Chip, FormControl, InputLabel, Select, MenuItem, Stack, Autocomplete, Divider
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DeleteOutline, SaveOutlined, CloseOutlined } from '@mui/icons-material';
import { ButtonComponent } from '../components/Global/ButtonComponent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTranslation } from 'react-i18next';
import useMomentLocale from '../../src/useMomentLocal.js';
const localizer = momentLocalizer(moment);
import '../components/Event/calendrier.css';
import CustomToolbar from '../components/Event/CustomToolbar';

const MOCK_TYPES = [
  { id: 1, name: 'Formation' },
  { id: 2, name: 'Réunion' },
  { id: 3, name: 'Webinar' },
  { id: 4, name: 'Événement social' }
];

const MOCK_USERS = [
  { id: 1, fullName: 'Ahmed Bennani', email: 'ahmed.bennani@gmail.com' },
  { id: 2, fullName: 'Fatima Alaoui', email: 'fatima.alaoui@gmail.com' },
  { id: 3, fullName: 'Youssef Elami', email: 'youssef.elami@exemple.com' },
  { id: 4, fullName: 'Sara Idrissi', email: 'sara.idrissi@exemple.com' }
];


export default function Evenement() {

  const { t, i18n } = useTranslation(); 

  const calendarMessages = {
    date: t('date'),
    time: t('time'),
    event: t('event'),
    allDay: t('allDay'),
    week: t('week'),
    work_week: t('work_week'),
    day: t('day'),
    month: t('month'),
    previous: t('previous'),
    next: t('next'),
    yesterday: t('yesterday'),
    tomorrow: t('tomorrow'),
    today: t('today'),
    agenda: t('agenda'),
    noEventsInRange: t('noEventsInRange')
  };
  useMomentLocale(t);
  const today = moment().format('dddd DD MMMM YYYY');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Réunion',
      description: 'Discussion sur le projet X',
      startDate: new Date(2023, 5, 12, 10, 0),
      duration: '1h',
      location: 'Salle A',
      status: 'Planifié',
      types: [{ id: 2, name: 'Réunion' }],
      invited: [MOCK_USERS[0], MOCK_USERS[1]]
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, SetView] = useState('week');

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ startDate: start, endDate: end });
    setModalOpen(true);
  };

  const handleSelectEvent = (calEvent) => {
    const ext = calEvent.extendedProps;
    setSelectedEvent({
      id: calEvent.id,
      title: calEvent.title,
      description: ext.description,
      startDate: calEvent.start,
      duration: ext.duration,
      location: ext.location,
      status: ext.status,
      types: ext.types,
      invited: ext.invited
    });
    setModalOpen(true);
  };

  const handleViewChange = (newview) => {
    SetView(newview);
    setCurrentView(newview);
  };

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventData.id ? eventData : e))
      );
    } else {
      const newId = Date.now();
      setEvents((prev) => [...prev, { ...eventData, id: newId }]);
    }
    setModalOpen(false);
    setSelectedEvent(null);
  };
  const handleOpenEvent = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // "1h30" => 90 minutes => 5400000 ms
  const parseDurationToMs = (durationStr) => {
    let totalMin = 0;
    const hMatch = durationStr.match(/(\d+)h/);
    const mMatch = durationStr.match(/(\d+)min/);
    if (hMatch) totalMin += parseInt(hMatch[1], 10) * 60;
    if (mMatch) totalMin += parseInt(mMatch[1], 10);
    return totalMin * 60000;
  };

  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: new Date(e.startDate),
    end: new Date(new Date(e.startDate).getTime() + parseDurationToMs(e.duration)),
    extendedProps: {
      description: e.description,
      duration: e.duration,
      location: e.location,
      status: e.status,
      types: e.types,
      invited: e.invited
    }
  }));

  const handleNavigate = (date) => setCurrentDate(date);

  return (
    <Box sx={{ p: 4, bgcolor: '#F3FAFF', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          mb={2}
          sx={{ px: 4, pt: 4 }}
        >
          Gestion des Événements
        </Typography>
        <Divider sx={{ mb: 3, mx: 4 }} />
           {/* === DATE D'AUJOURD'HUI EN BLEU SOUS LE DIVIDER === */}
           <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 4, mb: 2 }}>
          <Typography sx={{
            fontSize: '1.04rem',
            color: '#1976d2',
            fontWeight: 500,
            letterSpacing: 0.2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span role="img" aria-label="calendar" style={{ fontSize: 22 }}>📅</span>
            Aujourd'hui : {today}
          </Typography>
        </Box>
        {/* === FIN DATE D'AUJOURD'HUI === */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, px: 4 }}>
          <ButtonComponent
            onClick={handleOpenEvent}
            text={t('Ajouter un évènement')}
            icon={<AddCircleOutlineIcon />}
          />
        </Box>
        {/* CalendarContainer encapsule le calendrier */}
        <Box className="CalendarContainer">
          <Calendar
            messages={calendarMessages}
            localizer={localizer}
            events={calendarEvents}
            culture={i18n.language} 
            startAccessor="start"
            endAccessor="end"
            selectable
            style={{ height: '85vh', minHeight: 470, background: 'transparent' }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            onView={handleViewChange}
            date={currentDate}
            onNavigate={handleNavigate}
            defaultView="week"
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.extendedProps.status === 'Terminé' ? '#4caf50'
                    : event.extendedProps.status === 'Annulé' ? '#f44336'
                      : event.extendedProps.status === 'En cours' ? '#ff9800'
                        : '#1976d2',
                borderRadius: '4px',
                border: 'none',
                color: 'white',
                padding: '2px 4px',
                fontSize: '0.75rem',
                minHeight: currentView === 'month' ? '50px' : 'auto',
                
              }
            })}
            components={{
              event: ({ event }) => {
                const ext = event.extendedProps;
                return (
                  <Box
                    sx={{
                      color: 'white',
                      p: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: '100%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {event.title}
                    </Box>
                    {ext.location && (
                      <Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                        📍 {ext.location}
                      </Box>
                    )}
                    {ext.duration && (
                      <Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                        ⏱️ {ext.duration}
                      </Box>
                    )}
                    {currentView === 'month' && ext.invited && ext.invited.length > 0 && (
                      <Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                        👥 {ext.invited.length} invité{ext.invited.length > 1 ? 's' : ''}
                      </Box>
                    )}
                    {(currentView === 'week' || currentView === 'day') && ext.description && (
                      <Box sx={{
                        fontSize: '0.65rem',
                        opacity: 0.8,
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {ext.description}
                      </Box>
                    )}
                    <Box sx={{
                      fontSize: '0.6rem',
                      opacity: 0.7,
                      mt: 0.5,
                      textAlign: 'right'
                    }}>
                      {ext.status}
                    </Box>
                  </Box>
                );
              },
              toolbar: CustomToolbar, 
            }}
          />
        </Box>
      </Paper>
      <EventFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />
    </Box>
  );
}

// Formulaire modale d'événement (inchangé)
const EventFormModal = ({ open, onClose, onSave, onDelete, event }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.startDate || new Date());
  const [duration, setDuration] = useState(event?.duration || '');
  const [location, setLocation] = useState(event?.location || '');
  const [status, setStatus] = useState(event?.status || 'Planifié');
  const [selectedTypes, setSelectedTypes] = useState(event?.types || []);
  const [invitedUsers, setInvitedUsers] = useState(event?.invited || []);

  useEffect(() => {
    if (open) {
      setTitle(event?.title || '');
      setDescription(event?.description || '');
      setStartDate(event?.startDate || new Date());
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
    const eventData = {
      id: event?.id || undefined,
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
      <Box
        component="dialog"
        sx={{
          display: open ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1300
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: 2,
            width: { xs: '90%', sm: '600px' },
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 24,
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="600">
              {event?.id ? 'Modifier un événement' : 'Ajouter un événement'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* TITRE */}
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
              {/* DESCRIPTION */}
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
              {/* DATE DE DÉBUT */}
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Date de début"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              {/* DURÉE */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Durée (ex: 1h, 90min)"
                  fullWidth
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              {/* EMPLACEMENT */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Emplacement"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              {/* STATUT */}
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
              {/* TYPE D'ÉVÉNEMENT */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={MOCK_TYPES}
                  getOptionLabel={(option) => option.name}
                  value={selectedTypes}
                  onChange={(_, newValue) => setSelectedTypes(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={option.name}
                        color="primary"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Type(s) d'événement"
                      placeholder="Sélectionner"
                    />
                  )}
                />
              </Grid>
              {/* INVITER DES EMPLOYÉS */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={MOCK_USERS}
                  getOptionLabel={(option) => option.fullName}
                  value={invitedUsers}
                  onChange={(_, newValue) => setInvitedUsers(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((user, index) => (
                      <Chip
                        key={user.id}
                        label={user.fullName}
                        color="secondary"
                        {...getTagProps({ index })}
                      />
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
              {event?.id && (
                <Button
                  onClick={() => onDelete(event.id)}
                  color="error"
                  startIcon={<DeleteOutline />}
                  variant="outlined"
                >
                  Supprimer
                </Button>
              )}
              <Button onClick={onClose} variant="text" startIcon={<CloseOutlined />}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                startIcon={<SaveOutlined />}
              >
                Enregistrer
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
