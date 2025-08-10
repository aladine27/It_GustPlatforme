import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllApplications,
  fetchApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  fetchApplicationsByJobOffre,
} from "../actions/applicationAction";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    list: [],
    one: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchAllApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false; state.list = action.payload; state.error = null;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // fetch by id
      .addCase(fetchApplicationById.pending, (state) => { state.loading = true; })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false; state.one = action.payload; state.error = null;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // create
      .addCase(createApplication.pending, (state) => { state.loading = true; })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false; state.list.push(action.payload); state.error = null;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // update
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((app) => app._id === action.payload._id ? action.payload : app);
        if (state.one && state.one._id === action.payload._id) {
          state.one = action.payload;
        }
        state.error = null;
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // delete
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((app) => app._id !== action.meta.arg);
        if (state.one && state.one._id === action.meta.arg) state.one = null;
        state.error = null;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(fetchApplicationsByJobOffre.pending, (state) => { state.loading = true; })
      .addCase(fetchApplicationsByJobOffre.fulfilled, (state, action) => {
        state.loading = false; state.list = action.payload; state.error = null;
        })
      .addCase(fetchApplicationsByJobOffre.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
        });
  },
});

export const applicationReducer = applicationSlice.reducer;
