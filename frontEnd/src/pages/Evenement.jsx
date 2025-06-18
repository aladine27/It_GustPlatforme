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
  createEventType,
  updateEventType, 
  deleteEventType, 
} from "../redux/actions/eventAction";
import { FetchEmployesAction } from '../redux/actions/employeAction';

import '../components/Event/calendrier.css';
import CustomToolbar from '../components/Event/CustomToolbar';

// --- IMPORT MODALS ---
import EventFormModal from '../components/Event/EventFormModal';
import TypeFormModal from '../components/Event/TypeFormModal';
import EventDetailsModal from '../components/Event/EventDetailModal.jsx'; // Ajoute ce composant !

const localizer = momentLocalizer(moment);

export default function Evenement() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  const userRole = CurrentUser?.user?.role || CurrentUser?.role || "";

  // Récupération des données du Redux store
  const { eventTypes } = useSelector(state => state.eventType);
  const { events } = useSelector(state => state.event);
  const { list: employes, loading: employesLoading } = useSelector(state => state.employe);

  // States d'UI
  const [modalOpen, setModalOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, SetView] = useState('week');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Pour changer la langue des dates du calendrier selon la langue de l'app
  useMomentLocale(t);

  // Gère le changement de vue (mois/semaine/jour)
  const handleViewChange = (newView) => {
    SetView(newView);
    setCurrentView(newView);
  };

  // Charge les données au montage du composant
  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchEventTypes());
    dispatch(FetchEmployesAction());
  }, [dispatch]);

  // Ajout d'un type d'événement
  const handleAddType = async (name) => {
    try {
      await dispatch(createEventType({ name }));
      // Facultatif : ferme le modal seulement si tu veux (sinon, l'utilisateur peut enchaîner d'autres ajouts)
      setTypeModalOpen(false);
      setNewTypeName(''); // utile si tu gères la valeur en state global, sinon RHF gère
      dispatch(fetchEventTypes());
      // Pas besoin de toast ici, il est déjà dans le modal
    } catch (e) {
      // Le toast d'erreur sera déjà affiché dans le modal en cas d'échec
    }
  };
  

  // --- Création d'un event via sélection d'un créneau dans le calendrier ---
  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ startDate: start, endDate: end, invited: [] });
    setModalOpen(true);
  };

  // --- Clic sur un event pour afficher ses détails ---
  const handleSelectEvent = (calEvent) => {
    const ext = calEvent.extendedProps;

    // Reconstruit les invités à partir des IDs si besoin
    let invitedFullObjects = ext.invited;
    if (Array.isArray(ext.invited) && employes?.length) {
      if (typeof ext.invited[0] === "string" || typeof ext.invited[0] === "number") {
        invitedFullObjects = ext.invited
          .map(id => employes.find(emp => emp._id === id))
          .filter(Boolean);
      }
    }

    // Construit l'objet complet pour la modale
    const fullEvent = {
      _id: calEvent._id,
      id: calEvent._id,
      title: calEvent.title,
      description: ext.description,
      startDate: calEvent.start,
      duration: ext.duration,
      location: ext.location,
      status: ext.status,
      types: Array.isArray(ext.types) ? ext.types : [],
      invited: invitedFullObjects,
    };

    setSelectedEvent(fullEvent);
    setDetailsModalOpen(true);
  };

  // Ouvre la modale d'édition depuis la modale de détail
  const handleEditEvent = () => {
    setDetailsModalOpen(false);
    setModalOpen(true);
  };

  // Enregistre (ajoute ou met à jour) un événement
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
      dispatch(updateEvent({ id: eventData.id || eventData._id, updateData: payload }));
    } else {
      dispatch(createEvent(payload));
    }
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Supprime un event
  const handleDeleteEvent = async (id) => {
    dispatch(deleteEvent(id));
    dispatch(fetchAllEvents());
    setModalOpen(false);
    setDetailsModalOpen(false);
    setSelectedEvent(null);
  };

  // Transforme la durée texte ("1h30min") en millisecondes pour l'affichage
  const parseDurationToMs = (durationStr) => {
    let totalMin = 0;
    const hMatch = durationStr?.match(/(\d+)h/);
    const mMatch = durationStr?.match(/(\d+)min/);
    if (hMatch) totalMin += parseInt(hMatch[1], 10) * 60;
    if (mMatch) totalMin += parseInt(mMatch[1], 10);
    return totalMin * 60000;
  };

  // Mapping des events pour react-big-calendar (avec extendedProps pour custom rendering)
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

  // Traduction des labels du calendrier
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

  // Pour affichage de la date du jour
  const today = moment().format('dddd DD MMMM YYYY');
  const handleNavigate = (date) => setCurrentDate(date);
  //fonction pour Edittype et deletetype
  const handleEditType = async (typeId, newName) => {
    await dispatch(updateEventType({ id: typeId, updateData: { name: newName } }));
    dispatch(fetchEventTypes());
  };
  
  const handleDeleteType = async (typeId) => {
    await dispatch(deleteEventType(typeId));
    dispatch(fetchEventTypes());
  };
  

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
        {/* --- Boutons d'ajout visibles seulement pour Admin/RH --- */}
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
        {/* --- Affichage du calendrier principal --- */}
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
            // Affiche le calendrier uniquement de 8h à 18h (jours de travail)
            min={new Date(1970, 0, 1, 8, 0)}  // 8h00 (Janvier, car mois = 0)
            max={new Date(1970, 0, 1, 18, 0)} // 18h00
            onSelectSlot={["Admin", "RH"].includes(userRole) ? handleSelectSlot : undefined}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            onView={handleViewChange}
            date={currentDate}
            onNavigate={handleNavigate}
            defaultView="week"

            // Personnalisation de l'apparence des events (couleurs, ombres, arrondi, etc.)
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.extendedProps.status === 'Terminé' ? '#4caf50'
                    : event.extendedProps.status === 'Annulé' ? '#f44336'
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
                borderLeft: '5px solid #FFF', // Ligne décorative à gauche
                transition: 'all 0.12s'
              }
            })}
            // Custom render pour chaque événement (UX : infos claires et bien présentées)
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
                    {/* Heure de début/fin */}
                    <span style={{
                      fontSize: '0.82em',
                      color: '#ffc107',
                      fontWeight: 700,
                      display: 'block'
                    }}>
                      {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                    </span>
                    {/* Titre et type */}
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
                    {/* Emplacement */}
                    <span style={{ fontSize: '0.85em', opacity: 0.88 }}>
                      {ext.location && <>📍 {ext.location}</>}
                    </span>
                    {/* Durée */}
                    <span style={{ fontSize: '0.80em', opacity: 0.72 }}>
                      {ext.duration && <>⏱️ {ext.duration}</>}
                    </span>
                    {/* Nombre d'invités */}
                    {(ext.invited?.length > 0) && (
                      <span style={{ fontSize: '0.79em', color: '#ffd54f', fontWeight: 600 }}>
                        👥 {ext.invited.length} invité{ext.invited.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {/* Description */}
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
      </Paper>

      {/* --- MODALES EXTERNES --- */}
      <TypeFormModal
  open={typeModalOpen}
  onClose={() => setTypeModalOpen(false)}
  value={newTypeName}
  onChange={setNewTypeName}
  onCreate={handleAddType}
  // AJOUTE LES 3 LIGNES CI-DESSOUS :
  eventTypes={eventTypes}
  onEditType={handleEditType}
  onDeleteType={handleDeleteType}
/>


      {/* --- MODALE DETAIL --- */}
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
      />
    </Box>
  );
}
