import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchSprintsByProject, deleteSprint } from "../../redux/actions/sprintActions";
import { fetchAllTeams, deleteTeam, updateTeam } from "../../redux/actions/teamActions";
import CreateSprintModal from "../../components/Sprint/CreateSprintModal";
import CreateTeamModal from "../../components/Equipes/CreateTeamModal";
import CustomDeleteForm from "../../components/Global/CustomDeleteForm";
import AddMemberModal from "../../components/Equipes/AddMembreModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import { toast } from "react-toastify";
import SprintSection from "./SprintSection";
import TeamSection from "./TeamSection";

// Helper
function getNextSprintStartDate(sprints = [], projectStartDate) {
  if (!sprints.length) return projectStartDate ? new Date(projectStartDate) : new Date();
  const sorted = [...sprints].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  const last = sorted[sorted.length - 1];
  const date = new Date(last.endDate);
  date.setDate(date.getDate() + 1);
  return date;
}

const SprintList = ({ isAdminOrManager, onSprintSelect }) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const { sprints, loading: loadingSprint } = useSelector((state) => state.sprint);
  const { teams, loading: loadingTeam } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.project);

  // === Filtrage sprints robustes sur id projet ===
  const sprintsForProject = useMemo(
    () => (sprints || []).filter(s => {
      let sprintProjectId;
      if (typeof s.project === "object" && s.project !== null) {
        sprintProjectId = s.project._id;
      } else {
        sprintProjectId = s.project;
      }
      return String(sprintProjectId) === String(projectId);
    }),
    [sprints, projectId]
  );

  // === Filtrage équipes ===
  const teamsForProject = useMemo(() => {
    return (teams || []).filter(t => {
      let teamProject = t.project;
      if (teamProject && typeof teamProject === 'object' && teamProject.toString) {
        teamProject = teamProject.toString();
      }
      return String(teamProject) === String(projectId);
    });
  }, [teams, projectId]);

  // === Projet courant ===
  const project = useMemo(() => {
    return (projects || []).find(p => String(p._id) === String(projectId));
  }, [projects, projectId]);

  const projectStartDate = project?.startDate ? new Date(project.startDate) : null;
  const projectEndDate = project?.endDate ? new Date(project.endDate) : null;

  const nextSprintStartDate = useMemo(() => {
    return getNextSprintStartDate(sprintsForProject, projectStartDate);
  }, [sprintsForProject, projectStartDate]);

  // --- Blocage création sprint (durée ou date dépassée)
  const totalSprintDays = useMemo(() => {
    return sprintsForProject.reduce((acc, s) => {
      const d1 = new Date(s.startDate);
      const d2 = new Date(s.endDate);
      return acc + (Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
    }, 0);
  }, [sprintsForProject]);

  const projectTotalDays = (projectStartDate && projectEndDate)
    ? Math.floor((projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Nouvelle logique de blocage
  const isDateExceeded = projectEndDate && nextSprintStartDate > projectEndDate;
  const blockCreateSprint = totalSprintDays >= projectTotalDays || isDateExceeded;

  // --- PAGINATION ---
  const [sprintPage, setSprintPage] = useState(1);
  const sprintsPerPage = 3;
  const paginatedSprints = sprintsForProject.slice(
    (sprintPage - 1) * sprintsPerPage,
    sprintPage * sprintsPerPage
  );
  const sprintTotalPages = Math.ceil(sprintsForProject.length / sprintsPerPage);

  const [teamPage, setTeamPage] = useState(1);
  const teamsPerPage = 3;
  const paginatedTeams = teamsForProject.slice(
    (teamPage - 1) * teamsPerPage,
    teamPage * teamsPerPage
  );
  const teamTotalPages = Math.ceil(teamsForProject.length / teamsPerPage);

  // --- FETCHEURS ---
  useEffect(() => {
    if (projectId) {
      dispatch(fetchSprintsByProject(projectId));
      dispatch(fetchAllTeams());
    }
  }, [dispatch, projectId]);

  // --- MODALS STATE ---
  const [openSprintModal, setOpenSprintModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [openEditTeamModal, setOpenEditTeamModal] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [sprintToDelete, setSprintToDelete] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [currentTeamForMember, setCurrentTeamForMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // --- HANDLERS SPRINT ---
  const handleOpenSprintModal = () => {
    if (!blockCreateSprint) setOpenSprintModal(true);
  };
  const handleEditSprint = (sprint) => {
    setSprintToEdit(sprint);
    setOpenEditModal(true);
  };
  const handleDeleteSprint = (sprint) => setSprintToDelete(sprint);
  const handleCloseEditModal = () => {
    setSprintToEdit(null);
    setOpenEditModal(false);
  };
  const handleCloseDeleteModal = () => setSprintToDelete(null);

  const handleConfirmDelete = async () => {
    if (sprintToDelete) {
      await dispatch(deleteSprint(sprintToDelete._id));
      setSprintToDelete(null);
      dispatch(fetchSprintsByProject(projectId));
    }
  };

  // --- HANDLERS TEAM ---
  const handleOpenTeamModal = () => setOpenTeamModal(true);
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

  // --- HANDLERS MEMBERS ---
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

  return (
    <Box>
      {/* --- SPRINTS --- */}
      <SprintSection
        isAdminOrManager={isAdminOrManager}
        paginatedSprints={paginatedSprints}
        teamsForProject={teamsForProject}
        loadingSprint={loadingSprint}
        sprintTotalPages={sprintTotalPages}
        sprintPage={sprintPage}
        setSprintPage={setSprintPage}
        onSprintSelect={onSprintSelect}
        handleEditSprint={handleEditSprint}
        handleDeleteSprint={handleDeleteSprint}
        blockCreateSprint={blockCreateSprint}
        handleOpenSprintModal={handleOpenSprintModal}
      />
      {/* --- EQUIPES --- */}
      <TeamSection
        isAdminOrManager={isAdminOrManager}
        loadingTeam={loadingTeam}
        teamsForProject={teamsForProject}
        paginatedTeams={paginatedTeams}
        teamTotalPages={teamTotalPages}
        teamPage={teamPage}
        setTeamPage={setTeamPage}
        handleOpenTeamModal={handleOpenTeamModal}
        handleEditTeam={handleEditTeam}
        handleDeleteTeam={handleDeleteTeam}
        handleAddMember={handleAddMember}
        handleDeleteMember={handleDeleteMember}
      />

      {/* --- MODALS ET FORMS --- */}
      <CreateSprintModal
        open={openSprintModal}
        handleClose={() => setOpenSprintModal(false)}
        projectId={projectId}
        projectStartDate={projectStartDate}
        projectEndDate={projectEndDate}
        nextSprintStartDate={nextSprintStartDate}
        sprints={sprintsForProject}
        blockCreateSprint={blockCreateSprint}
      />
      <CreateSprintModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        projectId={projectId}
        projectStartDate={projectStartDate}
        projectEndDate={projectEndDate}
        nextSprintStartDate={nextSprintStartDate}
        sprints={sprintsForProject}
        sprintData={sprintToEdit}
        isEdit
      />
      <CustomDeleteForm
        open={!!sprintToDelete}
        handleClose={handleCloseDeleteModal}
        title={sprintToDelete ? `Voulez-vous vraiment supprimer le sprint "${sprintToDelete.title}" ?` : ""}
        icon={<DeleteIcon sx={{ fontSize: 42 }} color="error" />}
      >
        <Box textAlign="center" mt={2}>
          <ButtonComponent
            color="error"
            text="Supprimer définitivement"
            onClick={handleConfirmDelete}
          />
        </Box>
      </CustomDeleteForm>
      {/* TEAM MODALS */}
      <CreateTeamModal
        open={openTeamModal}
        handleClose={() => setOpenTeamModal(false)}
        projectId={projectId}
      />
      <CreateTeamModal
        open={openEditTeamModal}
        handleClose={() => setOpenEditTeamModal(false)}
        projectId={projectId}
        teamData={teamToEdit}
        isEdit
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
    </Box>
  );
};

export default SprintList;
