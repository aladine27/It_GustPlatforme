import React from "react";
import ModelComponent from "../Global/ModelComponent";
import { Box, Typography, Stack, Avatar, Link, Button } from "@mui/material";
import { CalendarToday, InsertDriveFile, Check, Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Utilitaires pour labels/valeurs
const Label = ({ children }) => (
  <Typography fontWeight={700} sx={{ mb: 0.2, color: "#212529" }}>
    {children}
  </Typography>
);

const Value = ({ children }) => (
  <Typography sx={{ color: "#6c757d", mb: 1.2 }}>{children}</Typography>
);

const Row = ({ label, icon, value, isLink }) => (
  <Box display="flex" alignItems="center" sx={{ mb: 0.8 }}>
    {icon && <Box sx={{ mr: 1, mt: 0.3 }}>{icon}</Box>}
    <Box>
      <Label>{label}</Label>
      {isLink ? (
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: "#2563eb", fontWeight: 600, display: "flex", alignItems: "center" }}
        >
          <InsertDriveFile sx={{ fontSize: 19, mr: 0.7 }} />
          Voir le justificatif
        </Link>
      ) : (
        <Value>{value}</Value>
      )}
    </Box>
  </Box>
);

const getUserName = (leave) => {
  if (leave?.user?.fullName) return leave.user.fullName;
  if (leave?.user?.name) return leave.user.name;
  return "Inconnu";
};

const getUserImage = (leave) => {
  // Ajoute un log pour debug
  if (leave?.user) {
    console.log("User récupéré du backend :", leave.user);
    if (leave.user.image && typeof leave.user.image === "string") {
      // On vérifie si l'URL semble valide
      if (leave.user.image.startsWith("http") || leave.user.image.startsWith("/uploads")) {
        return leave.user.image;
      }
      // Cas où ce n'est qu'un nom de fichier (chemin relatif)
      if (leave.user.image.length > 2 && !leave.user.image.includes("undefined")) {
        return `http://localhost:3000/uploads/users/${leave.user.image}`;
      }
    }
  }
  return null;
};

const getUserRole = (leave) =>
  leave?.user?.role ? leave.user.role : "";

const CongeDetailModal = ({
  open,
  handleClose,
  leave,
  onApprove,
  onReject,
}) => {
  if (!leave) return null;

  // Format dates
  const startDate = leave.startDate ? dayjs(leave.startDate).format("DD/MM/YYYY") : "-";
  const endDate = leave.endDate ? dayjs(leave.endDate).format("DD/MM/YYYY") : "-";
  const fileUrl = leave.reasonFile
    ? `http://localhost:3000/uploads/leaves/${leave.reasonFile}`
    : null;

  const userName = getUserName(leave);
  const userImage = getUserImage(leave);
  const userRole = getUserRole(leave);

  // Toast handlers
  const handleApprove = () => {
    if (onApprove) onApprove(leave._id);
    toast.success("Demande de congé acceptée !");
    handleClose();
  };

  const handleReject = () => {
    if (onReject) onReject(leave._id);
    toast.error("Demande de congé refusée !");
    handleClose();
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title={
        <span style={{ display: "flex", alignItems: "center", fontWeight: 700 }}>
          <InsertDriveFile fontSize="inherit" style={{ color: "#6c63ff", marginRight: 8 }} />
          Détail de la demande
        </span>
      }
    >
      <Box
        sx={{
          px: { xs: 0.5, md: 2 },
          py: { xs: 1.5, md: 3 },
          width: { xs: "100%", md: 410 },
          mx: "auto",
        }}
      >
        {/* Affichage employé */}
        <Stack direction="row" spacing={2}  sx={{ mb: 1 }}>
          <Avatar
            src={userImage || undefined}
            alt={userName}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "#b0b5bc",
              color: "#212529",
              fontSize: 25,
              fontWeight: 700,
              border: "2px solid #e3e6ea",
              objectFit: "cover",
            }}
            imgProps={{
              style: { objectFit: "cover", width: "100%", height: "100%" }
            }}
          >
            {!userImage && userName[0]}
          </Avatar>
          <Box>
            <Typography fontWeight={700} fontSize={23} sx={{ lineHeight: 1.2 }}>
              {userName}
            </Typography>
            <Typography fontWeight={500} fontSize={15} color="#828282" sx={{ mt: 0.2 }}>
              {userRole}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 1.3, pl: 0.2 }}>
          <Row label="Type de congé :" value={leave.title} />
          <Row
            label="Début :"
            value={startDate}
            icon={<CalendarToday sx={{ fontSize: 18, color: "#adb5bd" }} />}
          />
          <Row
            label="Fin :"
            value={endDate}
            icon={<CalendarToday sx={{ fontSize: 18, color: "#adb5bd" }} />}
          />
          <Row label="Nombre de jours :" value={leave.duration} />
          <Row label="Motif :" value={leave.reason || <i>Aucun motif précisé</i>} />
          {fileUrl && (
            <Row label="Justificatif :" value={fileUrl} isLink />
          )}
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" mt={4} mb={1.5}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Check />}
            sx={{ fontWeight: 600, px: 4, borderRadius: 2 }}
            onClick={handleApprove}
          >
            Accepter
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Close />}
            sx={{ fontWeight: 600, px: 4, borderRadius: 2 }}
            onClick={handleReject}
          >
            Refuser
          </Button>
        </Stack>
      </Box>
    </ModelComponent>
  );
};

export default CongeDetailModal;
