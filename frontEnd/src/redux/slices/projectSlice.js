// slices/projectSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProjects,
  fetchProjectById,
  fetchProjectsByUser,
  fetchProjectsByCategory,
  createProject,
  updateProject,
  deleteProject,
} from "../actions/projectActions";

const projectInitialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  success: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState: projectInitialState,
  reducers: {
    clearProjectMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedProject(state) {
      state.selectedProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des projets.";
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.selectedProject = null;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.selectedProject = null;
        state.error = action.payload || "Erreur lors du chargement du projet.";
      })

      // Fetch by user
      .addCase(fetchProjectsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des projets utilisateur.";
      })

      // Fetch by category
      .addCase(fetchProjectsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des projets catégorie.";
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.success = "Projet ajouté avec succès.";
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la création du projet.";
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map(p => p._id === action.payload._id ? action.payload : p);
        state.success = "Projet mis à jour.";
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la modification du projet.";
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload._id);
        state.success = "Projet supprimé.";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la suppression du projet.";
      });
  }
});

export const { clearProjectMessages, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
