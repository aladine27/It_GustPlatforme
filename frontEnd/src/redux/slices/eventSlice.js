// eventSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllEvents,
  fetchEventById,
  fetchEventsByUser,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventTypes,
  createEventType,
  updateEventType,
  deleteEventType
} from "../actions/eventAction";

// --- EVENTS ---
const eventInitialState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  success: null,
};

export const eventSlice = createSlice({
  name: "event",
  initialState: eventInitialState,
  reducers: {
    clearEventMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des évènements.";
      })

      // Fetch by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.selectedEvent = null;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.selectedEvent = null;
        state.error = action.payload || "Erreur lors du chargement de l’évènement.";
      })

      // Fetch events by User
      .addCase(fetchEventsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchEventsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des évènements de l'utilisateur.";
      })

      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
        state.success = "Évènement ajouté avec succès.";
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la création.";
      })

      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.map(e => e._id === action.payload._id ? action.payload : e);
        state.success = "Évènement mis à jour.";
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la modification.";
      })

      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(e => e._id !== action.payload._id);
        state.success = "Évènement supprimé.";
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la suppression.";
      });
  }
});

// --- EVENT TYPES ---
const eventTypeInitialState = {
  eventTypes: [],
  selectedType: null,
  loading: false,
  error: null,
  success: null,
};

export const eventTypeSlice = createSlice({
  name: "eventType",
  initialState: eventTypeInitialState,
  reducers: {
    clearTypeMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedType(state) {
      state.selectedType = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all event types
      .addCase(fetchEventTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchEventTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.eventTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchEventTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des types.";
      })

      // Create event type
      .addCase(createEventType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createEventType.fulfilled, (state, action) => {
        state.loading = false;
        state.eventTypes.push(action.payload);
        state.success = "Type d'évènement ajouté.";
      })
      .addCase(createEventType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de l'ajout.";
      })

      // Update event type
      .addCase(updateEventType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateEventType.fulfilled, (state, action) => {
        state.loading = false;
        state.eventTypes = state.eventTypes.map(type => type._id === action.payload._id ? action.payload : type);
        state.success = "Type d'évènement mis à jour.";
      })
      .addCase(updateEventType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la modification.";
      })

      // Delete event type
      .addCase(deleteEventType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteEventType.fulfilled, (state, action) => {
        state.loading = false;
        state.eventTypes = state.eventTypes.filter(type => type._id !== action.payload._id);
        state.success = "Type d'évènement supprimé.";
      })
      .addCase(deleteEventType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la suppression.";
      });
  }
});

export const { clearEventMessages, clearSelectedEvent } = eventSlice.actions;
export const { clearTypeMessages, clearSelectedType } = eventTypeSlice.actions;

