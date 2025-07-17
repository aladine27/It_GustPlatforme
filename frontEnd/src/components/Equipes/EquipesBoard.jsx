import React from "react";
import { Box, Stack } from "@mui/material";
import EquipeCard from "./EquipesCard";

const EquipesBoard = ({
  teams,
  onEditTeam,
  onDeleteTeam,
  onEditMember,
  onDeleteMember,
  onAddMember,
  isAdminOrManager
}) => (
  <Box sx={{ overflowX: "auto", pb: 2 }}>
    <Stack direction="row" spacing={4}>
      {teams.map((team) => (
        <EquipeCard
          key={team._id}
          team={team}
          onEditTeam={onEditTeam}
          onDeleteTeam={onDeleteTeam}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
          onAddMember={onAddMember}
          isAdminOrManager={isAdminOrManager}
          
        />
      ))}
    </Stack>
  </Box>
);

export default EquipesBoard;
