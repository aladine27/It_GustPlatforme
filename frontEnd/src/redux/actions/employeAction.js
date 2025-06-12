import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const FetchEmployesAction = createAsyncThunk(
  "employe/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/users",
        { withCredentials: true }
      );
      // backend retourne { message, data: users, status }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const CreateUserAction = createAsyncThunk(
  "user/create",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("address", userData.address);
      formData.append("phone", userData.phone);
      formData.append("role", userData.role);
      formData.append("domain", userData.domain);
      if (userData.image instanceof File) {
        formData.append("image", userData.image);
      }

      const response = await axios.post(
        "http://localhost:3000/users",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data; // renvoie le nouvel utilisateur
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de la création de l'utilisateur"
      );
    }
  }
  
);
export const FetchEmployesBySearchAction = createAsyncThunk(
  'employe/search',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/users/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // assuming { message, status, data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

