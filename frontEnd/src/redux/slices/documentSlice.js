// slices/documentSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllDocuments,
  fetchDocumentById,
  fetchDocumentsByUser,
  createDocument,
  updateDocument,
  deleteDocument,
  fetchDocumentTemplate,
} from "../actions/documentAction";

const documentInitialState = {
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
  success: null,
  documentTemplate: null,
};

export const documentSlice = createSlice({
  name: "document",
  initialState: documentInitialState,
  reducers: {
    clearDocumentMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedDocument(state) {
      state.selectedDocument = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all documents
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
        state.error = null;
      })
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des documents.";
      })

      // Fetch by ID
      .addCase(fetchDocumentById.pending, (state) => {
        state.loading = true;
        state.selectedDocument = null;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDocument = action.payload;
        state.error = null;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.selectedDocument = null;
        state.error = action.payload || "Erreur lors du chargement du document.";
      })

      // Fetch by User
      .addCase(fetchDocumentsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
        state.error = null;
      })
      .addCase(fetchDocumentsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des documents utilisateur.";
      })

      // Create document
      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
        state.success = "Document ajouté avec succès.";
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la création du document.";
      })

      // Update document
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.map(d => d._id === action.payload._id ? action.payload : d);
        state.success = "Document mis à jour.";
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la modification.";
      })

      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(d => d._id !== action.payload._id);
        state.success = "Document supprimé.";
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la suppression.";
      })
      .addCase(fetchDocumentTemplate.pending, (state) => {
        state.loading = true;
        state.documentTemplate = null;
        state.error = null;
      })
      .addCase(fetchDocumentTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.documentTemplate = action.payload; // HTML string
        state.error = null;
      })
      .addCase(fetchDocumentTemplate.rejected, (state, action) => {
        state.loading = false;
        state.documentTemplate = null;
        state.error = action.payload || "Erreur lors de la génération du template.";
      })
  }
});

export const { clearDocumentMessages, clearSelectedDocument } = documentSlice.actions;
export default documentSlice.reducer;
