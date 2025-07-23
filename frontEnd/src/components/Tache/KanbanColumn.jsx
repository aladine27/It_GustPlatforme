import { Box, Typography, Chip, Button, Paper } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TaskDetailsModal from "./TaskDetailModal";
import { useState } from "react";
/**
 * Composant KanbanColumn
 * Affiche une colonne de Kanban (Backlog, In Progress, Done...)
 * Avec drag & drop (react-beautiful-dnd), design cohérent avec TaskCard, Sprint, Projet
 */
const KanbanColumn = ({ column, tasks, isDragging, colWidth }) => {
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);
const handleOpenTaskDetails = (task) => {
  setSelectedTask(task);
  setOpenTaskDetails(true);
};

  // --- Export PDF : exporte toutes les tâches de la colonne au format PDF ---
  function exportTasksToPDF(tasks) {
    const doc = new jsPDF();
    doc.text("Tâches terminées", 14, 16);

    // Colonnes du tableau exporté
    const tableColumn = ["Titre", "Description", "Priorité", "Affectée à"];
    // Données de chaque ligne
    const tableRows = tasks.map((task) => [
      task.title || "",
      task.description || "",
      task.priority || "",
      (task.user && (task.user.fullName || task.user.name)) || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
    });

    doc.save("done_tasks.pdf");
  }

  return (
    // --- Conteneur principal : la colonne, même style que TaskCard/Projet/Sprint ---
    <Paper
      elevation={isDragging ? 6 : 3} // Ombre plus forte si drag&drop en cours
      variant="elevation"
      sx={{
        minWidth: colWidth,                 // Largeur minimum, responsive selon props
        bgcolor: "#fbfbfbff",               // Fond clair identique à Projet/Sprint
        borderRadius: 2,                    // Arrondi identique
        p: 3,                               // Padding interne
        border: "1.5px solid #e6eafd",      // Bordure cohérente avec les autres cards
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* --- En-tête de la colonne (titre, nombre de tâches, bouton export PDF) --- */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3
      }}>
        {/* Titre de la colonne */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: column.color, fontSize: "1.14rem" }}
        >
          {column.title}
        </Typography>
        {/* Badge nombre de tâches + bouton Exporter (si colonne Done) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          {/* Bouton Exporter PDF, visible seulement sur la colonne Done */}
          {column.id === "done" && tasks.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              sx={{ ml: 1, px: 1, minWidth: 0, textTransform: "none" }}
              onClick={() => exportTasksToPDF(tasks)}
            >
              Exporter
            </Button>
          )}
        </Box>
      </Box>

      {/* --- Bloc Droppable : zone réceptacle pour les KanbanTaskCard draggable --- */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 200, // Toujours minimum 200px, même vide
              bgcolor: snapshot.isDraggingOver ? "rgba(0,0,0,0.05)" : "transparent",
              borderRadius: 2,
              transition: "background-color 0.2s ease",
              p: snapshot.isDraggingOver ? 1 : 0,
              boxSizing: "border-box",
            }}
          >
            {/* --- Cartes de tâches draggable --- */}
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
                    {/* KanbanTaskCard : le composant tâche individuel */}
                    <KanbanTaskCard
                      task={task}
                      isDragging={snapshot.isDragging}
                      onDetails={handleOpenTaskDetails} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {/* Placeholder pour que le drag&drop ne casse pas la colonne */}
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
