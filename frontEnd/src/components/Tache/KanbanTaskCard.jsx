import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Paper,
  Menu,
  MenuItem
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  InfoOutlined,
  EditOutlined,
  DeleteOutline
} from "@mui/icons-material";
import LabelIcon from "@mui/icons-material/Label";

// 🟡 Couleurs de statut
const categoryColors = {
  BACKLOG: "#3f51b5",
  PLANNED: "#388e3c",
  ONGOING: "#1976d2",
  DONE: "#5c5c5c",
  REVIEW: "#fbc02d",
};

// 🔴 Couleurs de priorité
const priorityColors = {
  high: "#d32f2f",
  medium: "#ed6c02",
  low: "#388e3c",
};

// ✅ Récupération de l'image de profil comme EquipeMemberCard
const getAvatarSrc = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return `${image}?t=${Date.now()}`;
  return `http://localhost:3000/uploads/users/${encodeURIComponent(image)}?t=${Date.now()}`;
};

const getUserAvatarLetter = (user) => {
  if (!user) return "U";
  const full = user.fullName || user.name || "";
  return full.charAt(0).toUpperCase();
};

const KanbanTaskCard = ({
  task,
  isDragging,
  onDetails,
  isAdminOrManager,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const avatarSrc = getAvatarSrc(task.user?.image);

  return (
    <Paper
      elevation={isDragging ? 6 : 3}
      sx={{
        mb: 2.3, px: 2.3, pt: 2, pb: 1.5,
        borderRadius: 2, minHeight: 110, maxWidth: 320, width: "100%",
        border: "1.5px solid #e6eafd", background: "#fafdff",
        position: "relative", cursor: isDragging ? "grabbing" : "pointer",
        transition: "box-shadow 0.18s, border-color 0.17s",
        "&:hover": { borderColor: "#1976d2" },
        display: "flex", flexDirection: "column", justifyContent: "space-between"
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.85 }}>
          {task.status && (
            <Chip
              icon={<LabelIcon sx={{ color: "#757de8", fontSize: 17 }} />}
              label={task.status.toUpperCase()}
              size="small"
              sx={{
                fontWeight: 700, fontSize: "0.74rem",
                bgcolor: "#f1f4fc",
                color: categoryColors[task.status.toUpperCase()] || "#1976d2",
                px: 0.7, height: 24, borderRadius: 1.5,
              }}
            />
          )}
          {task.priority && (
            <Chip
              label={task.priority.toUpperCase()}
              size="small"
              sx={{
                bgcolor: priorityColors[task.priority] || "#e0e0e0",
                color: "#fff",
                fontWeight: 700, fontSize: "0.75rem",
                height: 24, borderRadius: 1,
              }}
            />
          )}
        </Box>
        {isAdminOrManager && (
          <>
            <IconButton size="small" sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }} onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onEdit && onEdit(task);
                }}
              >
                <EditOutlined sx={{ mr: 1, fontSize: 18 }} /> Modifier
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onDelete && onDelete(task);
                }}
              >
                <DeleteOutline sx={{ mr: 1, fontSize: 18 }} color="error" /> Supprimer
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Titre */}
      <Typography
        fontWeight={800}
        fontSize={16}
        sx={{
          color: "#222f43", mb: 0.22,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}
        title={task.title}
      >
        {task.title}
      </Typography>

      {/* Description */}
      {task.description && (
        <Typography
          color="text.secondary"
          fontSize={13.5}
          sx={{
            mb: 0.5,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
          title={task.description}
        >
          {task.description}
        </Typography>
      )}

      {/* Footer */}
      <Box
        sx={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", mt: 1.4,
        }}
      >
        <Tooltip title={task.user?.fullName || task.user?.name || "Utilisateur"}>
          <Avatar
            src={avatarSrc}
            sx={{
              width: 31, height: 31,
              bgcolor: "#e4eaf6", color: "#1976d2",
              fontWeight: 700, fontSize: "1.07rem",
              boxShadow: "0 1px 3px #eaeaea",
            }}
          >
            {(!task.user?.image || !avatarSrc) && getUserAvatarLetter(task.user)}
          </Avatar>
        </Tooltip>

        <Button
          size="small"
          variant="outlined"
          startIcon={<InfoOutlined />}
          onClick={() => onDetails && onDetails(task)}
          sx={{
            fontSize: "0.85rem",
            textTransform: "none",
            ml: 1, px: 1.5, py: 0.4, minWidth: 0,
            borderRadius: 1.7,
            borderColor: "#1976d2", color: "#1976d2",
            '&:hover': { bgcolor: "#e3edfc", borderColor: "#1976d2" }
          }}
        >
          Détails
        </Button>
      </Box>
    </Paper>
  );
};

export default KanbanTaskCard;
