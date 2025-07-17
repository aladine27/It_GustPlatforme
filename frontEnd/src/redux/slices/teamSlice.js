import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllTeams,
  fetchTeamsByProject,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from "../actions/teamActions";

const initialState = {
  teams: [],             
  selectedTeam: null,
  loading: false,
  error: false,
  successMessage: null,
  errorMessage: null
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearTeamMessages(state) {
      state.errorMessage = null;
      state.successMessage = null;
    },
    clearSelectedTeam(state) {
      state.selectedTeam = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTeams.pending, (state) => {
        state.loading = true;
        state.error = false;
        console.log("[teamSlice] fetchAllTeams.pending");
      })
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
        state.error = false;
        state.errorMessage = null;
        console.log("[teamSlice] fetchAllTeams.fulfilled - payload:", action.payload);
      })
      .addCase(fetchAllTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        console.log("[teamSlice] fetchAllTeams.rejected - error:", action.payload);
      })

      .addCase(fetchTeamsByProject.pending, (state) => {
        state.loading = true;
        state.error = false;
        console.log("[teamSlice] fetchTeamsByProject.pending");
      })
      .addCase(fetchTeamsByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
        state.error = false;
        console.log("[teamSlice] fetchTeamsByProject.fulfilled - payload:", action.payload);
      })
      .addCase(fetchTeamsByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        console.log("[teamSlice] fetchTeamsByProject.rejected - error:", action.payload);
      })

      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.selectedTeam = null;
        console.log("[teamSlice] fetchTeamById.pending");
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload;
        state.error = false;
        console.log("[teamSlice] fetchTeamById.fulfilled - payload:", action.payload);
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        state.selectedTeam = null;
        console.log("[teamSlice] fetchTeamById.rejected - error:", action.payload);
      })

      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
        console.log("[teamSlice] createTeam.pending");
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
        state.error = false;
        state.successMessage = "Team créée avec succès.";
        console.log("[teamSlice] createTeam.fulfilled - payload:", action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        console.log("[teamSlice] createTeam.rejected - error:", action.payload);
      })

      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
        console.log("[teamSlice] updateTeam.pending");
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = state.teams.map(t => t._id === action.payload._id ? action.payload : t);
        state.error = false;
        state.successMessage = "Team modifiée avec succès.";
        console.log("[teamSlice] updateTeam.fulfilled - payload:", action.payload);
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        console.log("[teamSlice] updateTeam.rejected - error:", action.payload);
      })

      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = null;
        console.log("[teamSlice] deleteTeam.pending");
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = state.teams.filter(t => t._id !== action.payload._id);
        state.error = false;
        state.successMessage = "Team supprimée avec succès.";
        console.log("[teamSlice] deleteTeam.fulfilled - payload:", action.payload);
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
        console.log("[teamSlice] deleteTeam.rejected - error:", action.payload);
      });
  }
});

export const { clearTeamMessages, clearSelectedTeam } = teamSlice.actions;
export default teamSlice.reducer;
