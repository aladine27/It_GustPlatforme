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
}) => {
  // Log l'état des équipes au moment du render
  console.log("[EquipesBoard] teams =", teams);
  teams.forEach((team, idx) => {
    console.log(`[EquipesBoard] team #${idx} -`, team.title, ":", team);
    console.log(`[EquipesBoard] team #${idx} employeeList:`, team.employeeList);
  });

  return (
    <Box sx={{ overflowX: "auto", pb: 2 }}>
      <Stack direction="row" spacing={4}>
        {teams.map((team, idx) => (
          <EquipeCard
            key={team._id}
            team={team}
            allProjectTeams={teams}
            onEditTeam={onEditTeam}
            onDeleteTeam={onDeleteTeam}
            onEditMember={onEditMember}
            onDeleteMember={onDeleteMember}
            onAddMember={onAddMember}
            isAdminOrManager={isAdminOrManager}
            teamIndex={idx}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default EquipesBoard;
