import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000/application";

// --------- APPLICATION ACTIONS ---------

export const fetchAllApplications = createAsyncThunk(
  "application/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchAllApplications] Token:", token);
      const res = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[fetchAllApplications] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchAllApplications] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  "application/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchApplicationById] Token:", token, "ID:", id);
      const res = await axios.get(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[fetchApplicationById] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchApplicationById] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createApplication = createAsyncThunk(
  "application/create",
  async (applicationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[createApplication] Data:", applicationData, "Token:", token);

      const formData = new FormData();
      if (applicationData.cvFile) {
        formData.append("cvFile", applicationData.cvFile);
      }
      formData.append("jobOffre", applicationData.jobOffre);

      const res = await axios.post(BASE_URL, formData, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("[createApplication] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[createApplication] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateApplication = createAsyncThunk(
  "application/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[updateApplication] ID:", id, "Data:", updateData, "Token:", token);

      const formData = new FormData();
      if (updateData.cvFile) {
        formData.append("cvFile", updateData.cvFile);
      }
      if (updateData.jobOffre) {
        formData.append("jobOffre", updateData.jobOffre);
      }

      const res = await axios.patch(`${BASE_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("[updateApplication] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[updateApplication] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "application/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[deleteApplication] ID:", id, "Token:", token);
      const res = await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("[deleteApplication] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[deleteApplication] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const fetchApplicationsByJobOffre = createAsyncThunk(
  "application/fetchByJobOffre",
  async (jobOffreId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("[fetchApplicationsByJobOffre] Token:", token, "JobOffreId:", jobOffreId);
      const res = await axios.get(
        `http://localhost:3000/application/by-offer/${jobOffreId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[fetchApplicationsByJobOffre] Response:", res);
      return res.data.data;
    } catch (err) {
      console.error("[fetchApplicationsByJobOffre] Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
