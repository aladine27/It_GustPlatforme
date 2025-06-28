// actions/eventActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --------- EVENTS ---------
export const fetchAllEvents = createAsyncThunk(
  "event/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/event", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "event/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchEventsByUser = createAsyncThunk(
  "event/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/event/geteventbyUserID/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "event/create",
  async (eventData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // ←—— AJOUTE CE LOG
      console.log("🚀 [createEvent] payload envoyé au backend :", eventData);

      const res = await axios.post(
        "http://localhost:3000/event",
        eventData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ←—— ET CE LOG
      console.log("✅ [createEvent] réponse reçue :", res.status, res.data);

      return res.data.data;
    } catch (err) {
      // ←—— ET LÀ AUSSI
      console.error("❌ [createEvent] erreur axios :", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/event/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:3000/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --------- EVENT TYPES ---------
export const fetchEventTypes = createAsyncThunk(
  "eventType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/event-type", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createEventType = createAsyncThunk(
  "eventType/create",
  async (eventTypeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/event-type",
        eventTypeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateEventType = createAsyncThunk(
  "eventType/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/event-type/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteEventType = createAsyncThunk(
    "eventType/delete",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/event-type/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );
  