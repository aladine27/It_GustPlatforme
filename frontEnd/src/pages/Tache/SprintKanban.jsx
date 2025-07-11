import React from "react";
import { Box, Typography } from "@mui/material";
import Tache from "./Tache"; // Ton Kanban

const SprintKanban = ({ sprint, isAdminOrManager }) => {
  
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} >
        Kanban - {sprint.title}
      </Typography>
      <Tache sprintId={sprint.id} isAdminOrManager={isAdminOrManager} />
    </Box>
  );
};
export default SprintKanban;
