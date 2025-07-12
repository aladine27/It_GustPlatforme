import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box, Typography, Button, Divider
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
  createEventType,
  updateEventType, 
  deleteEventType, 
} from "../redux/actions/eventAction";
import { FetchEmployesAction } from '../redux/actions/employeAction';

import '../components/Event/calendrier.css';
import CustomToolbar from '../components/Event/CustomToolbar';

import EventFormModal from '../components/Event/EventFormModal';
import TypeFormModal from '../components/Event/TypeFormModal';
import EventDetailsModal from '../components/Event/EventDetailModal.jsx';
import { StyledPaper } from '../style/style.jsx';
import { toast } from 'react-toastify';
import 'moment/locale/fr'
const localizer = momentLocalizer(moment);

export default function Evenement() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  const userRole = CurrentUser?.user?.role || CurrentUser?.role || "";

  const { eventTypes } = useSelector(state => state.eventType);
  const { events } = useSelector(state => state.event);
  const { list: employes, loading: employesLoading } = useSelector(state => state.employe);

  const [modalOpen, setModalOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
moment.locale(i18n.language);
  useMomentLocale(i18n);

  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchEventTypes());
    dispatch(FetchEmployesAction());
  }, [dispatch]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ startDate: start, endDate: end, invited: [] });
    setModalOpen(true);
  };

  const handleSelectEvent = (calEvent) => {
    const ext = calEvent.extendedProps;
    let mappedTypes = [];
    if (Array.isArray(ext.types)) {
      mappedTypes = ext.types
        .map(t => (typeof t === "object" && t !== null && t.name) ? t : eventTypes.find(et => et._id === (t._id || t)))
        .filter(Boolean);
    }
  let invitedFullObjects = [];
if (Array.isArray(ext.invited) && employes?.length) {
  invitedFullObjects = ext.invited.map(inv => {
    if (typeof inv === "object" && inv._id) {
      const found = employes.find(emp => emp._id === inv._id);
      return found || inv;
    }
    if (typeof inv === "string" || typeof inv === "number") {
      return employes.find(emp => emp._id === inv) || null;
    }
    return null;
  }).filter(Boolean);
}

    const fullEvent = {
      _id: calEvent._id,
      id: calEvent._id,
      title: calEvent.title,
      description: ext.description,
      startDate: calEvent.start,
      duration: ext.duration,
      location: ext.location,
      status: ext.status,
      types: mappedTypes,
      invited: invitedFullObjects,
    };
    setSelectedEvent(fullEvent);
    setDetailsModalOpen(true);
  };

  const handleEditEvent = () => {
    setDetailsModalOpen(false);
    setModalOpen(true);
  };

  // Conflit de salle (bloque SEULEMENT lors de la création)
  const hasRoomConflict = (eventData) => {
    console.log("[RoomConflict] Checking for:", eventData);
    return calendarEvents.some(ev => {
      if (
        !ev.extendedProps.location ||
        !eventData.location ||
        ev.extendedProps.location.trim().toLowerCase() !== eventData.location.trim().toLowerCase()
      ) return false;
      const eventDataId = String(eventData.id || eventData._id || '');
      const evId = String(ev.id || ev._id || '');
      if (eventDataId && evId && evId === eventDataId) return false;

      const start1 = new Date(ev.start);
      const end1 = new Date(ev.end);
      const start2 = new Date(eventData.startDate);
      let totalMin = 0;
      const hMatch = eventData.duration?.match(/(\d+)h/);
      const mMatch = eventData.duration?.match(/(\d+)min/);
      if (hMatch) totalMin += parseInt(hMatch[1], 10) * 60;
      if (mMatch) totalMin += parseInt(mMatch[1], 10);
      const end2 = new Date(start2.getTime() + totalMin * 60000);

      // Log de chaque case
      console.log("[RoomConflict] VS", {
        evId, eventDataId,
        start1: start1.toISOString(), end1: end1.toISOString(),
        start2: start2.toISOString(), end2: end2.toISOString(),
        overlap: start1 < end2 && start2 < end1
      });
      return start1 < end2 && start2 < end1;
    });
  };

  const handleSaveEvent = async (eventData) => {
    const isEditMode = !!eventData.id || !!eventData._id;
    console.log("[SaveEvent] Payload envoyé:", { eventData, isEditMode });

    // Test conflit de salle uniquement à la création
    if (!isEditMode && eventData.location && hasRoomConflict(eventData)) {
      toast.error("Conflit de salle : cette salle est déjà réservée...");
      return;
    }
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
    if (isEditMode) {
      dispatch(updateEvent({ id: eventData.id || eventData._id, updateData: payload }));
    } else {
      dispatch(createEvent(payload));
    }
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (id) => {
    dispatch(deleteEvent(id));
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setDetailsModalOpen(false);
    setSelectedEvent(null);
  };

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
      types: e.eventType ? [e.eventType] : [],
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
moment.updateLocale('fr', {
  week: {
    dow: 1,
  }
});

  const today = moment().format('dddd DD MMMM YYYY');
  const handleNavigate = (date) => setCurrentDate(date);

  const handleEditType = async (typeId, newName) => {
    dispatch(updateEventType({ id: typeId, updateData: { name: newName } }));
    dispatch(fetchEventTypes());
  };

  const handleDeleteType = async (typeId) => {
    dispatch(deleteEventType(typeId));
    dispatch(fetchEventTypes());
  };
  const handleAddType = async (name) => {
    try {
      dispatch(createEventType({ name }));
      setTypeModalOpen(false);
      setNewTypeName('');
      dispatch(fetchEventTypes());
    } catch (e) {}
  };

  return (
    <StyledPaper elevation={3} sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
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
          {t('Aujourd\'hui')}: {today}
        </Typography>
      </Box>
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
      <Box className="CalendarContainer">
        <Calendar
          messages={calendarMessages}
          localizer={localizer}
          events={calendarEvents}
          culture={i18n.language.startsWith('fr') ? 'fr' : 'en'}
          startAccessor="start"
          endAccessor="end"
          selectable
          style={{ height: '85vh', minHeight: 470, background: 'transparent' ,width:'100%'}}
          min={new Date(1970, 0, 1, 7, 0)}
          max={new Date(1970, 0, 1, 22, 0)}
          onSelectSlot={["Admin", "RH"].includes(userRole) ? handleSelectSlot : undefined}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={handleNavigate}
          defaultView="week"
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.extendedProps.status === 'Terminé' ? '#4caf50'
                  : event.extendedProps.status === 'Planifié' ? '#f44336'
                    : event.extendedProps.status === 'En cours' ? '#ff9800'
                      : '#1976d2',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.98rem',
              boxShadow: '0 2px 8px rgba(30,40,120,0.07)',
              minHeight: '44px',
              margin: '4px 0',
              padding: '10px 14px',
              borderLeft: '5px solid #FFF',
              transition: 'all 0.12s'
            }
          })}
          components={{
            event: ({ event }) => {
              const ext = event.extendedProps;
              return (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  p: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.88,
                    filter: 'brightness(1.08) contrast(1.03)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.13)'
                  }
                }}>
                  <span style={{
                    fontSize: '0.82em',
                    color: '#ffc107',
                    fontWeight: 700,
                    display: 'block'
                  }}>
                    {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {event.title}
                    {ext.types && ext.types[0]?.name && (
                      <span style={{
                        fontSize: '0.79em',
                        color: '#fff',
                        background: '#607d8b',
                        borderRadius: 5,
                        padding: '1px 6px',
                        marginLeft: 8,
                        fontWeight: 500
                      }}>
                        {ext.types[0]?.name}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: '0.85em', opacity: 0.88 }}>
                    {ext.location && <>📍 {ext.location}</>}
                  </span>
                  <span style={{ fontSize: '0.80em', opacity: 0.72 }}>
                    {ext.duration && <>⏱️ {ext.duration}</>}
                  </span>
                  {(ext.invited?.length > 0) && (
                    <span style={{ fontSize: '0.79em', color: '#ffd54f', fontWeight: 600 }}>
                      👥 {ext.invited.length} invité{ext.invited.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {ext.description && (
                    <span style={{
                      fontSize: '0.75em',
                      opacity: 0.78,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      marginTop: 2
                    }}>
                      {ext.description}
                    </span>
                  )}
                </Box>
              );
            },
            toolbar: CustomToolbar,
          }}
        />
      </Box>
      <TypeFormModal
        open={typeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        value={newTypeName}
        onChange={setNewTypeName}
        onCreate={handleAddType}
        eventTypes={eventTypes}
        onEditType={handleEditType}
        onDeleteType={handleDeleteType}
      />
      <EventDetailsModal
        open={detailsModalOpen}
        handleClose={() => setDetailsModalOpen(false)}
        event={selectedEvent}
        eventTypes={eventTypes}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        userRole={userRole}
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
        userRole={userRole}
        isEditMode={!!selectedEvent} 
        currentUserId={userId}
      />
    </StyledPaper>
  );
}
