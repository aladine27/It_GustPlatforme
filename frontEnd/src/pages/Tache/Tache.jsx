import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, LinearProgress, Avatar, AvatarGroup, Typography,
  TextField, MenuItem, Tooltip
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import { StyledCard, Title } from "../../style/style";
import KanbanBoard from "../../components/Tache/kanbanBoard";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  fetchTasksBySprint,
  updateTaskStatus,
} from "../../redux/actions/taskAction";
import CreateTaskModal from "../../components/Tache/CreateTaskModal";
import { moveTaskColumn } from "../../redux/slices/taskSlice";
import { CircularProgress } from "@mui/material";
const columns = [
  { id: "backlog", title: "Backlog", color: "#f44336" },
  { id: "inProgress", title: "In Progress", color: "#ff9800" },
  { id: "review", title: "Review", color: "#4caf50" },
  { id: "done", title: "Done", color: "#9e9e9e" },
];

const getAvatarUrl = (user) => {
  if (!user) return "";
  if (user.image && user.image.startsWith("http")) return user.image + "?t=" + Date.now();
  if (user.image) return `http://localhost:3000/uploads/users/${encodeURIComponent(user.image)}?t=${Date.now()}`;
  if (user.avatar && user.avatar.startsWith("http")) return user.avatar + "?t=" + Date.now();
  return "";
};

const getInitials = (user) => {
  const name = user.fullName || user.name || "U";
  return name.split(" ").map(x => x[0]).join("").toUpperCase();
};

const Tache = ({ sprintId, isAdminOrManager, projectId }) => {
  const dispatch = useDispatch();
  const { tasksByColumn } = useSelector((state) => state.task);
  const { employes } = useSelector((state) => state.employe);
  const { sprints } = useSelector((state) => state.sprint);
  const { teams } = useSelector((state) => state.team);

  const sprint = (sprints || []).find(s => s._id === sprintId);
  const team = teams?.find(t => t._id === sprint?.team);

  // Extraction des membres (robuste)
  let teamMembers = [];
  if (team && Array.isArray(team.members) && team.members.length > 0) {
    teamMembers = team.members;
  } else if (team && Array.isArray(team.employeeList) && team.employeeList.length > 0) {
    teamMembers = team.employeeList;
  } else if (team && Array.isArray(team.users) && team.users.length > 0) {
    teamMembers = team.users;
  } else if (Array.isArray(employes) && employes.length > 0) {
    teamMembers = employes;
  }

  // Etat du filtre de priorité
  const [priorityFilter, setPriorityFilter] = useState(""); // "" = toutes

  // Charger les tâches à chaque changement de sprint
  useEffect(() => {
    if (sprintId) {
      dispatch(fetchTasksBySprint(sprintId));
    }
  }, [sprintId, dispatch]);

  // Calcul du progrès
  const totalTasks = Object.values(tasksByColumn || {}).flat().length || 0;
  const completedTasks = (tasksByColumn?.done || []).length || 0;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  // Modal Task
  const [openTaskModal, setOpenTaskModal] = useState(false);

  // Handler drag and drop
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    dispatch(moveTaskColumn({
      taskId: draggableId,
      sourceCol: source.droppableId,
      destCol: destination.droppableId,
      destIndex: destination.index
    }));

    if (source.droppableId !== destination.droppableId) {
      dispatch(updateTaskStatus({
        taskId: draggableId,
        newStatus: destination.droppableId,
      }));
    }
  };

  // Applique le filtre sur toutes les colonnes
  const filteredTasksByColumn = {};
  Object.keys(tasksByColumn || {}).forEach(col => {
    filteredTasksByColumn[col] = priorityFilter
      ? (tasksByColumn[col] || []).filter(
          task => (task.priority || "").toLowerCase() === priorityFilter
        )
      : (tasksByColumn[col] || []);
  });

  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        bgcolor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <StyledCard
        sx={{
          borderRadius: "1.5",
          boxShadow: "0 16px 56px rgba(50,100,255,0.10)",
          border: "1.5px solid #d5e7ff",
          background: "#fff",
          p: { xs: 1, md: 4 },
          width: "100%",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          {/* Titre centré */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              mb: 2,
            }}
          >
            <Title variant="h4" sx={{ textAlign: "center", width: "100%" }}>
              Sprint Planning & Task Management
            </Title>
          </Box>

          {/* Ligne : filtre à gauche, avatars + bouton à droite */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 2,
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {/* Filtre à gauche */}
            <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: "#1976d2" }}>
                Filtrer par priorité :
              </Typography>
              <TextField
                select
                size="small"
                label="Priorité"
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                sx={{ width: 160, background: "#fff" }}
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="high">Haute</MenuItem>
                <MenuItem value="medium">Moyenne</MenuItem>
                <MenuItem value="low">Faible</MenuItem>
              </TextField>
            </Box>

            {/* Avatars + bouton à droite */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 38, height: 38, fontWeight: 700, fontSize: 17 } }}>
                {teamMembers && teamMembers.map((u) => (
                  <Tooltip
                    key={u._id}
                    title={u.fullName}
                    arrow
                    placement="top"
                  >
                    <Avatar
                      src={getAvatarUrl(u)}
                      alt={u.fullName || u.name || "user"}
                      sx={{
                        bgcolor: "#1976d2",
                        fontWeight: 700,
                        textTransform: "uppercase"
                      }}
                    >
                      {getAvatarUrl(u) ? null : getInitials(u)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>

              {isAdminOrManager && (
                <ButtonComponent
                  text="Add Task"
                  icon={<AddIcon />}
                  onClick={() => setOpenTaskModal(true)}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="body1" fontWeight={700} sx={{ color: "#1976d2" }}>
              Sprint Progress
            </Typography>
            
            <Typography variant="body1" fontWeight={700} sx={{ color: "#1976d2" }}>
              {completedTasks}/{totalTasks} tasks completed
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>

    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={31}
        thickness={4.2}
        sx={{
          color: "#6366f1",
          background: "#ede9fe",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          top: 0, left: 0, bottom: 0, right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#555", fontSize: "0.96rem" }}>
          {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#ede9fe",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              },
            }}
          />
        </Box>

        {/* KANBAN BOARD */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <KanbanBoard
            columns={columns}
            tasksByColumn={filteredTasksByColumn}
            isDragging={false}
          />
        </DragDropContext>
      </StyledCard>

      {/* ==== MODAL TASK ==== */}
      <CreateTaskModal
        open={openTaskModal}
        handleClose={() => setOpenTaskModal(false)}
        projectId={projectId}
        sprintId={sprintId}
        users={teamMembers}
      />
    </Box>
  );
};

export default Tache;
