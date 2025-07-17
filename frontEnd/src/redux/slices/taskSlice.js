import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTaskById,
  fetchTasksByUser,
  createTask,
  updateTask,
  deleteTask,
  fetchTasksBySprint,
  updateTaskStatus,
} from "../actions/taskAction";

// Helper pour grouper par status (Kanban)
function groupTasksByColumn(tasks) {
  const columns = { backlog: [], inProgress: [], review: [], done: [] };
  if (!tasks) return columns;
  tasks.forEach((task) => {
    const col = task.status || "backlog";
    // IMPORTANT: Utilisez _id comme id pour la cohérence
    const t = { ...task, id: String(task._id) };
    if (!columns[col]) columns[col] = [];
    columns[col].push(t);
  });
  return columns;
}

const initialState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  success: null,
  // Pour Kanban
  tasksByColumn: { backlog: [], inProgress: [], review: [], done: [] },
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearTaskMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearSelectedTask(state) {
      state.selectedTask = null;
    },
    // Optimistic update pour drag & drop
    moveTaskColumn(state, action) {
      const { taskId, sourceCol, destCol, destIndex } = action.payload;
      console.log("[taskSlice] moveTaskColumn:", action.payload);
      
      // Cherche la tâche à déplacer
      const task = state.tasksByColumn[sourceCol]?.find((t) => t.id === taskId || t._id === taskId);
      if (!task) {
        console.log("[taskSlice] Task not found:", taskId);
        return;
      }

      // Retire la tâche de la colonne source
      state.tasksByColumn[sourceCol] = state.tasksByColumn[sourceCol].filter(
        (t) => t.id !== taskId && t._id !== taskId
      );

      // Modifie le status localement
      const updatedTask = { ...task, status: destCol, id: String(task._id) };

      // Assure-toi que la colonne destination existe
      if (!state.tasksByColumn[destCol]) {
        state.tasksByColumn[destCol] = [];
      }

      // Insère dans la colonne destination à la bonne position
      state.tasksByColumn[destCol].splice(destIndex, 0, updatedTask);

      // Met à jour dans le tableau "flat"
      state.tasks = state.tasks.map((t) => 
        (t.id === taskId || t._id === taskId) ? { ...t, status: destCol } : t
      );

      console.log("[taskSlice] Updated tasksByColumn:", state.tasksByColumn);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.selectedTask = null;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
        state.error = null;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.selectedTask = null;
        state.error = action.payload;
      })
    
      .addCase(fetchTasksByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.tasksByColumn = groupTasksByColumn(action.payload);
        state.error = null;
      })
      .addCase(fetchTasksByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by Sprint (Kanban)
      .addCase(fetchTasksBySprint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksBySprint.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.tasksByColumn = groupTasksByColumn(action.payload);
        state.error = null;
        console.log("[taskSlice] fetchTasksBySprint fulfilled, tasksByColumn:", state.tasksByColumn);
      })
      .addCase(fetchTasksBySprint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.success = "Tâche ajoutée !";
        // Met à jour les colonnes Kanban aussi
        state.tasksByColumn = groupTasksByColumn(state.tasks);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((t) => t._id === action.payload._id ? action.payload : t);
        state.success = "Tâche mise à jour !";
        state.tasksByColumn = groupTasksByColumn(state.tasks);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload._id);
        state.success = "Tâche supprimée !";
        state.tasksByColumn = groupTasksByColumn(state.tasks);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Kanban column (MAJ status - backend)
      .addCase(updateTaskStatus.pending, (state) => {
        // Ne pas mettre loading = true ici pour éviter les re-renders
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Tâche déplacée !";
        // Optionnel: Synchroniser avec la réponse du backend
        if (action.payload) {
          state.tasks = state.tasks.map((t) => 
            t._id === action.payload._id ? action.payload : t
          );
          state.tasksByColumn = groupTasksByColumn(state.tasks);
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("[taskSlice] updateTaskStatus failed:", action.payload);
      });
  },
});

export const { clearTaskMessages, clearSelectedTask, moveTaskColumn } = taskSlice.actions;
export default taskSlice.reducer;