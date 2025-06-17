// Evenement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ButtonComponent } from '../components/Global/ButtonComponent';
import { useTranslation } from 'react-i18next';
import useMomentLocale from '../../src/useMomentLocal.js';

import {
  fetchAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventTypes,
  createEventType
} from "../redux/actions/eventAction";

import { FetchEmployesAction } from '../redux/actions/employeAction';

const localizer = momentLocalizer(moment);

import '../components/Event/calendrier.css';
import CustomToolbar from '../components/Event/CustomToolbar';

// --- Main Component ---
export default function Evenement() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  // Redux state
  const { eventTypes } = useSelector(state => state.eventType);
  const { events, loading: eventsLoading } = useSelector(state => state.event);
  const { list: employes, loading: employesLoading } = useSelector(state => state.employe);

  // UI states
  const [modalOpen, setModalOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, SetView] = useState('week');

  useMomentLocale(t);

  // --- Fetch on mount ---
  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchEventTypes());
    dispatch(FetchEmployesAction());
  }, [dispatch]);

  // --- Handler: Add Event Type ---
  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    await dispatch(createEventType({ name: newTypeName }));
    setNewTypeName('');
    setTypeModalOpen(false);
    dispatch(fetchEventTypes());
  };

  // --- Handlers: Calendar ---
  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ startDate: start, endDate: end, invited: [] });
    setModalOpen(true);
  };
  const handleSelectEvent = (calEvent) => {
    const ext = calEvent.extendedProps;
    setSelectedEvent({
      _id: calEvent._id,
      id: calEvent._id,
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

  // --- Handler: Save Event ---
  const handleSaveEvent = async (eventData) => {
    // Sélectionne l'id du type (le premier ou le seul choisi)
    const eventTypeId = eventData.types?.[0]?._id || eventData.types?._id || eventData.eventType?._id;
  
    const payload = {
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      duration: eventData.duration,
      location: eventData.location,
      status: eventData.status,
      eventType: eventTypeId,     // ← Un seul type !
      user: userId,               // ← L'id du user connecté
      invited: eventData.invited?.map(emp => emp._id) || []
    };
    console.log('payload envoyé:', payload);
    console.log("----------- NOUVEL EVENT -----------");
    console.log('eventData reçu depuis modal :', eventData);
    console.log('userId connecté:', userId);
    console.log('eventTypeId utilisé:', eventTypeId);
    console.log('payload envoyé:', payload);
    console.log("-------------------------------------");
  
    if (eventData.id || eventData._id) {
      await dispatch(updateEvent({ id: eventData.id || eventData._id, updateData: payload }));
    } else {
      await dispatch(createEvent(payload));
    }
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setSelectedEvent(null);
  };
  
  // --- Handler: Delete Event ---
  const handleDeleteEvent = async (id) => {
    await dispatch(deleteEvent(id));
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // --- Calendar events mapping ---
  const parseDurationToMs = (durationStr) => {
    let totalMin = 0;
    const hMatch = durationStr?.match(/(\d+)h/);
    const mMatch = durationStr?.match(/(\d+)min/);
    if (hMatch) totalMin += parseInt(hMatch[1], 10) * 60;
    if (mMatch) totalMin += parseInt(mMatch[1], 10);
    return totalMin * 60000;
  };

  const calendarEvents = (events || []).map((e) => ({
    ...e,
    id: e._id,
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

  const today = moment().format('dddd DD MMMM YYYY');
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
        {/* --- BUTTONS --- */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, px: 4 }}>
          <Button
            onClick={() => setTypeModalOpen(true)}
            variant="outlined"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mr: 2 }}
          >
            {t('Créer un type d\'événement')}
          </Button>
          <ButtonComponent
            onClick={() => {
              setSelectedEvent(null);
              setModalOpen(true);
            }}
            text={t('Ajouter un évènement')}
            icon={<AddCircleOutlineIcon />}
          />
        </Box>
        {/* --- CALENDAR --- */}
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
                  <Box sx={{
                    color: 'white',
                    p: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    height: '100%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }}>
                    <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{event.title}</Box>
                    {ext.location && (<Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>📍 {ext.location}</Box>)}
                    {ext.duration && (<Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>⏱️ {ext.duration}</Box>)}
                    {currentView === 'month' && ext.invited && ext.invited.length > 0 && (
                      <Box sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                        👥 {ext.invited.length} invité{ext.invited.length > 1 ? 's' : ''}
                      </Box>
                    )}
                    {(currentView === 'week' || currentView === 'day') && ext.description && (
                      <Box sx={{
                        fontSize: '0.65rem', opacity: 0.8, mt: 0.5, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {ext.description}
                      </Box>
                    )}
                    <Box sx={{ fontSize: '0.6rem', opacity: 0.7, mt: 0.5, textAlign: 'right' }}>
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
      {/* --- MODALE AJOUT TYPE --- */}
      {typeModalOpen && (
        <Box sx={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.3)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Paper sx={{ p: 3, minWidth: 320 }}>
            <Typography fontWeight={600} mb={2}>{t('Créer un type d\'événement')}</Typography>
            <TextField
              value={newTypeName}
              onChange={e => setNewTypeName(e.target.value)}
              label={t("Nom du type")}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setTypeModalOpen(false)}>{t('Annuler')}</Button>
              <Button onClick={handleAddType} variant="contained" disabled={!newTypeName.trim()}>{t('Créer')}</Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* --- FORM MODALE EVENEMENT --- */}
      <EventFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        eventTypes={eventTypes}
        employes={employes}
        loadingEmployes={employesLoading}
      />
    </Box>
  );
}

// --- Formulaire Modale d'événement ---
const EventFormModal = ({ open, onClose, onSave, onDelete, event, eventTypes, employes, loadingEmployes }) => {
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
    console.log("selectedTypes (types choisis):", selectedTypes);
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
    console.log('>>> Données event du formulaire avant envoi:', eventData);
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
              {event?.id || event?._id ? 'Modifier un événement' : 'Ajouter un événement'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }}>
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
                <Button
                  onClick={() => onDelete(event.id || event._id)}
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
