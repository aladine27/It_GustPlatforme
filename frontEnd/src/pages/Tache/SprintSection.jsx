import React from "react";
import { Box, Typography, Paper, Stack, Chip, Tooltip, IconButton, Divider, TextField, InputAdornment } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
const SprintSection = ({
  isAdminOrManager,
  paginatedSprints,
  teamsForProject,
  loadingSprint,
  sprintTotalPages,
  sprintPage,
  setSprintPage,
  onSprintSelect,
  handleEditSprint,
  handleDeleteSprint,
  blockCreateSprint,
  handleOpenSprintModal,
  projectTitle,
  searchSprint,
  setSearchSprint,
}) => {
   const { t } = useTranslation();
    return (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 1.5,
      border: "1.5px solid #e6eafd",
      background: "#fafdff"
    }}
  >
  {/* Titre en haut */}
  <Typography
    fontWeight={700}
    fontSize={22}
    sx={{
      textAlign: "center",
      mb: 2
    }}
  >
      {projectTitle
          ? t("Liste des Sprints du projet \"{{project}}\"", { project: projectTitle })
          : t("Liste des Sprints")}
  </Typography>
    {/* Header : Recherche (gauche), titre (centre), bouton (droite) */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      {/* Recherche à gauche */}
      <TextField
        label={t("Rechercher")}
        value={searchSprint}
        onChange={e => {
          setSearchSprint(e.target.value);
          setSprintPage && setSprintPage(1);
        }}
        placeholder={t("Titre du sprint...")}
        sx={{
          width: { xs: "100%", md: 250 },
          borderRadius: "50px",
          bgcolor: "#fff",
          minWidth: 140,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" color="primary"><SearchIcon /></IconButton>
            </InputAdornment>
          ),
          sx: { borderRadius: "16px", fontSize: "1.03rem" }
        }}
      />


      {/* Bouton à droite */}
      {isAdminOrManager && (
     <ButtonComponent
  text={t("Créer un sprint")}
  icon={<AddCircleOutlineIcon />}
  onClick={handleOpenSprintModal}
  disabled={blockCreateSprint}
/>)}
    </Box>

    <Divider sx={{ my: 2 }} />

   {blockCreateSprint && (
 <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
   {t("Impossible d'ajouter un sprint : période du projet atteinte.")}
 </Typography>
)}
    {loadingSprint && <Typography color="info.main">{t("Chargement...")}</Typography>}
    {paginatedSprints.length === 0 && !loadingSprint && (
      <Typography color="text.secondary" sx={{ textAlign: "center", my: 4 }}>
         {t("Aucun sprint créé pour ce projet.")}
      </Typography>
    )}

    {/* Liste des sprints */}
    <Box>
      {paginatedSprints.map((sprint) => {
        const teamObj = teamsForProject.find(
          t => t._id === (sprint.team?._id || sprint.team)
        );
        return (
          <Paper
            elevation={3}
            key={sprint._id}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 2,
              minWidth: 350,
              mb: 2,
              border: "1px solid #ececec",
              background:"#e3f2fd",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography fontWeight={800} fontSize={22} sx={{ mb: 0.7 }}>
                  {sprint.title}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <CalendarMonthIcon sx={{ fontSize: 19, color: "#888" }} />
                  <Typography fontSize={16} color="text.secondary">
                    {format(new Date(sprint.startDate), "d MMM yyyy", { locale: fr })} —{" "}
                    {format(new Date(sprint.endDate), "d MMM yyyy", { locale: fr })}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: "#2979ff" }} />
                    <Typography color="#2979ff" fontWeight={600} fontSize={16}>
                      {sprint.duration}
                    </Typography>
                  </Stack>
                  <Chip
                    icon={<CheckCircleIcon sx={{ color: "#32c48d" }} />}
                    label={t(sprint.status || "Statut")}
                    size="small"
                    sx={{
                      background: "#e8f5e9",
                      color: "#32c48d",
                      fontWeight: 700,
                      fontSize: 15,
                      pl: "6px",
                    }}
                  />
                  <Stack direction="row" alignItems="center" spacing={0.4}>
                    <GroupIcon sx={{ fontSize: 20, color: "#b47aff" }} />
                    <Typography fontWeight={700} color="#b47aff" fontSize={16}>
                      {teamObj?.title || "Équipe"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <TaskAltIcon sx={{ fontSize: 20, color: "#555" }} />
                    <Typography fontWeight={500} fontSize={16} color="#444">
                      {sprint.tasks?.length || 0} tâches
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip title="Kanban Sprint">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onSprintSelect && onSprintSelect(sprint)}
                  >
                    <ViewKanbanIcon />
                  </IconButton>
                </Tooltip>
                {isAdminOrManager && (
                  <>
                    <Tooltip title="Modifier le sprint">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditSprint(sprint)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer le sprint">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteSprint(sprint)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Box>
    {sprintTotalPages > 0 && (
      <PaginationComponent
        count={sprintTotalPages}
        page={sprintPage}
        onChange={(_, value) => setSprintPage(value)}
      />
    )}
  </Paper>
    
);
};

export default SprintSection;
