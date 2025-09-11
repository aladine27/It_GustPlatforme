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
  /* 👉 nouveau */
  canDrag = false,
}) => {
  return (
<Box
  sx={{
    display: "flex",
    flexWrap: "nowrap",
    gap: { xs: 0.7, md: 2 },
    alignItems: "flex-start",
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
    overscrollBehaviorX: "contain",
    pr: 2,
    pb: 1,
    minHeight: 450,
    width: "100%",

    // === Scrollbar bleu identique à Evenement ===
    scrollbarWidth: "thin",                                        // Firefox
    scrollbarColor: (theme) => `${theme.palette.primary.main} transparent`,
    "&::-webkit-scrollbar": { height: 8 },                         // Chrome/Edge
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: (theme) => theme.palette.primary.main,      // bleu
      borderRadius: 8,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: (theme) => theme.palette.primary.dark,      // bleu + foncé
    },
    "&::-webkit-scrollbar-corner": { background: "transparent" },
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
          canDrag={canDrag}
        />
      ))}
    </Box>
  );
};

export default KanbanBoard;
