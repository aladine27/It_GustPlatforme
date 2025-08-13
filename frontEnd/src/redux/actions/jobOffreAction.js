import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// --------- JOB OFFRE ACTIONS ---------

export const fetchAllJobOffres = createAsyncThunk(
  "jobOffre/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchAllJobOffres] Token:", token);
      const res = await axios.get("http://localhost:3000/joboffre", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[fetchAllJobOffres] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchAllJobOffres] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchJobOffreById = createAsyncThunk(
  "jobOffre/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchJobOffreById] Token:", token, "ID:", id);
      const res = await axios.get(`http://localhost:3000/joboffre/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[fetchJobOffreById] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchJobOffreById] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchJobOffreByUser = createAsyncThunk(
  "jobOffre/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchJobOffreByUser] Token:", token, "UserId:", userId);
      const res = await axios.get(
        `http://localhost:3000/joboffre/findJobOffreByUserId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[fetchJobOffreByUser] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchJobOffreByUser] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchJobOffreByCategory = createAsyncThunk(
  "jobOffre/fetchByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchJobOffreByCategory] Token:", token, "CategoryId:", categoryId);
      const res = await axios.get(
        `http://localhost:3000/joboffre/getJobOffreByjobCategory/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[fetchJobOffreByCategory] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchJobOffreByCategory] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createJobOffre = createAsyncThunk(
  "jobOffre/create",
  async (jobOffreData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[createJobOffre] Data:", jobOffreData, "Token:", token);
      const res = await axios.post(
        "http://localhost:3000/joboffre",
        jobOffreData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[createJobOffre] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[createJobOffre] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateJobOffre = createAsyncThunk(
  "jobOffre/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[updateJobOffre] ID:", id, "Data:", updateData, "Token:", token);
      const res = await axios.patch(
        `http://localhost:3000/joboffre/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[updateJobOffre] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[updateJobOffre] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteJobOffre = createAsyncThunk(
  "jobOffre/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[deleteJobOffre] ID:", id, "Token:", token);
      const res = await axios.delete(`http://localhost:3000/joboffre/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[deleteJobOffre] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[deleteJobOffre] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --------- JOB CATEGORY ACTIONS ---------

export const fetchAllJobCategories = createAsyncThunk(
  "jobCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchAllJobCategories] Token:", token);
      const res = await axios.get("http://localhost:3000/job-category", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[fetchAllJobCategories] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchAllJobCategories] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchJobCategoryById = createAsyncThunk(
  "jobCategory/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchJobCategoryById] Token:", token, "ID:", id);
      const res = await axios.get(`http://localhost:3000/job-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[fetchJobCategoryById] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchJobCategoryById] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createJobCategory = createAsyncThunk(
  "jobCategory/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[createJobCategory] Data:", categoryData, "Token:", token);
      const res = await axios.post(
        "http://localhost:3000/job-category",
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[createJobCategory] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[createJobCategory] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateJobCategory = createAsyncThunk(
  "jobCategory/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[updateJobCategory] ID:", id, "Data:", updateData, "Token:", token);
      const res = await axios.patch(
        `http://localhost:3000/job-category/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[updateJobCategory] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[updateJobCategory] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteJobCategory = createAsyncThunk(
  "jobCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[deleteJobCategory] ID:", id, "Token:", token);
      const res = await axios.delete(`http://localhost:3000/job-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[deleteJoabCategory] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[deleteJobCategory] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
