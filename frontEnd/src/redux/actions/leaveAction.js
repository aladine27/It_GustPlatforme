import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



// =======================
// ===== LEAVE CRUD ======
// =======================

// Fetch all leaves
export const fetchAllLeaves = createAsyncThunk(
  "leave/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:3000/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch one leave by ID
export const fetchLeaveById = createAsyncThunk(
  "leave/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`http://localhost:3000/leave/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch leaves by User ID
export const fetchLeavesByUser = createAsyncThunk(
  "leave/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:3000/leave/findLeaveByUserId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new leave (with file upload)
export const createLeave = createAsyncThunk(
  "leave/create",
  async (leaveData, { rejectWithValue }) => {
    try {
      const token = getToken();
      // leaveData doit être un FormData si tu veux envoyer un fichier !
      const res = await axios.post(
        "http://localhost:3000/leave",
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update a leave (with file upload)
export const updateLeave = createAsyncThunk(
  "leave/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      // updateData doit être un FormData si tu veux envoyer un fichier !
      const res = await axios.patch(
        `http://localhost:3000/leave/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a leave
export const deleteLeave = createAsyncThunk(
  "leave/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.delete(`http://localhost:3000/leave/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===========================
// ==== LEAVE TYPES CRUD =====
// ===========================

// Fetch all leave types
export const fetchAllLeaveTypes = createAsyncThunk(
  "leaveType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:3000/leave-type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch leave type by ID
export const fetchLeaveTypeById = createAsyncThunk(
  "leaveType/fetchById",
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

// Create a new leave type
export const createLeaveType = createAsyncThunk(
  "leaveType/create",
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

// Update leave type
export const updateLeaveType = createAsyncThunk(
  "leaveType/update",
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

// Delete leave type
export const deleteLeaveType = createAsyncThunk(
  "leaveType/delete",
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
