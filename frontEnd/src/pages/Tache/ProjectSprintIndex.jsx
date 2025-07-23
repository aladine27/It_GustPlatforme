import React, { useState } from "react";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import GroupsIcon from "@mui/icons-material/Groups";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { StyledPaper } from "../../style/style";
import SprintList from "./SprintList";
import TeamSection from "./TeamSection";
import SprintKanban from "./SprintKanban";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ProjectSprintIndex = () => {
  const { projectId } = useParams();
  const { projects } = useSelector((state) => state.project);
  const { CurrentUser } = useSelector((state) => state.user);
  const role = CurrentUser?.role || CurrentUser?.user?.role;
  const isAdminOrManager = ["admin", "manager"].includes(role?.toLowerCase());

  // Titre dynamique du projet
  const project = projects?.find((p) => String(p._id) === String(projectId));
  const projectTitle = project?.title || "";

  // Navigation d’onglets
  const [view, setView] = useState("sprintList");
  const [selectedSprint, setSelectedSprint] = useState(null);

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" mb={2}>
      {isAdminOrManager && (
    <Button
      sx={{
        mr: 1,
        textTransform: "none",
        fontWeight: 600,
        color: view === "teamList" ? "primary.main" : "#666",
        bgcolor: view === "teamList" ? "#f2f7fe" : "transparent",
      }}
      startIcon={<GroupsIcon />}
      onClick={() => setView("teamList")}
    >
      Liste des équipes
    </Button>
  )}
        <Button
          sx={{
            mr: 1,
            textTransform: "none",
            fontWeight: 600,
            color: view === "sprintList" ? "primary.main" : "#666",
            bgcolor: view === "sprintList" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<ListIcon />}
          onClick={() => setView("sprintList")}
        >
          Liste des sprints
        </Button>
       
        <Button
          sx={{
            mr: 2,
            textTransform: "none",
            fontWeight: 600,
            color: view === "kanban" ? "primary.main" : "#666",
            bgcolor: view === "kanban" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<ViewKanbanIcon />}
          disabled={!selectedSprint}
          onClick={() => setView("kanban")}
        >
          Kanban Sprint
        </Button>
        <Divider sx={{ mb: 1, mx: 2 }} />
      </Stack>

      {/* CONTENU : une seule vue à la fois */}
       {view === "teamList" && (
        <TeamSection
          isAdminOrManager={isAdminOrManager}
          projectId={projectId}
          projectTitle={projectTitle}
        />
      )}
      {view === "sprintList" && (
        <SprintList
          isAdminOrManager={isAdminOrManager}
          onSprintSelect={(sprint) => {
            setSelectedSprint(sprint);
            setView("kanban");
          }}
          projectId={projectId}
          projectTitle={projectTitle}
        />
      )}

     

      {view === "kanban" && selectedSprint && (
        <SprintKanban
          sprint={selectedSprint}
          isAdminOrManager={isAdminOrManager}
          projectId={projectId}
        />
      )}

      {view === "kanban" && !selectedSprint && (
        <Typography sx={{ mt: 6, textAlign: "center", fontWeight: 700, color: "error.main" }}>
          Sélectionnez un sprint
        </Typography>
      )}
    </StyledPaper>
  );
};

export default ProjectSprintIndex;
