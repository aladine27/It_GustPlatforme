import React from "react";
import { Box, Typography, Paper, Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const EquipeMemberCard = ({ member, teamColor, onEdit, onDelete }) => (
  <Paper
    elevation={0}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 1.2,
      py: 1,
      borderRadius: 3,
      border: "1px solid #b5cfff",
      bgcolor: "#fff",
    }}
  >
    <Avatar sx={{
      width: 38, height: 38,
      fontWeight: 600,
      bgcolor: teamColor + "99"
    }}>
      {member.name.split(" ").map((x) => x[0]).join("")}
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Typography fontWeight={700} fontSize={15}>{member.name}</Typography>
      <Typography fontSize={13.5} color="text.secondary">{member.role}</Typography>
    </Box>
   
    <IconButton size="small" onClick={() => onDelete(member)}>
      <DeleteOutlineIcon fontSize="small" color="error" />
    </IconButton>
  </Paper>
);

export default EquipeMemberCard;
