import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, LinearProgress, Avatar, AvatarGroup, Typography,
  TextField, MenuItem, Tooltip, CircularProgress
} from "@mui/material";
import { Add as AddIcon, DeleteOutline } from "@mui/icons-material";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import { StyledCard, Title } from "../../style/style";
import KanbanBoard from "../../components/Tache/kanbanBoard";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  fetchTasksBySprint,
  updateTaskStatus,
  deleteTask
} from "../../redux/actions/taskAction";
import CreateTaskModal from "../../components/Tache/CreateTaskModal";
import CustomDeleteForm from "../../components/Global/CustomDeleteForm";
import { moveTaskColumn } from "../../redux/slices/taskSlice";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { tasksByColumn } = useSelector((state) => state.task);
  const { employes } = useSelector((state) => state.employe);
  const { sprints } = useSelector((state) => state.sprint);
  const { teams } = useSelector((state) => state.team);

const [assigneeFilter, setAssigneeFilter] = useState("");

  const currentRole =useSelector((state) => state.user?.CurrentUser?.role || state.user?.CurrentUser?.user?.role) || "";
  const canDrag = currentRole === "Employe"; // Employé peut drag, Manager non

  const sprint = (sprints || []).find(s => s._id === sprintId);
  const team = teams?.find(t => t._id === sprint?.team);

  // Extraction robuste
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

  // Filtre
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    if (sprintId) {
      dispatch(fetchTasksBySprint(sprintId));
    }
  }, [sprintId, dispatch]);

  // 🔁 resync quand l’onglet redevient visible (retour sur la page)
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && sprintId) {
        dispatch(fetchTasksBySprint(sprintId));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [dispatch, sprintId]);

  const totalTasks = Object.values(tasksByColumn || {}).flat().length || 0;
  const completedTasks = (tasksByColumn?.done || []).length || 0;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  // Modals
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const handleEditTask = (task) => { setTaskToEdit(task); setOpenEditModal(true); };
  const handleCloseEditModal = () => { setTaskToEdit(null); setOpenEditModal(false); };

  // Modal delete
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleDeleteTask = (task) => { setTaskToDelete(task); setOpenDeleteModal(true); };
  const handleCloseDeleteModal = () => { setTaskToDelete(null); setOpenDeleteModal(false); setLoadingDelete(false); };

  const handleConfirmDelete = async () => {
    if (!taskToDelete || !taskToDelete._id) {
      alert("Tâche introuvable !");
      return;
    }
    setLoadingDelete(true);
    try {
      const result = dispatch(deleteTask(taskToDelete._id));
      if (result?.error) {
        alert(result?.payload || "Erreur lors de la suppression !");
      } else {
        setOpenDeleteModal(false);
        // resync après suppression
        if (sprintId) dispatch(fetchTasksBySprint(sprintId));
      }
    } catch {
      alert("Erreur réseau");
    }
    setLoadingDelete(false);
  };

  // 👉 util pour re-fetch (réutilisé par modals)
  const refreshBoard = React.useCallback(() => {
    if (sprintId) dispatch(fetchTasksBySprint(sprintId));
  }, [dispatch, sprintId]);


  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Si l'élément est déposé en dehors d'une colonne, ne rien faire
    if (!destination) {
      return;
    }

    // Si l'élément n'a pas bougé, ne rien faire
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 1. Mise à jour optimiste de l'état local (UI)
    // Cela donne une sensation de réactivité immédiate à l'utilisateur.
    dispatch(moveTaskColumn({
      taskId: draggableId,
      sourceCol: source.droppableId,
      destCol: destination.droppableId,
      sourceIndex: source.index,      // Il est bon de passer aussi les index
      destIndex: destination.index,
    }));

    // 2. Si la tâche a changé de colonne, mettre à jour le serveur
    if (source.droppableId !== destination.droppableId) {
      try {
        const action = await dispatch(updateTaskStatus({
          taskId: draggableId,
          newStatus: destination.droppableId,
        }));

        // 3. Si la mise à jour serveur échoue, on annule le changement local (rollback)
        if (action.error) {
          console.error("Échec de la mise à jour du statut :", action.error);
          // On inverse le mouvement pour que l'UI corresponde à la réalité du serveur
          dispatch(moveTaskColumn({
            taskId: draggableId,
            sourceCol: destination.droppableId, // L'origine est maintenant la destination
            destCol: source.droppableId,         // La destination est l'ancienne origine
            sourceIndex: destination.index,
            destIndex: source.index,
          }));
        }
        // Si la mise à jour réussit, c'est parfait ! Pas besoin de re-fetch.
        // L'état local est déjà correct. Le re-fetch est la cause du problème.
        // NOUS AVONS SUPPRIMÉ L'APPEL fetchTasksBySprint ICI.

      } catch (e) {
        console.error("Erreur lors de la mise à jour de la tâche :", e);
        // En cas d'erreur réseau, on annule aussi le changement
        dispatch(moveTaskColumn({
          taskId: draggableId,
          sourceCol: destination.droppableId,
          destCol: source.droppableId,
          sourceIndex: destination.index,
          destIndex: source.index,
        }));
      }
    }
  };
 const filteredTasksByColumn = {};
