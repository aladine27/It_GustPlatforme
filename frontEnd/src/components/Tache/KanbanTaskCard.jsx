import {
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Divider,
  } from "@mui/material";
  import {
    MoreVert as MoreVertIcon,
    AccessTime as TimeIcon,
    Flag as FlagIcon,
  } from "@mui/icons-material";
import { StyledCard } from "../../style/style";

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };
  
  const getAvatarColor = (name) => {
    const colors = ["#1976d2", "#ff9800", "#43a047", "#f44336", "#9c27b0", "#00bcd4"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FlagIcon sx={{ fontSize: 16, color: getPriorityColor(task.priority), opacity: 0.8 }} />
          <Chip
            label={task.priority.toUpperCase()}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              fontWeight: 600,
              bgcolor: getPriorityColor(task.priority),
              color: "white",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Box>
        <IconButton size="small" sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, lineHeight: 1.4, color: "#1a1a1a" }}>
        {task.title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
        {task.tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            variant="outlined"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              borderColor: "#e0e0e0",
              color: "#666",
              "&:hover": { borderColor: "#bdbdbd" },
            }}
          />
        ))}
      </Box>
      <Divider sx={{ my: 2, opacity: 0.6 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(task.assignee),
              width: 28,
              height: 28,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {task.assignee
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {task.assignee}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TimeIcon sx={{ fontSize: 14, color: "#999" }} />
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {task.timeEstimate}
          </Typography>
        </Box>
      </Box>
    </StyledCard>
  );
  
  export default KanbanTaskCard;
  