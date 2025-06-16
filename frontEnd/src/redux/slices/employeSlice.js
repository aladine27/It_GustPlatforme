import { createSlice } from "@reduxjs/toolkit";
import { FetchEmployesAction,CreateUserAction,FetchEmployesBySearchAction,ExportEmployesExcel,ExportEmployesPdf,deleteEmployeAction } from "../actions/employeAction";

const initialState = {
  list: [],           // liste des employés
  loading: false,     // en cours de chargement
  error: false,       // true si erreur
  errorMessage: null, // message d’erreur
};

const employeSlice = createSlice({
  name: "employe",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(FetchEmployesAction.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = null;
      })
      // succès
      .addCase(FetchEmployesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = false;
        state.errorMessage = null;
      })
      // échec
      .addCase(FetchEmployesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload || "Impossible de charger les employés";
      })
      .addCase(CreateUserAction.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = null;
      })
      .addCase(CreateUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // ajout du nouvel utilisateur
        state.error = false;
        state.errorMessage = null;
      })
      .addCase(CreateUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(FetchEmployesBySearchAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchEmployesBySearchAction.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(FetchEmployesBySearchAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(ExportEmployesExcel.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(ExportEmployesExcel.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(ExportEmployesExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload || "Erreur export Excel";
      })
      
      .addCase(ExportEmployesPdf.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(ExportEmployesPdf.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(ExportEmployesPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload || "Erreur export PDF";
      })
      .addCase(deleteEmployeAction.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = null;
      })
      .addCase(deleteEmployeAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.list = state.list.filter(emp => emp._id !== action.payload);
      })
      .addCase(deleteEmployeAction.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
  },
});


export default employeSlice.reducer;
