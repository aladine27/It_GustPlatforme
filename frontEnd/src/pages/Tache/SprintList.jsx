import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchSprintsByProject, deleteSprint } from "../../redux/actions/sprintActions";
import { fetchAllTeams } from "../../redux/actions/teamActions";
import CreateSprintModal from "../../components/Sprint/CreateSprintModal";
import CustomDeleteForm from "../../components/Global/CustomDeleteForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import SprintSection from "./SprintSection";

function getNextSprintStartDate(sprints = [], projectStartDate) {
  if (!sprints.length) return projectStartDate ? new Date(projectStartDate) : new Date();
  const sorted = [...sprints].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  const last = sorted[sorted.length - 1];
  const date = new Date(last.endDate);
  date.setDate(date.getDate() + 1);
  return date;
}

function isTeamAvailableForSprint(sprints, teams, startDate, endDate) {
  for (let team of teams) {
    const teamId = team._id;
    const hasOverlap = sprints.some(s => {
      const sprintTeamId = s.team?._id || s.team;
      if (String(sprintTeamId) !== String(teamId)) return false;
      return (
        new Date(startDate) <= new Date(s.endDate) &&
        new Date(endDate) >= new Date(s.startDate)
      );
    });
    if (!hasOverlap) return true;
  }
  return false;
}

const SprintList = ({
  isAdminOrManager,
  onSprintSelect,
  projectId: propProjectId,
  projectTitle: propProjectTitle,
}) => {
  const dispatch = useDispatch();
  const { projectId: urlProjectId } = useParams();
  const projectId = propProjectId || urlProjectId;

  const { sprints, loading: loadingSprint } = useSelector((state) => state.sprint);
  const { teams } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.project);
  const { CurrentUser } = useSelector((state) => state.user);

  // === RECHERCHE ===
  const [searchSprint, setSearchSprint] = useState("");

  // USER/RÔLE
  const userId = CurrentUser?._id || CurrentUser?.user?._id;
  const role = CurrentUser?.role || CurrentUser?.user?.role;
  const isReallyAdminOrManager = ["admin", "manager"].includes((role || "").toLowerCase());

  // FILTRES
  const sprintsForProject = useMemo(
    () => (sprints || []).filter((s) => {
      let sprintProjectId = typeof s.project === "object" ? s.project?._id : s.project;
      return String(sprintProjectId) === String(projectId);
    }),
    [sprints, projectId]
  );
  const teamsForProject = useMemo(() =>
    (teams || []).filter((t) => {
      let teamProject = typeof t.project === "object" ? t.project?._id || t.project : t.project;
      return String(teamProject) === String(projectId);
    }), [teams, projectId]
  );

  const employeeTeams = useMemo(() =>
    (teamsForProject || []).filter((t) =>
      Array.isArray(t.employeeList) &&
      t.employeeList.some((e) => (typeof e === "object" ? e._id : e) === userId)
    ), [teamsForProject, userId]
  );
  const employeeTeamIds = useMemo(() =>
    employeeTeams.map((t) => t._id), [employeeTeams]
  );

  const sprintsFiltered = useMemo(() => {
    if (isReallyAdminOrManager || isAdminOrManager) return sprintsForProject;
    return sprintsForProject.filter((sprint) =>
      employeeTeamIds.includes(
        typeof sprint.team === "object" ? sprint.team?._id : sprint.team
      )
    );
  }, [isReallyAdminOrManager, isAdminOrManager, sprintsForProject, employeeTeamIds]);

  // === RECHERCHE filtrée ===
  const sprintsSearchFiltered = useMemo(() =>
    sprintsFiltered.filter((s) =>
      s.title?.toLowerCase().includes(searchSprint.toLowerCase())
    ), [sprintsFiltered, searchSprint]
  );

  // === PAGINATION ===
  const [sprintPage, setSprintPage] = useState(1);
  const sprintsPerPage = 3;
  const sprintTotalPages = Math.ceil(sprintsSearchFiltered.length / sprintsPerPage);
  const paginatedSprints = sprintsSearchFiltered.slice(
    (sprintPage - 1) * sprintsPerPage,
    sprintPage * sprintsPerPage
  );

  // === INFOS PROJET ===
  const project = useMemo(
    () => (projects || []).find((p) => String(p._id) === String(projectId)),
    [projects, projectId]
  );
  const projectTitle = propProjectTitle || project?.title || "";
  const projectStartDate = project?.startDate ? new Date(project.startDate) : null;
  const projectEndDate = project?.endDate ? new Date(project.endDate) : null;

  // === AUTRES INFOS SPRINTS ===
  const nextSprintStartDate = useMemo(
    () => getNextSprintStartDate(sprintsForProject, projectStartDate),
    [sprintsForProject, projectStartDate]
  );
  const totalSprintDays = useMemo(() => {
    return sprintsForProject.reduce((acc, s) => {
      const d1 = new Date(s.startDate);
      const d2 = new Date(s.endDate);
      return acc + (Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
    }, 0);
  }, [sprintsForProject]);
  const projectTotalDays =
    projectStartDate && projectEndDate
      ? Math.floor((projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24)) + 1
      : 0;

  const defaultSprintStart = nextSprintStartDate;
  const defaultSprintEnd = new Date(nextSprintStartDate);
  defaultSprintEnd.setDate(defaultSprintEnd.getDate() + 6);

  const isSomeTeamAvailable = isTeamAvailableForSprint(
    sprintsForProject,
    teamsForProject,
    defaultSprintStart,
    defaultSprintEnd
  );
  const isDateExceeded = projectEndDate && nextSprintStartDate > projectEndDate;
  const blockCreateSprint = !isSomeTeamAvailable || totalSprintDays >= projectTotalDays || isDateExceeded;

  // === DATA FETCH ===
  useEffect(() => {
    if (projectId) {
      dispatch(fetchSprintsByProject(projectId));
      dispatch(fetchAllTeams());
    }
  }, [dispatch, projectId]);

  // === MODALES ===
  const [openSprintModal, setOpenSprintModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [sprintToDelete, setSprintToDelete] = useState(null);

  const handleOpenSprintModal = () => { if (!blockCreateSprint) setOpenSprintModal(true); };
  const handleEditSprint = (sprint) => { setSprintToEdit(sprint); setOpenEditModal(true); };
  const handleDeleteSprint = (sprint) => setSprintToDelete(sprint);
  const handleCloseEditModal = () => { setSprintToEdit(null); setOpenEditModal(false); };
  const handleCloseDeleteModal = () => setSprintToDelete(null);

  const handleConfirmDelete = async () => {
    if (sprintToDelete) {
      await dispatch(deleteSprint(sprintToDelete._id));
      setSprintToDelete(null);
      dispatch(fetchSprintsByProject(projectId)); // refresh la liste
    }
  };

  return (
    <Box>
      <SprintSection
        isAdminOrManager={isReallyAdminOrManager || isAdminOrManager}
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
        projectTitle={projectTitle}
        searchSprint={searchSprint}
        setSearchSprint={setSearchSprint}
      />

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
        title={
          sprintToDelete
            ? `Voulez-vous vraiment supprimer le sprint "${sprintToDelete.title}" ?`
            : ""
        }
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
    </Box>
  );
};

export default SprintList;
