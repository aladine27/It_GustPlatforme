import { Box } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
// RETIREZ le DragDropContext import et useDispatch car maintenant géré dans Tache.jsx

const KANBAN_COL_WIDTH = 340;

const KanbanBoard = ({ columns, tasksByColumn, isDragging }) => {
  // Ajoute des logs pour voir le contenu
  console.log("[KanbanBoard] columns:", columns);
  console.log("[KanbanBoard] tasksByColumn:", tasksByColumn);

  // RETIREZ le handleDragEnd - maintenant géré dans le parent (Tache.jsx)

  return (
    // RETIREZ le DragDropContext - maintenant dans le parent
    <Box
      sx={{
        display: "flex",
        gap: { xs: 2, md: 4 },
        alignItems: "flex-start",
        overflowX: "auto",
        pb: 2,
        minHeight: 450,
      }}
    >
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          tasks={tasksByColumn[col.id] || []} // Ajout de fallback
          isDragging={isDragging}
          colWidth={KANBAN_COL_WIDTH}
        />
      ))}
    </Box>
  );
};

export default KanbanBoard;