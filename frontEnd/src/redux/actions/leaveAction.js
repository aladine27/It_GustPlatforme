import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";





// Fetch all leaves
export const fetchAllLeaves = createAsyncThunk(
  "leave/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("----- [Frontend] Leaves récupérés depuis API -----");
      console.log(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log("Erreur fetchAllLeaves", err?.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Fetch one leave by ID
export const fetchLeaveById = createAsyncThunk(
  "leave/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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


export const deleteLeave = createAsyncThunk(
  "leave/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:3000/leave/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch all leave types
export const fetchAllLeaveTypes = createAsyncThunk(
  "leaveType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/leave-type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[Thunk] fetchAllLeaveTypes API DATA:", res.data.data); // <==== AJOUTE CE LOG
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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

export const fetchLeaveBalance = createAsyncThunk(
  "leave/fetchLeaveBalance", // nom de l'action
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/leave/leave-balance/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // res.data.data doit être { soldeInitial, soldeRestant }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
