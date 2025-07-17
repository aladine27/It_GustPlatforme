import { Box, Typography, Chip } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";
import { StyledCard } from "../../style/style";

const KanbanColumn = ({ column, tasks, isDragging, colWidth }) => {
 
  console.log(`[KanbanColumn] column: ${column.id}, tasks:`, tasks);

  return (
    <StyledCard
      sx={{
        minWidth: colWidth,
        bgcolor: "#e3f2fd",
        borderRadius: "1.5",
        p: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.09)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: column.color, fontSize: "1.14rem" }}
        >
          {column.title}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{
            bgcolor: "rgba(0,0,0,0.1)",
            color: "#666",
            fontWeight: 600,
            minWidth: 24,
            height: 24,
          }}
        />
      </Box>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 200,
              bgcolor: snapshot.isDraggingOver ? "rgba(0,0,0,0.05)" : "transparent",
              borderRadius: 2,
              transition: "background-color 0.2s ease",
              p: snapshot.isDraggingOver ? 1 : 0,
              boxSizing: "border-box",
            }}
          >
            {tasks.map((task, index) => {
              // Debug chaque tâche
              console.log(
                "[KanbanColumn] Draggable - task._id:",
                task._id,
                " index:",
                index
              );
              return (
                <Draggable
                  key={String(task._id)}
                  draggableId={String(task._id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <KanbanTaskCard task={task} isDragging={snapshot.isDragging} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </StyledCard>
  );
};

export default KanbanColumn;
