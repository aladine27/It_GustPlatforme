import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Box,
  Link,
  Button,
  Divider,
} from "@mui/material";
import {
  CalendarToday,
  InsertDriveFile,
  Close as CloseIcon,
  CheckCircle,
  Cancel,
  Visibility,
  Check,
  Close,
} from "@mui/icons-material";
import { StyledPaper } from "../../style/style";
import dayjs from "dayjs";
import { toast } from "react-toastify";

// Chip pour statut
const getStatusChip = (status) => {
  const statusConfig = {
    approved: {
      color: "#4caf50",
      label: "Approuvé",
      icon: <CheckCircle sx={{ fontSize: 16, mr: 0.7 }} />,
    },
    rejected: {
      color: "#f44336",
      label: "Rejeté",
      icon: <Cancel sx={{ fontSize: 16, mr: 0.7 }} />,
    },
  };
  const config = statusConfig[status] || { color: "#888", label: status };
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
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

// Ligne info
const DetailRow = ({ label, children }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.2 }}>
    <Typography
      sx={{
        width: { xs: 120, sm: 180 },
        minWidth: 90,
        color: "primary.main",
        fontWeight: 700,
        fontSize: "1rem",
      }}
    >
      {label}
    </Typography>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Stack>
);

const getUserName = (leave) =>
  leave?.user?.fullName || leave?.user?.name || "Inconnu";

const getUserRole = (leave) => leave?.user?.role || "";

const getUserImage = (leave) => {
  if (leave?.user?.image && typeof leave.user.image === "string") {
    if (
      leave.user.image.startsWith("http") ||
      leave.user.image.startsWith("/uploads")
    ) {
      return leave.user.image;
    }
    if (
      leave.user.image.length > 2 &&
      !leave.user.image.includes("undefined")
    ) {
      return `http://localhost:3000/uploads/users/${leave.user.image}`;
    }
  }
  return "";
};

export default function CongeDetailModal({
  open,
  handleClose,
  leave,
  onApprove,
  onReject,
}) {
  if (!leave) return null;

  const userName = getUserName(leave);
  const userRole = getUserRole(leave);
  const userImage = getUserImage(leave);

  const startDate = leave.startDate
    ? dayjs(leave.startDate).format("DD/MM/YYYY")
    : "—";
  const endDate = leave.endDate
    ? dayjs(leave.endDate).format("DD/MM/YYYY")
    : "—";
  const fileUrl = leave.reasonFile
    ? `http://localhost:3000/uploads/leaves/${leave.reasonFile}`
    : null;

  // Boutons d’action
  const handleApproveClick = () => {
    if (onApprove) onApprove(leave._id);
    toast.success("Demande approuvée !");
    handleClose();
  };
  const handleRejectClick = () => {
    if (onReject) onReject(leave._id);
    toast.success("Demande refusée !");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: StyledPaper,
        sx: {
          p: { xs: 1.3, sm: 3 },
          borderRadius: 3,
          background: "#f9fbfd",
          border: "1.5px solid #b3d6fc",
          boxShadow: "0 6px 30px 0 rgba(25,118,210,0.12)",
        },
      }}
    >
 
    

      <Divider sx={{ mb: 2, mt: 0.5 }} />
      <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: "#227FBF",
            background: "#f3faff",
            "&:hover": { background: "#e3f2fd" },
            ml: 2,
            position: "absolute",
            right: 14,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

      <DialogContent sx={{ px: { xs: 0, sm: 1 } }}>
        {/* Utilisateur */}
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
            <Typography
              fontWeight={500}
              fontSize={15}
              color="#828282"
              sx={{ mt: 0.2 }}
            >
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
              {startDate}
            </Typography>
          </DetailRow>
          <DetailRow label="Fin :">
            <Typography>
              <CalendarToday sx={{ fontSize: 18, color: "#adb5bd", mr: 1 }} />
              {endDate}
            </Typography>
          </DetailRow>
          <DetailRow label="Nombre de jours :">
            <Typography>{leave.duration} jours</Typography>
          </DetailRow>
          <DetailRow label="Statut :">{getStatusChip(leave.status)}</DetailRow>
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
                sx={{
                  color: "#2563eb",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InsertDriveFile sx={{ fontSize: 18, mr: 0.7 }} />
                Voir le justificatif
              </Link>
            </DetailRow>
          )}
        </Stack>
      </DialogContent>

      {/* Boutons d’action */}
      <DialogActions sx={{ p: 2, gap: 1, justifyContent: "center" }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<Check />}
          sx={{ fontWeight: 600, px: 4, borderRadius: 2 }}
          onClick={handleApproveClick}
        >
          Accepter
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Close />}
          sx={{ fontWeight: 600, px: 4, borderRadius: 2 }}
          onClick={handleRejectClick}
        >
          Refuser
        </Button>
      </DialogActions>
    </Dialog>
  );
}
