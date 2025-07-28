import { Stack, Typography, Chip, Tooltip, Divider, IconButton, Paper, Box, Avatar, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EquipeMemberCard from "./EquipeMemberCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; 
const EquipeCard = ({
  team,
  onEditTeam,
  onDeleteTeam,
  onEditMember,
  onDeleteMember,
  onAddMember,
  isAdminOrManager,
    teamIndex 
}) => {
  
  const memberCount = team.employeeList?.length ?? 0;
  const isEmpty = memberCount === 0;
   console.log(`[EquipeCard] Render #${teamIndex} - team.title =`, team.title);
  console.log(`[EquipeCard] Render #${teamIndex} - team:`, team);
  console.log(`[EquipeCard] Render #${teamIndex} - team.employeeList:`, team.employeeList); 

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 310,
        maxWidth: 340,
        borderRadius: 1.5,
        p: 0,
        mb: 2,
        border: "1.5px solid #e3f2fd",
        background: "linear-gradient(135deg, #F3F6FB 0%, #e3f2fd 100%)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(25,118,210,0.15)",
          border: "1.5px solid #1976d2",
          "& .team-avatar": {
            transform: "scale(1.1) rotate(5deg)",
            boxShadow: `0 8px 20px ${team.color}40`,
          },
          "& .action-buttons": {
            opacity: 1,
            transform: "translateX(0)",
          },
          "& .team-stats": {
            transform: "scale(1.05)",
          },
          "& .add-member-btn": {
            borderColor: team.color,
            borderStyle: "solid",
            transform: "translateY(-2px)",
            "& .add-icon": {
              transform: "rotate(90deg)",
            },
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${team.color} 0%, ${team.color}80 100%)`,
          borderRadius: "16px 16px 0 0",
          boxShadow: `0 2px 8px ${team.color}30`,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 4,
          right: 20,
          width: 60,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${team.color}60)`,
          borderRadius: 1,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack spacing={1}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: 20,
                color: team.color,
                letterSpacing: "-0.02em",
                textShadow: `0 1px 2px ${team.color}20`,
              }}
            >
              {team.title}
            </Typography>
            {team.type && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <WorkIcon sx={{ fontSize: 14, color: "#0288d1" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#0288d1",
                    fontWeight: 500,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {team.type}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              className="team-stats"
              icon={<GroupIcon sx={{ fontSize: 16 }} />}
              label={memberCount}
              size="small"
              sx={{
                bgcolor: isEmpty ? "rgba(251,192,45,0.1)" : "rgba(46,125,50,0.1)",
                color: isEmpty ? "#fbc02d" : "#2e7d32",
                fontWeight: 700,
                fontSize: 14,
                border: `1px solid ${isEmpty ? "#fbc02d40" : "#2e7d3240"}`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            {isAdminOrManager && (
              <Stack direction="row" spacing={0.5} className="action-buttons" sx={{ opacity: 0.7, transform: "translateX(8px)", transition: "all 0.3s" }}>
                <Tooltip title="Modifier l'équipe" arrow>
                  <IconButton size="small" onClick={() => onEditTeam(team)}>
                    <EditIcon sx={{ fontSize: 16, color: "#1976d2" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer l'équipe" arrow>
                  <IconButton size="small" onClick={() => onDeleteTeam(team)}>
                    <DeleteOutlineIcon sx={{ fontSize: 16, color: "#d32f2f" }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ mx: 3, borderColor: `${team.color}20` }} />

      {/* Membres */}
      <Box sx={{ p: 3, pt: 2 }}>
        {isEmpty ? (
          <Box textAlign="center" py={3} color="text.secondary">
            <GroupIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "#0288d1" }}>
              Aucun membre dans cette équipe
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 280, overflowY: "auto", pr: 1 }}>
            <Stack spacing={2}>
              {team.employeeList.map((m, index) => (
                <Box
                  key={m._id}
                  sx={{
                    animation: `slideIn 0.5s ease ${index * 0.1}s both`,
                    "@keyframes slideIn": {
                      from: { opacity: 0, transform: "translateX(-20px)" },
                      to: { opacity: 1, transform: "translateX(0)" },
                    },
                  }}
                >
                  <EquipeMemberCard
                    member={m}
                    teamColor={team.color}
                    onDelete={(member) => onDeleteMember && onDeleteMember(team, member)}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {isAdminOrManager && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
  <Button
    onClick={() => onAddMember && onAddMember(team)}
    variant="outlined"
    color="primary"
    startIcon={<AddCircleOutlineIcon />}
    sx={{ px: 2.5, py: 1, borderRadius: 10 }}
  >
    Ajouter un membre
  </Button>
</Box>

        )}
      </Box>
    </Paper>
  );
};

export default EquipeCard;