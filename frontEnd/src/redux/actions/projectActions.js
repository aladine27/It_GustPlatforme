// actions/projectActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAllProjects = createAsyncThunk(
  "project/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const fetchProjectById = createAsyncThunk(
  "project/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const fetchProjectsByUser = createAsyncThunk(
  "project/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/projects/findProjectByUserId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const fetchProjectsByCategory = createAsyncThunk(
  "project/fetchByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/projects/findProjectByCategory/${category}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const createProject = createAsyncThunk(
  "project/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/projects",
        projectData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const updateProject = createAsyncThunk(
  "project/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/projects/${id}`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const deleteProject = createAsyncThunk(
  "project/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:3000/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
