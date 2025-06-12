import { createSlice } from "@reduxjs/toolkit";
import { FetchEmployesAction,CreateUserAction,FetchEmployesBySearchAction } from "../actions/employeAction";

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
    // tu pourras ajouter d’autres reducers ici (ex: clear list, etc.)
  },
  extraReducers: (builder) => {
    builder
      // début de l’appel
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
  },
});


export default employeSlice.reducer;
