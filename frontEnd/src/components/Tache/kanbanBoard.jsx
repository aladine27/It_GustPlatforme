import { Box } from "@mui/material";
import KanbanColumn from "./KanbanColumn";

const KANBAN_COL_WIDTH = 340;

const KanbanBoard = ({ columns, tasksByColumn, isDragging }) => (
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
        tasks={tasksByColumn[col.id]}
        isDragging={isDragging}
        colWidth={KANBAN_COL_WIDTH}
      />
    ))}
  </Box>
);

export default KanbanBoard;
