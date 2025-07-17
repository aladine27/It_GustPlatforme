import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { MoreVert as MoreVertIcon, AccessTime as TimeIcon } from "@mui/icons-material";
import { StyledCard } from "../../style/style";

// Définis tes couleurs pour les priorités
const priorityColors = {
  high: "#d32f2f",
  medium: "#ed6c02",
  low: "#388e3c",
};

const KanbanTaskCard = ({ task, isDragging }) => (
  <StyledCard
    elevation={isDragging ? 6 : 2}
    sx={{
      mb: 2,
      cursor: isDragging ? "grabbing" : "grab",
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      zIndex: isDragging ? 999 : 1,
      position: isDragging ? "relative" : "static",
      transition: "box-shadow 0.18s",
      "&:hover": !isDragging
        ? { boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }
        : {},
    }}
  >
    {/* EN-TÊTE */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
      <Chip
        label={task.status ? task.status.toUpperCase() : ""}
        size="small"
        sx={{
          height: 20,
          fontSize: "0.7rem",
          fontWeight: 600,
          bgcolor: "#1976d2",
          color: "white",
          "& .MuiChip-label": { px: 1 },
        }}
      />
      <IconButton size="small" sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Box>
    {/* TITRE */}
    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, lineHeight: 1.4, color: "#1a1a1a" }}>
      {task.title}
    </Typography>
    {/* PRIORITÉ */}
    {task.priority && (
      <Chip
        label={task.priority.toUpperCase()}
        size="small"
        sx={{
          bgcolor: priorityColors[task.priority] || "#e0e0e0",
          color: "white",
          fontWeight: 700,
          mb: 1,
        }}
      />
    )}
    {/* DESCRIPTION */}
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      {task.description}
    </Typography>
    <Divider sx={{ my: 2, opacity: 0.6 }} />
    {/* INFOS BAS */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {/* User assigné */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          sx={{
            bgcolor: "#43a047",
            width: 28,
            height: 28,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {task.user && typeof task.user === "object"
            ? (task.user.fullName || task.user.name || "U").charAt(0)
            : "U"}
        </Avatar>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {task.user && typeof task.user === "object"
            ? task.user.fullName || task.user.name || "Utilisateur"
            : "Utilisateur"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <TimeIcon sx={{ fontSize: 14, color: "#999" }} />
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {task.duration || ""}
        </Typography>
      </Box>
    </Box>
  </StyledCard>
);

export default KanbanTaskCard;
