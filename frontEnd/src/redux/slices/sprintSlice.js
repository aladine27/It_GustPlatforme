import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllSprints,
  fetchSprintsByProject,
  fetchSprintById,
  createSprint,
  updateSprint,
  deleteSprint
} from "../actions/sprintActions";

const initialState = {
  sprints: [],
  selectedSprint: null,
  loading: false,
  error: false,
  successMessage: null,
  errorMessage: null
};

const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    clearSprintMessages(state) {
      state.errorMessage = null;
      state.successMessage = null;
    },
    clearSelectedSprint(state) {
      state.selectedSprint = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSprints.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllSprints.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = action.payload;
        state.error = false;
        state.errorMessage = null;
      })
      .addCase(fetchAllSprints.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchSprintsByProject.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchSprintsByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = action.payload;
        state.error = false;
      })
      .addCase(fetchSprintsByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchSprintById.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.selectedSprint = null;
      })
      .addCase(fetchSprintById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSprint = action.payload;
        state.error = false;
      })
      .addCase(fetchSprintById.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        state.selectedSprint = null;
      })
      .addCase(createSprint.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
      })
      .addCase(createSprint.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints.push(action.payload);
        state.error = false;
        state.successMessage = "Sprint créé avec succès.";
      })
      .addCase(createSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateSprint.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
      })
      .addCase(updateSprint.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = state.sprints.map(s => s._id === action.payload._id ? action.payload : s);
        state.error = false;
        state.successMessage = "Sprint modifié avec succès.";
      })
      .addCase(updateSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteSprint.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
      })
      .addCase(deleteSprint.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = state.sprints.filter(s => s._id !== action.payload._id);
        state.error = false;
        state.successMessage = "Sprint supprimé avec succès.";
      })
      .addCase(deleteSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      });
  }
});

export const { clearSprintMessages, clearSelectedSprint } = sprintSlice.actions;
export default sprintSlice.reducer;