Object.keys(tasksByColumn || {}).forEach((col) => {
  filteredTasksByColumn[col] = (tasksByColumn[col] || []).filter((task) => {
    const priorityOk = priorityFilter
      ? (task.priority || "").toLowerCase() === priorityFilter
      : true;

    const taskUserId =
      typeof task.user === "string" ? task.user : task.user?._id;

    const assigneeOk = assigneeFilter ? taskUserId === assigneeFilter : true;

    return priorityOk && assigneeOk;
  });
});


  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh", boxSizing: "border-box" }}>
      <StyledCard sx={{ borderRadius: "1.5", boxShadow: "0 16px 56px rgba(50,100,255,0.10)", border: "1.5px solid #d5e7ff", background: "#fff", p: { xs: 1, md: 4 }, width: "100%" }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", mb: 2 }}>
            <Title variant="h4" sx={{ textAlign: "center", width: "100%" }}>
              {t("Planification du sprint & gestion des tâches")}
            </Title>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2, justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
              <TextField
                select size="small" label="Priorité"
                value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
                sx={{ width: 160, background: "#fff" }}
              >
                <MenuItem value="">{t("Toutes")}</MenuItem>
                <MenuItem value="high">{t("Haute")}</MenuItem>
                <MenuItem value="medium">{t("Moyenne")}</MenuItem>
                <MenuItem value="low">{t("Faible")}</MenuItem>
              </TextField>
            </Box>
        {/* Filtres (à gauche) */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,                 // espace entre les deux
    flexWrap: { xs: "wrap", sm: "nowrap" }, // wrap sur petit écran
  }}
>


  {/* Membre */}
  <TextField
    select
    size="small"
    label={t("Membre")}
    value={assigneeFilter}
    onChange={(e) => setAssigneeFilter(e.target.value)}
    sx={{ width: 220, background: "#fff" }}
  >
    <MenuItem value="">{t("Tous")}</MenuItem>
    {(teamMembers || []).map((u) => (
      <MenuItem key={u._id} value={u._id}>
        {u.fullName || u.name || "Utilisateur"}
      </MenuItem>
    ))}
  </TextField>
</Box>



            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 38, height: 38, fontWeight: 700, fontSize: 17 } }}>
                {teamMembers && teamMembers.map((u) => (
                  <Tooltip key={u._id} title={u.fullName} arrow placement="top">
                    <Avatar
                      src={getAvatarUrl(u)} alt={u.fullName || u.name || "user"}
                      sx={{ bgcolor: "#1976d2", fontWeight: 700, textTransform: "uppercase" }}
                    >
                      {getAvatarUrl(u) ? null : getInitials(u)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>

              {/* Manager garde l’ajout */}
              {isAdminOrManager && (
                <ButtonComponent
                  text={t("Ajouter une tâche")}
                  icon={<AddIcon />}
                  onClick={() => setOpenTaskModal(true)}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:1 }}>
            <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:1 }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                <Typography variant="body1" fontWeight={700} sx={{ color:"#1976d2" }}>
                  {t("Progression du sprint :")}
                </Typography>
                <Box sx={{ position:"relative", width:31, height:31 }}>
                  <CircularProgress variant="determinate" value={progress} size={31} thickness={4.2} sx={{ color:"#6366f1", background:"#ede9fe", borderRadius:"50%" }} />
                  <Box sx={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Typography variant="caption" sx={{ fontWeight:700, color:"#555" }}>
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Typography variant="body1" fontWeight={700} sx={{ color:"#1976d2" }}>
              {t("{{completed}}/{{total}} tâches terminées", { completed: completedTasks, total: totalTasks })}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate" value={progress}
            sx={{
              height: 8, borderRadius: 4, bgcolor: "#ede9fe",
              "& .MuiLinearProgress-bar": { borderRadius: 4, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }
            }}
          />
        </Box>

        {/* KANBAN BOARD */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <KanbanBoard
            columns={columns}
            tasksByColumn={filteredTasksByColumn}
            isDragging={false}
            isAdminOrManager={isAdminOrManager}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            /* 👉 nouveau : passe l'autorisation de drag aux colonnes/cartes */
            canDrag={canDrag}
          />
        </DragDropContext>
      </StyledCard>

      {/* MODALS */}
      <CreateTaskModal
        open={openTaskModal}
        handleClose={() => setOpenTaskModal(false)}
        projectId={projectId}
        sprintId={sprintId}
        users={teamMembers}
        onSuccess={refreshBoard}
      />

      <CreateTaskModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        projectId={projectId}
        sprintId={sprintId}
        users={teamMembers}
        isEdit={true}
        task={taskToEdit}
        onSuccess={refreshBoard}
      />

      <CustomDeleteForm
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Confirmer la suppression de la tâche ?"
        icon={<DeleteOutline color="error" sx={{ fontSize: 40 }} />}
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          {/* Bouton d’action conservé tel quel */}
          <ButtonComponent
            text={loadingDelete ? "Suppression..." : "Supprimer"}
            variant="contained"
            color="error"
            disabled={loadingDelete}
            onClick={handleConfirmDelete}
          />
        </Box>
      </CustomDeleteForm>
    </Box>
  );
};

export default Tache;
