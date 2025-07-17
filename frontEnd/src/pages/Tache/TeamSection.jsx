import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import EquipesBoard from "../../components/Equipes/EquipesBoard";

const TeamSection = ({
  isAdminOrManager,
  loadingTeam,
  teamsForProject,
  paginatedTeams,
  teamTotalPages,
  teamPage,
  setTeamPage,
  handleOpenTeamModal,
  handleEditTeam,
  handleDeleteTeam,
  handleAddMember,
  handleDeleteMember,
}) => {
  if (!isAdminOrManager) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 6,
        p: 3,
        borderRadius: 3,
        border: "1.5px solid #e6eafd",
        background: "#fff",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Équipes du projet
        </Typography>
        <ButtonComponent
          text="Ajouter une équipe"
          onClick={handleOpenTeamModal}
          color="primary"
        />
      </Stack>

      {loadingTeam && (
        <Typography color="info.main">Chargement équipes...</Typography>
      )}

      {teamsForProject.length === 0 && !loadingTeam ? (
        <Box sx={{ p: 4, mt: 2, textAlign: "center", borderRadius: 3 }}>
          <Typography color="text.secondary" fontSize={18}>
            Aucune équipe n’a encore été créée pour ce projet.
          </Typography>
          <ButtonComponent
            text="Ajouter une équipe"
            onClick={handleOpenTeamModal}
            sx={{ mt: 3 }}
          />
        </Box>
      ) : (
        <EquipesBoard
          teams={paginatedTeams}
          onEditTeam={handleEditTeam}
          onDeleteTeam={handleDeleteTeam}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
          isAdminOrManager={isAdminOrManager}
        />
      )}

      {teamTotalPages > 1 && (
        <PaginationComponent
          count={teamTotalPages}
          page={teamPage}
          onChange={(_, value) => setTeamPage(value)}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        />
      )}
    </Paper>
  );
};

export default TeamSection;
