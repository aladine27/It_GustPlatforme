import React from "react";
import { Paper, Avatar, Box, Typography, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const getAvatarSrc = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return `${image}?t=${Date.now()}`;
  return `http://localhost:3000/uploads/users/${encodeURIComponent(image)}?t=${Date.now()}`;
};

const EquipeMemberCard = ({ member, teamColor, onDelete }) => {
  const avatarSrc = getAvatarSrc(member?.image);

  return (
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
      <Avatar
        src={avatarSrc}
        alt={member.fullName || member.name}
        sx={{
          width: 38,
          height: 38,
          fontWeight: 600,
          bgcolor: teamColor + "99"
        }}
      >
        {/* Affiche initiales si pas d'image */}
        {(!member.image || !avatarSrc) && (member.fullName || member.name || "")
          .split(" ")
          .map((x) => x[0])
          .join("")}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography fontWeight={700} fontSize={15}>{member.fullName || member.name}</Typography>
        <Typography fontSize={13.5} color="text.secondary">{member.domain}</Typography>
      </Box>
      <IconButton size="small" onClick={() => onDelete(member)}>
        <DeleteOutlineIcon fontSize="small" color="error" />
      </IconButton>
    </Paper>
  );
};

export default EquipeMemberCard;
