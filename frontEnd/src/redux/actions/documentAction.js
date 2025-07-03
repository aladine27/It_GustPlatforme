// actions/documentActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAllDocuments = createAsyncThunk(
  "document/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/document", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  "document/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchDocumentsByUser = createAsyncThunk(
  "document/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/document/findDocumentByUserId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createDocument = createAsyncThunk(
  "document/create",
  async (docData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // log pour debug
      console.log("🚀 [createDocument] payload envoyé :", docData);
      const res = await axios.post(
        "http://localhost:3000/document",
        docData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      return res.data.data;
    } catch (err) {
      console.error("❌ [createDocument] erreur axios :", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDocument = createAsyncThunk(
  "document/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:3000/document/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "document/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:3000/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const fetchDocumentTemplate = createAsyncThunk(
  "document/fetchTemplate",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/document/${id}/template`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data; // le html string
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    });
    export const generatePdfFromHtml = createAsyncThunk(
      "document/generatePdfFromHtml",
      async ({ id, html }, { rejectWithValue }) => {
        try {
          const token = localStorage.getItem("token");
          console.log("[generatePdfFromHtml] id:", id);
          console.log("[generatePdfFromHtml] html:", html?.substring(0, 200)); // Affiche le début de l'html
    
          const res = await axios.post(
            `http://localhost:3000/document/${id}/generate-pdf`,
            { html },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("[generatePdfFromHtml] Réponse:", res.data);
          return res.data.data; // Retourne le doc mis à jour (avec file généré)
        } catch (err) {
          console.error("[generatePdfFromHtml] Erreur axios:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
          });
          return rejectWithValue(err.response?.data?.message || err.message);
        }
      }
    );