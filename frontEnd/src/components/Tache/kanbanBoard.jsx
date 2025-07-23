import { Box } from "@mui/material";
import KanbanColumn from "./KanbanColumn";

const KANBAN_COL_WIDTH = 300;

const KanbanBoard = ({
  columns,
  tasksByColumn,
  isDragging,
  isAdminOrManager,
  onEditTask,
  onDeleteTask,
}) => {
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
          tasks={tasksByColumn[col.id] || []}
          isDragging={isDragging}
          colWidth={KANBAN_COL_WIDTH}
          isAdminOrManager={isAdminOrManager}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </Box>
  );
};

export default KanbanBoard;
