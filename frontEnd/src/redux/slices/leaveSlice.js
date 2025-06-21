import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllLeaves,
  fetchLeaveById,
  fetchLeavesByUser,
  createLeave,
  updateLeave,
  deleteLeave,
  fetchAllLeaveTypes,
  fetchLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
} from "../actions/LeaveAction";

// --- LEAVES ---
const leaveInitialState = {
  leaves: [],
  selectedLeave: null,
  loading: false,
  error: null,
  success: null,
};

export const leaveSlice = createSlice({
  name: "leave",
  initialState: leaveInitialState,
  reducers: {
    clearLeaveMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedLeave(state) {
      state.selectedLeave = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leaves
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
        state.error = null;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des congés.";
      })

      // Fetch leave by ID
      .addCase(fetchLeaveById.pending, (state) => {
        state.loading = true;
        state.selectedLeave = null;
        state.error = null;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLeave = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.selectedLeave = null;
        state.error = action.payload || "Erreur lors du chargement du congé.";
      })

      // Fetch leaves by User
      .addCase(fetchLeavesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeavesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
        state.error = null;
      })
      .addCase(fetchLeavesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des congés de l'utilisateur.";
      })

      // Create leave
      .addCase(createLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.push(action.payload);
        state.success = "Congé ajouté avec succès.";
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la création du congé.";
      })

      // Update leave
      .addCase(updateLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = state.leaves.map(l => l._id === action.payload._id ? action.payload : l);
        state.success = "Congé mis à jour.";
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la modification du congé.";
      })

      // Delete leave
      .addCase(deleteLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = state.leaves.filter(l => l._id !== action.payload._id);
        state.success = "Congé supprimé.";
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la suppression du congé.";
      });
  }
});


const leaveTypeInitialState = {
  leaveTypes: [],
  selectedType: null,
  loading: false,
  error: null,
  success: null,
};

export const leaveTypeSlice = createSlice({
  name: "leaveType",
  initialState: leaveTypeInitialState,
  reducers: {
    clearLeaveTypeMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedType(state) {
      state.selectedType = null;
    }
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchAllLeaveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllLeaveTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchAllLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors du chargement des types de congé.";
      })

      
      .addCase(fetchLeaveTypeById.pending, (state) => {
        state.loading = true;
        state.selectedType = null;
        state.error = null;
      })
      .addCase(fetchLeaveTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedType = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaveTypeById.rejected, (state, action) => {
        state.loading = false;
        state.selectedType = null;
        state.error = action.payload || "Erreur lors du chargement du type de congé.";
      })

    
      .addCase(createLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes.push(action.payload);
        state.success = "Type de congé ajouté.";
      })
      .addCase(createLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de l'ajout du type de congé.";
      })

      
      .addCase(updateLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = state.leaveTypes.map(type => type._id === action.payload._id ? action.payload : type);
        state.success = "Type de congé mis à jour.";
      })
      .addCase(updateLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la modification du type de congé.";
      })

     
      .addCase(deleteLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = state.leaveTypes.filter(type => type._id !== action.payload._id);
        state.success = "Type de congé supprimé.";
      })
      .addCase(deleteLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur lors de la suppression du type de congé.";
      });
  }
});

export const { clearLeaveMessages, clearSelectedLeave } = leaveSlice.actions;
export const { clearLeaveTypeMessages, clearSelectedType } = leaveTypeSlice.actions;
