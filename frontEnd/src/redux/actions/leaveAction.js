// src/redux/actions/congeActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Récupère le token JWT (tu peux adapter selon ta logique d'auth)
function getToken() {
  const raw = localStorage.getItem("user");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return parsed?.token?.accessToken || parsed?.token;
    } catch {
      return null;
    }
  }
  return null;
}

// --- FETCH ALL LEAVE TYPES
export const fetchAllLeaveTypes = createAsyncThunk(
  "conge/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:3000/leave-type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Si ta réponse est { data: ... }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- FETCH ONE LEAVE TYPE BY ID
export const fetchLeaveTypeById = createAsyncThunk(
  "conge/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`http://localhost:3000/leave-type/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- CREATE
export const createLeaveType = createAsyncThunk(
  "conge/create",
  async (leaveTypeData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:3000/leave-type",
        leaveTypeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- UPDATE
export const updateLeaveType = createAsyncThunk(
  "conge/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:3000/leave-type/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- DELETE
export const deleteLeaveType = createAsyncThunk(
  "conge/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.delete(
        `http://localhost:3000/leave-type/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
