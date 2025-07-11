import React, { useState } from "react";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { StyledPaper } from "../../style/style";
import SprintList from "./SprintList";
import SprintKanban from "./SprintKanban";
import { useSelector } from "react-redux";

const ProjectSprintIndex = () => {
  // Gestion du rôle
  const { CurrentUser } = useSelector((state) => state.user);
  const role = CurrentUser?.role || CurrentUser?.user?.role;
  const isAdminOrManager = role && (role.toLowerCase() === "admin" || role.toLowerCase() === "manager");

  // Navigation et sélection de sprint
  const [view, setView] = useState("sprintList");
  const [selectedSprint, setSelectedSprint] = useState(null);

  return (
    <StyledPaper>
      {/* NAVIGATION DOUBLE */}
      <Stack direction="row" alignItems="center" mb={2}>
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

      {/* CONTENU */}
      {view === "sprintList" ? (
        <SprintList
          isAdminOrManager={isAdminOrManager}
          onSprintSelect={(sprint) => {
            setSelectedSprint(sprint);
            setView("kanban");
          }}
        />
      ) : view === "kanban" && selectedSprint ? (
        <SprintKanban
          sprint={selectedSprint}
          isAdminOrManager={isAdminOrManager}
        />
      ) : (
        <Typography sx={{ mt: 6, textAlign: "center", fontWeight: 700, color: "error.main" }}>
          Sélectionnez un sprint
        </Typography>
      )}
    </StyledPaper>
  );
};

export default ProjectSprintIndex;
