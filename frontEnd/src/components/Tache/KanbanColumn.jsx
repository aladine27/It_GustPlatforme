import { Box, Typography, Chip, Button, Paper } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";
import DownloadIcon from "@mui/icons-material/Download";
import autoTable from "jspdf-autotable";
import TaskDetailsModal from "./TaskDetailModal";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const KanbanColumn = ({
  column,
  tasks,
  isDragging,
  colWidth,
  isAdminOrManager,
  onEditTask,
  onDeleteTask,
  canDrag = false,
}) => {
  const role =
    useSelector((state) => state.user?.CurrentUser?.role || state.user?.CurrentUser?.user?.role) || "";

  // ⬇️ Récupère tous les projets (déjà chargés ailleurs via fetchAllProjects)
  const projects = useSelector((s) => s.project?.projects || []);

  // ⬇️ Calcule le titre du projet auquel appartiennent les tâches de cette colonne
  const projectTitle = useMemo(() => {
    if (!tasks?.length) return "Projet";
    const pid =
      tasks[0]?.project?._id || // cas population
      tasks[0]?.project ||      // cas ObjectId string
      null;

    const p = projects.find((x) => String(x._id) === String(pid));
    return p?.title || tasks[0]?.project?.title || "Projet";
  }, [projects, tasks]);

  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
    setOpenTaskDetails(true);
  };

  function exportTasksToExcel(tasks, projectTitleArg) {
    // 1) Titre du projet (essaie de le déduire si non fourni)
    const derivedTitle =
      projectTitleArg ||
      tasks?.[0]?.project?.title ||
      tasks?.[0]?.projectTitle ||
      (typeof document !== "undefined" ? document.title : "") ||
      "Projet";

    // 2) Prépare données
    const headers = ["Titre", "Description", "Priorité", "Affectée à"];
    const rows = tasks.map((task) => ([
      task.title || "",
      task.description || "",
      task.priority || "",
      (task.user && (task.user.fullName || task.user.name)) || "",
    ]));

    // 3) Construit la feuille via AOA
    // Lignes :
    // A1: "ITGUST" (fusionnée A1:D1)
    // A2: "Projet : <titre> — Export du <date>" (fusionnée A2:D2)
    // A3: vide
    // A4: en-têtes
    // A5...: données
    const dateStr = new Date().toLocaleDateString("fr-TN");
    const companyRow = ["ITGUST"];
    const titleRow = [`Projet : ${derivedTitle} — Export du ${dateStr}`];

    const worksheet = XLSX.utils.aoa_to_sheet([companyRow, titleRow, [], headers, ...rows]);

    // 4) Fusions pour les deux premières lignes
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // A1:D1  (ITGUST)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // A2:D2  (titre projet + date)
    ];

    // 5) Largeurs de colonnes (optionnel)
    worksheet["!cols"] = [
      { wch: 30 }, // Titre
      { wch: 60 }, // Description
      { wch: 12 }, // Priorité
      { wch: 28 }, // Affectée à
    ];

    // 6) Crée le classeur et exporte
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: column.color, fontSize: "1.14rem" }}>
          {column.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={tasks.length}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.1)", color: "#666", fontWeight: 600, minWidth: 24, height: 24 }}
          />
          {column.id === "done" && tasks.length > 0 && role === "Employe" && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              sx={{ ml: 1, px: 1, minWidth: 0, textTransform: "none" }}
              onClick={() => exportTasksToExcel(tasks, projectTitle)}
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
                isDragDisabled={!canDrag}
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
