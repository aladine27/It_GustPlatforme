import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all sprints
export const fetchAllSprints = createAsyncThunk(
  "sprint/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/sprints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchAllSprints", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch sprints by project ID
export const fetchSprintsByProject = createAsyncThunk(
  "sprint/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/sprints/by-project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchSprintsByProject", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch sprint by ID
export const fetchSprintById = createAsyncThunk(
  "sprint/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/sprints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchSprintById", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create sprint
export const createSprint = createAsyncThunk(
  "sprint/create",
  async (sprintData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/sprints",
        sprintData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur createSprint", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update sprint
export const updateSprint = createAsyncThunk(
  "sprint/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/sprints/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur updateSprint", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete sprint
export const deleteSprint = createAsyncThunk(
  "sprint/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:3000/sprints/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur deleteSprint", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
