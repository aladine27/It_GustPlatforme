import React from "react";
import {
  Paper, Stack, Typography, Chip, Tooltip,
  Divider, IconButton, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EquipeMemberCard from "./EquipeMemberCard";
import { StyledCard } from "../../style/style";

const EquipeCard = ({
  team,
  onEditTeam,
  onDeleteTeam,
  onEditMember,
  onDeleteMember,
  onAddMember
}) => (
  <StyledCard
    sx={{
      minWidth: 310,
      maxWidth: 340,
      borderRadius: 1.5,
      p: 2.5,
      bgcolor: "#e3f2fd",
      boxShadow: "0 2px 14px #2196f312",
      mb: 1,
      position: "relative",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography fontWeight={800} fontSize={21} sx={{ color: team.color }}>
          {team.name}
        </Typography>
        <Chip
          label={team.members.length}
          sx={{
            bgcolor: "#fff",
            fontWeight: 700,
            fontSize: 16,
            color: team.color
          }}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Modifier l'équipe">
          <IconButton size="small" onClick={() => onEditTeam(team)}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer l'équipe">
          <IconButton size="small" onClick={() => onDeleteTeam(team)}>
            <DeleteOutlineIcon color="error" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
    <Typography sx={{ color: "#777", ml: 1, mt: 0.2, mb: 1, fontSize: 14 }}>
      {team.type}
    </Typography>
    <Divider sx={{ my: 1 }} />
    <Stack spacing={1.7} sx={{ mt: 1 }}>
      {team.members.map((m) => (
        <EquipeMemberCard
          key={m.id}
          member={m}
          teamColor={team.color}
          onEdit={onEditMember}
          onDelete={onDeleteMember}
        />
      ))}
      <IconButton
        size="small"
        color="primary"
        sx={{ alignSelf: "flex-start", mt: 1 }}
        onClick={() => onAddMember(team)}
      >
        <AddCircleOutlineIcon />
        <Typography sx={{ ml: 0.5, fontWeight: 500, fontSize: 15 }}>
          Ajouter un membre
        </Typography>
      </IconButton>
    </Stack>
  </StyledCard>
);

export default EquipeCard;
