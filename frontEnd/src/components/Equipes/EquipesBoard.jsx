import React from "react";
import { Box, Stack } from "@mui/material";
import EquipeCard from "./EquipesCard";

const EquipesBoard = ({
  teams,
  onEditTeam,
  onDeleteTeam,
  onEditMember,
  onDeleteMember,
  onAddMember
}) => (
  <Box sx={{ overflowX: "auto", pb: 2 }}>
    <Stack direction="row" spacing={4}>
      {teams.map((team) => (
        <EquipeCard
          key={team.id}
          team={team}
          onEditTeam={onEditTeam}
          onDeleteTeam={onDeleteTeam}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
          onAddMember={onAddMember}
        />
      ))}
    </Stack>
  </Box>
);

export default EquipesBoard;
