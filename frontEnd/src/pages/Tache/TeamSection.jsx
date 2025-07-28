import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import EquipesBoard from "../../components/Equipes/EquipesBoard";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTeams, deleteTeam, updateTeam } from "../../redux/actions/teamActions";
import CreateTeamModal from "../../components/Equipes/CreateTeamModal";
import CustomDeleteForm from "../../components/Global/CustomDeleteForm";
import AddMemberModal from "../../components/Equipes/AddMembreModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

// Ce composant peut maintenant être utilisé seul dans la vue "teamList" (onglet équipe)
const TeamSection = ({
  isAdminOrManager,
  projectId: propProjectId,
  projectTitle: propProjectTitle
}) => {
  const dispatch = useDispatch();
  const { projectId: urlProjectId } = useParams();
  const projectId = propProjectId || urlProjectId;

  const { teams, loading: loadingTeam } = useSelector((state) => state.team);
  const { list: allEmployes } = useSelector(state => state.employe);

  // Equipes filtrées
  const teamsForProject = useMemo(() => {
    return (teams || []).filter(t => {
      let teamProject = typeof t.project === "object" ? t.project?._id || t.project : t.project;
      return String(teamProject) === String(projectId);
    });
  }, [teams, projectId]);

  // Pagination équipe
  const [teamPage, setTeamPage] = useState(1);
  const teamsPerPage = 3;
  const paginatedTeams = teamsForProject.slice(
    (teamPage - 1) * teamsPerPage,
    teamPage * teamsPerPage
  );
  const teamTotalPages = Math.ceil(teamsForProject.length / teamsPerPage);

  // Fetch équipes si besoin
  useEffect(() => {
    dispatch(fetchAllTeams());
  }, [dispatch, projectId]);

  // --- Gestion MODALS & actions ---
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [openEditTeamModal, setOpenEditTeamModal] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [currentTeamForMember, setCurrentTeamForMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // === Blocage du bouton "Ajouter une équipe" si aucun employé disponible ===
  const employees = useMemo(
    () => (allEmployes || []).filter(emp => emp.role === "Employe"),
    [allEmployes]
  );
  const alreadyAssignedIds = useMemo(() => {
    return teamsForProject.flatMap(team =>
      team.employeeList.map(e => typeof e === "string" ? e : e._id)
    );
  }, [teamsForProject]);
  const employeesFiltered = useMemo(() => {
    return employees.filter(emp => !alreadyAssignedIds.includes(emp._id));
  }, [employees, alreadyAssignedIds]);
  const blockCreateTeam = employeesFiltered.length === 0;

  const projectTitle = propProjectTitle || "";

  // Bouton Add: empêche modal si disabled
  const handleOpenTeamModal = () => {
    if (!blockCreateTeam) setOpenTeamModal(true);
  };
  const handleEditTeam = (team) => {
    setTeamToEdit(team);
    setOpenEditTeamModal(true);
  };
  const handleDeleteTeam = (team) => setTeamToDelete(team);
  const handleCloseDeleteTeamModal = () => setTeamToDelete(null);
  const handleConfirmDeleteTeam = async () => {
    if (teamToDelete) {
      await dispatch(deleteTeam(teamToDelete._id));
      setTeamToDelete(null);
      dispatch(fetchAllTeams());
    }
  };

  // --- Membres ---
  const handleAddMember = (team) => {
    setCurrentTeamForMember(team);
    setOpenAddMemberModal(true);
  };
  const handleCloseAddMemberModal = () => {
    setOpenAddMemberModal(false);
    setCurrentTeamForMember(null);
  };
  const handleDeleteMember = (team, member) => {
    setCurrentTeamForMember(team);
    setMemberToDelete(member);
  };
  const handleConfirmDeleteMember = async () => {
    if (currentTeamForMember && memberToDelete) {
      const newEmployeeList = currentTeamForMember.employeeList
        .filter(emp => (emp._id || emp) !== memberToDelete._id);
      const actionResult = await dispatch(updateTeam({
        id: currentTeamForMember._id,
        updateData: { employeeList: newEmployeeList.map(e => e._id || e) }
      }));
      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors du retrait du membre.");
      } else {
        toast.success("Membre retiré !");
      }
      setMemberToDelete(null);
      setCurrentTeamForMember(null);
      dispatch(fetchAllTeams());
    }
  };
  const handleCloseDeleteMemberModal = () => {
    setMemberToDelete(null);
    setCurrentTeamForMember(null);
  };

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
      {/* HEADER + Bouton créer équipe */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1, textAlign: "center" }}>
          Liste des Equipes Associées au Projet {projectTitle ? `"${projectTitle}"` : ""}
        </Typography>
        <ButtonComponent
          text="Créer une équipe"
            icon={<GroupAddOutlinedIcon />}
          onClick={handleOpenTeamModal}
          color="primary"
          disabled={blockCreateTeam}
          sx={blockCreateTeam ? { opacity: 1, pointerEvents: "none" } : {}}
          tooltip={
            blockCreateTeam
              ? "Impossible : tous les employés sont déjà assignés à une équipe."
              : undefined
          }
        />
      </Stack>
      {/* Message d'erreur si blocage */}
      {blockCreateTeam && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          Impossible d'Ajouter une nouvelle équipe !
        </Typography>
      )}

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
            disabled={blockCreateTeam}
            tooltip={
              blockCreateTeam
                ? "Impossible : tous les employés sont déjà assignés à une équipe."
                : undefined
            }
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
      {/* MODALS */}
      <CreateTeamModal
        open={openTeamModal}
        handleClose={() => setOpenTeamModal(false)}
        projectId={projectId}
        allProjectTeams={teamsForProject}
      />
      <CreateTeamModal
        open={openEditTeamModal}
        handleClose={() => setOpenEditTeamModal(false)}
        projectId={projectId}
        teamData={teamToEdit}
        isEdit
        allProjectTeams={teamsForProject}
      />
      <CustomDeleteForm
        open={!!teamToDelete}
        handleClose={handleCloseDeleteTeamModal}
        title={teamToDelete ? `Voulez-vous vraiment supprimer l’équipe "${teamToDelete.title}" ?` : ""}
        icon={<DeleteOutlineIcon sx={{ fontSize: 42 }} color="error" />}
      >
        <Box textAlign="center" mt={2}>
          <ButtonComponent
            color="error"
            text="Supprimer définitivement"
            onClick={handleConfirmDeleteTeam}
          />
        </Box>
      </CustomDeleteForm>
      {/* MEMBRE MODALS */}
      <AddMemberModal
        open={openAddMemberModal}
        handleClose={handleCloseAddMemberModal}
        team={currentTeamForMember}
      />
      <CustomDeleteForm
        open={!!memberToDelete}
        handleClose={handleCloseDeleteMemberModal}
        title={
          memberToDelete
            ? `Supprimer "${memberToDelete.fullName || memberToDelete.name}" de l’équipe "${currentTeamForMember?.title}" ?`
            : ""
        }
        icon={<DeleteOutlineIcon sx={{ fontSize: 42 }} color="error" />}
      >
        <Box textAlign="center" mt={2}>
          <ButtonComponent
            color="error"
            text="Retirer ce membre"
            onClick={handleConfirmDeleteMember}
          />
        </Box>
      </CustomDeleteForm>
    </Paper>
  );
};

export default TeamSection;
