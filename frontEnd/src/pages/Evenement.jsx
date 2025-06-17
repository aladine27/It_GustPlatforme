import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box, Paper, Typography, Button, Divider
} from '@mui/material';
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

import '../components/Event/calendrier.css';
import CustomToolbar from '../components/Event/CustomToolbar';

// --- IMPORT MODALS ---
import EventFormModal from '../components/Event/EventFormModal';
import TypeFormModal from '../components/Event/TypeFormModal';

const localizer = momentLocalizer(moment);

export default function Evenement() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  const userRole = CurrentUser?.user?.role || CurrentUser?.role || "";

  // Redux state
  const { eventTypes } = useSelector(state => state.eventType);
  const { events } = useSelector(state => state.event);
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

  // --- Calendar Handlers ---
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
    setModalOpen(true); // Si tu utilises une modal de détail séparée, ouvre-la ici
  };
  const handleViewChange = (newview) => {
    SetView(newview);
    setCurrentView(newview);
  };

  // --- Save/Update Event ---
  const handleSaveEvent = async (eventData) => {
    const eventTypeId = eventData.types?.[0]?._id || eventData.types?._id || eventData.eventType?._id;
    const payload = {
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      duration: eventData.duration,
      location: eventData.location,
      status: eventData.status,
      eventType: eventTypeId,
      user: userId,
      invited: eventData.invited?.map(emp => emp._id) || []
    };
    if (eventData.id || eventData._id) {
      await dispatch(updateEvent({ id: eventData.id || eventData._id, updateData: payload }));
    } else {
      await dispatch(createEvent(payload));
    }
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // --- Delete Event ---
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
        {/* --- BUTTONS (visible seulement Admin/RH) --- */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, px: 4 }}>
          {["Admin", "RH"].includes(userRole) && (
            <>
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
            </>
          )}
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
            onSelectSlot={["Admin", "RH"].includes(userRole) ? handleSelectSlot : undefined}
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

      {/* --- MODALES EXTERNES --- */}
      <TypeFormModal
        open={typeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        value={newTypeName}
        onChange={setNewTypeName}
        onCreate={handleAddType}
      />
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
        userRole={userRole} // pour activer/désactiver edition/suppression dans la modale
      />
    </Box>
  );
}
