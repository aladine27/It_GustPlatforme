import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllJobOffres,
  fetchJobOffreById,
  fetchJobOffreByUser,
  fetchJobOffreByCategory,
  createJobOffre,
  updateJobOffre,
  deleteJobOffre,
  fetchAllJobCategories,
  fetchJobCategoryById,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
} from "../actions/JobOffreAction";

const jobOffreSlice = createSlice({
  name: "jobOffre",
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
      .addCase(fetchAllJobOffres.pending, (state) => { state.loading = true; })
      .addCase(fetchAllJobOffres.fulfilled, (state, action) => {
        state.loading = false; state.list = action.payload; state.error = null;
      })
      .addCase(fetchAllJobOffres.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // fetch by id
      .addCase(fetchJobOffreById.pending, (state) => { state.loading = true; })
      .addCase(fetchJobOffreById.fulfilled, (state, action) => {
        state.loading = false; state.one = action.payload; state.error = null;
      })
      .addCase(fetchJobOffreById.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // create
      .addCase(createJobOffre.pending, (state) => { state.loading = true; })
      .addCase(createJobOffre.fulfilled, (state, action) => {
        state.loading = false; state.list.push(action.payload); state.error = null;
      })
      .addCase(createJobOffre.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // update
      .addCase(updateJobOffre.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((job) => job._id === action.payload._id ? action.payload : job);
        state.error = null;
      })
      // delete
      .addCase(deleteJobOffre.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((job) => job._id !== action.meta.arg);
        state.error = null;
      })
      // fetch by user & category
      .addCase(fetchJobOffreByUser.fulfilled, (state, action) => {
        state.loading = false; state.list = action.payload; state.error = null;
      })
      .addCase(fetchJobOffreByCategory.fulfilled, (state, action) => {
        state.loading = false; state.list = action.payload; state.error = null;
      });
  },
});

// --------- JOB CATEGORY SLICE ---------

const jobCategorySlice = createSlice({
  name: "jobCategory",
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
      .addCase(fetchAllJobCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchAllJobCategories.fulfilled, (state, action) => {
        state.loading = false; state.list = action.payload; state.error = null;
      })
      .addCase(fetchAllJobCategories.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // fetch by id
      .addCase(fetchJobCategoryById.pending, (state) => { state.loading = true; })
      .addCase(fetchJobCategoryById.fulfilled, (state, action) => {
        state.loading = false; state.one = action.payload; state.error = null;
      })
      .addCase(fetchJobCategoryById.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // create
      .addCase(createJobCategory.pending, (state) => { state.loading = true; })
      .addCase(createJobCategory.fulfilled, (state, action) => {
        state.loading = false; state.list.push(action.payload); state.error = null;
      })
      .addCase(createJobCategory.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      // update
      .addCase(updateJobCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((cat) => cat._id === action.payload._id ? action.payload : cat);
        state.error = null;
      })
      // delete
      .addCase(deleteJobCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((cat) => cat._id !== action.meta.arg);
        state.error = null;
      });
  },
});


export const jobOffreReducer = jobOffreSlice.reducer;
export const jobCategoryReducer = jobCategorySlice.reducer;