import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import EquipesBoard from "../../components/Equipes/EquipesBoard";


// MOCK DATA (inchangé)
const MOCK_SPRINTS = [
  {
    id: 1,
    title: "Sprint 1",
    startDate: "2024-07-01",
    endDate: "2024-07-14",
    progress: 62,
    members: [
      { id: 1, name: "John Doe", email: "john@ex.com", role: "Développeur" },
      { id: 2, name: "Sarah Lee", email: "sarah@ex.com", role: "QA" }
    ]
  },
  {
    id: 2,
    title: "Sprint 2",
    startDate: "2024-07-15",
    endDate: "2024-07-28",
    progress: 31,
    members: [
      { id: 3, name: "Ali Ben", email: "ali@ex.com", role: "Développeur" },
      { id: 4, name: "Yassine", email: "yassine@ex.com", role: "PO" }
    ]
  }
];

const MOCK_TEAMS = [
  {
    id: 1,
    name: "Dev",
    type: "Développement",
    color: "#1976d2",
    members: [
      { id: 1, name: "John Doe", email: "john@ex.com", role: "Frontend" },
      { id: 2, name: "Sarah Lee", email: "sarah@ex.com", role: "Backend" }
    ]
  },
  {
    id: 2,
    name: "Design",
    type: "UI/UX",
    color: "#ff9800",
    members: [
      { id: 3, name: "Mehdi Design", email: "mehdi@ex.com", role: "UI Designer" },
      { id: 4, name: "Nada UX", email: "nada@ex.com", role: "UX Designer" }
    ]
  },
  {
    id: 3,
    name: "DevOps",
    type: "DevOps",
    color: "#43a047",
    members: [
      { id: 5, name: "Ali Ben", email: "ali@ex.com", role: "DevOps" }
    ]
  }
];

const SprintList = ({ isAdminOrManager, onSprintSelect }) => {
  const [sprints, setSprints] = useState([]);
  const [sprintPage, setSprintPage] = useState(1);
  const [teams, setTeams] = useState([]);
  const sprintsPerPage = 3;
  const paginatedSprints = sprints.slice(
    (sprintPage - 1) * sprintsPerPage,
    sprintPage * sprintsPerPage
  );

  const sprintTotalPages = Math.ceil(sprints.length / sprintsPerPage);
  const [teamPage, setTeamPage] = useState(1);
  const teamsPerPage = 3; // nombre de cards d'équipe par page (ajuste selon ton besoin)
  const paginatedTeams = teams.slice(
    (teamPage - 1) * teamsPerPage,
    teamPage * teamsPerPage
  );
  const teamTotalPages = Math.ceil(teams.length / teamsPerPage);
  

  useEffect(() => {
    setSprints(MOCK_SPRINTS);
    setTeams(MOCK_TEAMS);
  }, []);

  // Handlers (logique minimale)
  const handleAddTeam = () => {
    const newTeamId = teams.length + 1;
    setTeams([
      ...teams,
      {
        id: newTeamId,
        name: `Equipe ${newTeamId}`,
        type: "Autre",
        color: "#0097a7",
        members: []
      }
    ]);
  };
  const handleEditTeam = (team) => alert(`Modifier l'équipe ${team.name}`);
  const handleDeleteTeam = (team) => setTeams(teams.filter((t) => t.id !== team.id));
  const handleAddMember = (team) => alert(`Ajouter un membre à ${team.name}`);
  const handleEditMember = (member) => alert(`Modifier ${member.name}`);
  const handleDeleteMember = (member) => alert(`Supprimer ${member.name}`);

  return (
    <Box>
      {/* Sprints Section */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 1.5,
          border: "1.5px solid #e6eafd",
          background: "#fafdff"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <Typography fontWeight={700} fontSize={22} flex={2}>
            Sprints du projet
          </Typography>
          {isAdminOrManager && (
            <ButtonComponent
              text="Créer un sprint"
              icon={<AddCircleOutlineIcon />}
              onClick={() => {
                const newSprint = {
                  id: sprints.length + 1,
                  title: `Sprint ${sprints.length + 1}`,
                  startDate: "2024-08-01",
                  endDate: "2024-08-14",
                  progress: 0,
                  members: [],
                };
                setSprints([...sprints, newSprint]);
              }}
              color="primary"
            />
          )}
        </Stack>
        {paginatedSprints.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center", my: 4 }}>
            Aucun sprint créé pour ce projet.
          </Typography>
        )}
        {paginatedSprints.map((sprint) => (
          <Paper
            key={sprint.id}
            elevation={0}
            sx={{
              my: 1.2,
              px: 2,
              py: 2,
              borderRadius: 4,
              boxShadow: "0 1px 6px #4f8ff914",
              border: "1.3px solid #e8eefb",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                borderColor: "#1976d2",
                background: "#eaf6ff",
                boxShadow: "0 6px 18px #b9dbff44"
              },
              transition: "all 0.14s"
            }}
            onClick={() => onSprintSelect(sprint)}
          >
            {/* Sprint (titre+date) */}
            <Box flex={2}>
              <Typography fontWeight={800} fontSize={18}>
                {sprint.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sprint.startDate} — {sprint.endDate}
              </Typography>
            </Box>
            {/* Progression */}
            <Box flex={1} minWidth={120} display="flex" alignItems="center" gap={2}>
              <LinearProgress
                variant="determinate"
                value={sprint.progress}
                sx={{
                  flex: 1,
                  height: 10,
                  borderRadius: 8,
                  bgcolor: " #e3f2fd",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 8,
                    background: "linear-gradient(90deg,#43a047,#4caf50)"
                  }
                }}
              />
              <Typography fontWeight={800} fontSize={20} color="#41a340" minWidth={45}>
                {sprint.progress}%
              </Typography>
            </Box>
            {/* Membres */}
            <Box flex={1} minWidth={110}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AvatarGroup max={4}>
                  {sprint.members.map((m) => (
                    <Tooltip key={m.id} title={m.name}>
                      <Avatar sx={{ width: 36, height: 36, fontSize: 15 }}>
                        {m.name.split(" ").map(x => x[0]).join("")}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
                <IconButton size="small" color="primary">
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
            </Box>
            {/* Action menu */}
      <Box>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
        {/* Pagination Sprint */}
        {sprintTotalPages > 1 && (
          <PaginationComponent
            count={sprintTotalPages}
            page={sprintPage}
            onChange={(_, value) => setSprintPage(value)}
          />
        )}
      </Paper>

      {/* SECTION MULTI-ÉQUIPES */}
      <Paper
  elevation={2}
  sx={{
    mt: 6,
    p: 3,
    borderRadius: 3,
    border: "1.5px solid #e6eafd",
    background: "#fff"
  }}
>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Équipes du projet
          </Typography>
          <ButtonComponent
            text="Ajouter une équipe"
            onClick={handleAddTeam}
            color="primary"
          />
        </Stack>
        {teams.length === 0 ? (
          <Box sx={{ p: 4, mt: 2, textAlign: "center", borderRadius: 3 }}>
            <Typography color="text.secondary" fontSize={18}>
              Aucune équipe n’a encore été créée pour ce projet.
            </Typography>
            <ButtonComponent
              text="Ajouter une équipe"
              onClick={handleAddTeam}
              sx={{ mt: 3 }}
            />
            </Box>
        ) : (
          <EquipesBoard
            teams={paginatedTeams}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
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

</Box>
  );
};

export default SprintList;
