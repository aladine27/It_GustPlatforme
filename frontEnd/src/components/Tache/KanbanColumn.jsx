// KanbanColumn.jsx
import { Box, Typography, Chip, Button, Paper } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";
import DownloadIcon from "@mui/icons-material/Download";
import autoTable from "jspdf-autotable";
import TaskDetailsModal from "./TaskDetailModal";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const KanbanColumn = ({
  column,
  tasks,
  isDragging,
  colWidth,
  isAdminOrManager,
  onEditTask,      // DOIT recevoir une task en param
  onDeleteTask,    // DOIT recevoir une task en param
}) => {
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Ouvre la modale de détails
  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
    setOpenTaskDetails(true);
  };

  // Export EXcel
  function exportTasksToExcel(tasks) {
  const tableRows = tasks.map((task) => ({
    "Titre": task.title || "",
    "Description": task.description || "",
    "Priorité": task.priority || "",
    "Affectée à": (task.user && (task.user.fullName || task.user.name)) || "",
  }));
  const worksheet = XLSX.utils.json_to_sheet(tableRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tâches terminées");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "done_tasks.xlsx");
}


  return (
    <Paper
      elevation={isDragging ? 6 : 3}
      variant="elevation"
      sx={{
        minWidth: colWidth,
         background:"#e3f2fd",
        borderRadius: 2,
        p: 3,
        border: "1.5px solid #e6eafd",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{
        display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3
      }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: column.color, fontSize: "1.14rem" }}>
          {column.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label={tasks.length} size="small" sx={{
            bgcolor: "rgba(0,0,0,0.1)", color: "#666", fontWeight: 600, minWidth: 24, height: 24,
          }} />
          {column.id === "done" && tasks.length > 0 && (

  <Button
    variant="outlined"
    size="small"
    startIcon={<DownloadIcon />}
    sx={{ ml: 1, px: 1, minWidth: 0, textTransform: "none" }}
    onClick={() => exportTasksToExcel(tasks)}
  >
    Exporter
  </Button>


          )}
        </Box>
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
            {tasks.map((task, index) => (
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
               
                    <KanbanTaskCard
                      task={task}
                      isDragging={snapshot.isDragging}
                      onDetails={handleOpenTaskDetails}
                      isAdminOrManager={isAdminOrManager}
                      onEdit={() => onEditTask(task)}           
                      onDelete={() => onDeleteTask(task)}      
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <TaskDetailsModal
        open={openTaskDetails}
        handleClose={() => setOpenTaskDetails(false)}
        task={selectedTask}
      />
    </Paper>
  );
};

export default KanbanColumn;
