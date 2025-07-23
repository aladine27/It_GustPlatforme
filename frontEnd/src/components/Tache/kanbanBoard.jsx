import { Box } from "@mui/material";
import KanbanColumn from "./KanbanColumn";

const KANBAN_COL_WIDTH = 300;

const KanbanBoard = ({ columns, tasksByColumn, isDragging }) => {

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 0.7, md: 2 },
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