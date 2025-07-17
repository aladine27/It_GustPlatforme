import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all teams
export const fetchAllTeams = createAsyncThunk(
  "team/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchAllTeams", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchTeamsByProject = createAsyncThunk(
  "team/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/teams/by-project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[fetchTeamsByProject] axios res.data :", res.data); // Ajout
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchTeamsByProject", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Fetch team by ID
export const fetchTeamById = createAsyncThunk(
  "team/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchTeamById", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create team
export const createTeam = createAsyncThunk(
  "team/create",
  async (teamData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/teams",
        teamData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur createTeam", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update team
export const updateTeam = createAsyncThunk(
  "team/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/teams/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur updateTeam", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete team
export const deleteTeam = createAsyncThunk(
  "team/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:3000/teams/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      console.log("Erreur deleteTeam", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
