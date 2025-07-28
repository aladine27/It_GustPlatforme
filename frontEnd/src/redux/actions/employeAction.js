import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
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

      return response.data.data; 
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
export const ExportEmployesExcel = createAsyncThunk(
  "employe/exportExcel",
  async ({start,end},{rejectWithValue}) =>{
    try {
      const response = await axios.get(
        `http://localhost:3000/users/export/excel/${start}/${end}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      console.log("Fichier PDF téléchargé :", response);
      return response.data;
     
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
      
    }

  }

);
export const ExportEmployesPdf = createAsyncThunk(
  "employe/exportPdf",
  async ({ start, end }, { rejectWithValue }) => {
    try {
     
      const response = await axios.get(
        `http://localhost:3000/users/export/pdf/${start}/${end}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      console.log("Fichier PDF téléchargé :", response);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const deleteEmployeAction = createAsyncThunk(
  "employe/delete",
  async (id, { rejectWithValue }) => {
    try {
   
      await axios.delete(`http://localhost:3000/users/${id}`, {
        withCredentials: true,
      });
      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la suppression");
    }
  }
);
export const ImportEmployesExcel = createAsyncThunk(
  "employe/importExcel",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:3000/users/import/excel",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // backend retourne juste la liste des users créés (array d'objets users)
      return response.data.data; // ou juste response.data selon ton controller
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de l'import Excel"
      );
    }
  }
);
export const UpdateEmployeAction = createAsyncThunk(
  "employe/update",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      console.log("[UpdateEmployeAction] → Reçu :", { id, userData });

      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("address", userData.address);
      formData.append("phone", userData.phone);
      formData.append("role", userData.role);
      formData.append("domain", userData.domain);

      if (userData.image instanceof File) {
        formData.append("image", userData.image);
        console.log("[UpdateEmployeAction] → Image file ajoutée :", userData.image.name);
      } else {
        console.log("[UpdateEmployeAction] → Aucun nouveau fichier image.");
      }

      const response = await axios.patch(
        `http://localhost:3000/users/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("[UpdateEmployeAction] → Réponse du backend :", response.data);
      return response.data.data;
    } catch (error) {
      console.error("[UpdateEmployeAction] → Erreur :", error);
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de la modification"
      );
    }
  }
);



