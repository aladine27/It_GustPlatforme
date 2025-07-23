import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Paper
} from "@mui/material";
import { MoreVert as MoreVertIcon, InfoOutlined } from "@mui/icons-material";
import LabelIcon from "@mui/icons-material/Label";

const categoryColors = {
  BACKLOG: "#3f51b5",
  PLANNED: "#388e3c",
  ONGOING: "#1976d2",
  DONE: "#5c5c5c",
  REVIEW: "#fbc02d",
};
const priorityColors = {
  high: "#d32f2f",
  medium: "#ed6c02",
  low: "#388e3c",
};

const getUserAvatar = (user) => {
  if (!user) return "U";
  if (user.fullName) return user.fullName.charAt(0).toUpperCase();
  if (user.name) return user.name.charAt(0).toUpperCase();
  return "U";
};

const KanbanTaskCard = ({ task, isDragging, onDetails }) => {
  return (
    <Paper
      elevation={isDragging ? 6 : 3}
      sx={{
        mb: 2.3,
        px: 2.3,
        pt: 2,
        pb: 1.5,
        borderRadius: 2,
        minHeight: 110,
        maxWidth: 320,
        width: "100%",
        border: "1.5px solid #e6eafd",
        background: "#fafdff",
        position: "relative",
        cursor: isDragging ? "grabbing" : "pointer",
        // === AUCUN boxShadow custom ici ===
        transition: "box-shadow 0.18s, border-color 0.17s",
        "&:hover": {
          borderColor: "#1976d2",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* Header Statut + Priorité + Menu */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.85 }}>
          {task.status && (
            <Chip
              icon={<LabelIcon sx={{ color: "#757de8", fontSize: 17 }} />}
              label={task.status.toUpperCase()}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.74rem",
                bgcolor: "#f1f4fc",
                color: categoryColors[task.status.toUpperCase()] || "#1976d2",
                px: 0.7,
                height: 24,
                borderRadius: 1.5,
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
                fontWeight: 700,
                fontSize: "0.75rem",
                height: 24,
                borderRadius: 1,
              }}
            />
          )}
        </Box>
        <IconButton size="small" sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Titre */}
      <Typography
        fontWeight={800}
        fontSize={16}
        sx={{
          color: "#222f43",
          mb: 0.22,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
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
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={task.description}
        >
          {task.description}
        </Typography>
      )}

      {/* Footer: avatar + bouton détails */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1.4,
        }}
      >
        <Tooltip title={task.user?.fullName || task.user?.name || "Utilisateur"}>
          <Avatar
            sx={{
              width: 31,
              height: 31,
              bgcolor: "#e4eaf6",
              color: "#1976d2",
              fontWeight: 700,
              fontSize: "1.07rem",
              boxShadow: "0 1px 3px #eaeaea",
            }}
          >
            {getUserAvatar(task.user)}
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
            ml: 1,
            px: 1.5,
            py: 0.4,
            minWidth: 0,
            borderRadius: 1.7,
            borderColor: "#1976d2",
            color: "#1976d2",
            '&:hover': {
              bgcolor: "#e3edfc",
              borderColor: "#1976d2"
            }
          }}
        >
          Détails
        </Button>
      </Box>
    </Paper>
  );
};

export default KanbanTaskCard;
