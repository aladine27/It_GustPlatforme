import React from "react";
import {
  Typography, Stack, Avatar, Box, Link, Divider
} from "@mui/material";
import { CalendarToday, InsertDriveFile, Cancel, CheckCircle } from "@mui/icons-material";

// Plus besoin de StyledPaper ici si tu n'utilises pas Dialog
export default function LeaveDetailModal({ leave }) {
 
  if (!leave) {
    console.log("[LeaveDetailModal] leave est null ou undefined");
    return <Typography color="error" sx={{ textAlign: 'center' }}>Aucune donnée de congé sélectionnée.</Typography>;
  }

  // Helpers utilisateur
  const userName = leave.user?.fullName || leave.user?.name || "Inconnu";
  const userRole = leave.user?.role || "";
  const userImage = leave.user?.image
    ? leave.user.image.startsWith("http")
      ? leave.user.image
      : `http://localhost:3000/uploads/users/${leave.user.image}`
    : "";

  // Statut visuel
  const getStatusChip = (status) => {
    const statusConfig = {
      approved: {
        color: "#4caf50",
        label: "Approuvé",
        icon: <CheckCircle sx={{ fontSize: 16, mr: 0.7 }} />
      },
      rejected: {
        color: "#f44336",
        label: "Rejeté",
        icon: <Cancel sx={{ fontSize: 16, mr: 0.7 }} />
      }
    };
    const config = statusConfig[status] || { color: "#888", label: status };
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          background: config.color,
          color: "#fff",
          borderRadius: 15,
          fontWeight: 600,
          fontSize: 14,
          px: 1.5,
          py: 0.5,
        }}
      >
        {config.icon}
        {config.label}
      </Box>
    );
  };

  const fileUrl = leave.reasonFile
    ? `http://localhost:3000/uploads/leaves/${leave.reasonFile}`
    : null;

  // Une ligne d’info
  const DetailRow = ({ label, children }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.1 }}>
      <Typography
        sx={{
          width: { xs: 120, sm: 180 },
          minWidth: 90,
          color: "primary.main",
          fontWeight: 700,
          fontSize: "1rem"
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Stack>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, background: "transparent" }}>
      {/* Header utilisateur */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar
          src={userImage || undefined}
          alt={userName}
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#b0b5bc",
            color: "#2563eb",
            fontSize: 25,
            fontWeight: 700,
            border: "2px solid #e3e6ea",
            objectFit: "cover",
          }}
        >
          {!userImage && userName[0]}
        </Avatar>
        <Box>
          <Typography fontWeight={700} fontSize={22} sx={{ lineHeight: 1.15 }}>
            {userName}
          </Typography>
          <Typography fontWeight={500} fontSize={15} color="#828282" sx={{ mt: 0.2 }}>
            {userRole}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {/* Infos du congé */}
      <Stack spacing={0.5}>
        <DetailRow label="Type de congé :">
          <Typography>{leave.leaveType?.name || "—"}</Typography>
        </DetailRow>
        <DetailRow label="Début :">
          <Typography>
            <CalendarToday sx={{ fontSize: 18, color: "#adb5bd", mr: 1 }} />
            {leave.startDate ? new Date(leave.startDate).toLocaleDateString("fr-FR") : "—"}
          </Typography>
        </DetailRow>
        <DetailRow label="Fin :">
          <Typography>
            <CalendarToday sx={{ fontSize: 18, color: "#adb5bd", mr: 1 }} />
            {leave.endDate ? new Date(leave.endDate).toLocaleDateString("fr-FR") : "—"}
          </Typography>
        </DetailRow>
        <DetailRow label="Nombre de jours :">
          <Typography>{leave.duration} jours</Typography>
        </DetailRow>
        <DetailRow label="Statut :">
          {getStatusChip(leave.status)}
        </DetailRow>
        <DetailRow label="Motif :">
          <Typography>{leave.reason || <span style={{ color: "#aaa" }}>—</span>}</Typography>
        </DetailRow>
        {fileUrl && (
          <DetailRow label="Justificatif :">
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: "#2563eb", fontWeight: 600, display: "flex", alignItems: "center" }}
            >
              <InsertDriveFile sx={{ fontSize: 18, mr: 0.7 }} />
              Voir le justificatif
            </Link>
          </DetailRow>
        )}
      </Stack>
    </Box>
  );
}
