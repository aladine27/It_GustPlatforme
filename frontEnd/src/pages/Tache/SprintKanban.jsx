import { Box, Typography } from "@mui/material";
import Tache from "./Tache";

const SprintKanban = ({ sprint, isAdminOrManager, projectId }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700}>
        Kanban - {sprint.title}
      </Typography>
      <Tache 
        sprintId={sprint._id || sprint.id} 
        projectId={projectId} 
        isAdminOrManager={isAdminOrManager} 
      />
    </Box>
  );
};

export default SprintKanban;
