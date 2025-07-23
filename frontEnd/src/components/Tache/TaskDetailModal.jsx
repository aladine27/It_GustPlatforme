import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
  Divider,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledPaper } from "../../style/style";
import { useTranslation } from "react-i18next";


export default function TaskDetailsModal({
  open,
  handleClose,
  task,
  onEdit,      // facultatif (pour Admin)
  onDelete,    // facultatif (pour Admin)
  userRole,    // "Admin", "Manager", "Employé"
}) {
  const { t } = useTranslation();
  if (!task) return null;

  // Ligne de détails stylée
  const DetailRow = ({ label, children }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.2 }}>
      <Typography
        sx={{
          width: { xs: 110, sm: 160 },
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

  // Pour le Chip de priorité
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "haute":
      case "high":
        return "error";
      case "moyenne":
      case "medium":
        return "warning";
      case "basse":
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  // Pour le Chip de statut
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "terminé":
      case "done":
        return "success";
      case "en cours":
      case "in progress":
        return "warning";
      case "review":
        return "info";
      case "backlog":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: StyledPaper,
        sx: {
          p: { xs: 1.2, sm: 2.5 },
          borderRadius: 3,
          background: "#f9fbfd",
          border: "1.5px solid #b3d6fc",
          boxShadow: "0 6px 30px 0 rgba(25,118,210,0.12)"
        }
      }}
    >
      {/* Titre et bouton close */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: "linear-gradient(90deg, #e3f2fd 0%, #e0f1ff 100%)",
          pb: 1,
          borderRadius: "14px 14px 0 0"
        }}
      >
        <Typography variant="h6" component="div" fontWeight={800} color="#2563eb" fontSize="1.18rem">
          {task.title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: '#227FBF',
            background: "#f3faff",
            '&:hover': { background: "#e3f2fd" },
            ml: 2
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      {/* Corps du modal */}
      <DialogContent sx={{ px: { xs: 0, sm: 1 } }}>
        <Stack spacing={0.5}>
          <DetailRow label={t("Description")}>
            <Typography>
              {task.description || <span style={{ color: "#aaa" }}>{t("Aucune description")}</span>}
            </Typography>
          </DetailRow>

          <DetailRow label={t("Statut")}>
            <Chip
              label={task.status ? t(task.status) : t("N/A")}
              size="small"
              color={getStatusColor(task.status)}
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
          </DetailRow>

          <DetailRow label={t("Priorité")}>
            <Chip
              label={task.priority ? t(task.priority) : t("N/A")}
              size="small"
              color={getPriorityColor(task.priority)}
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
          </DetailRow>

          <DetailRow label={t("Affectée à")}>
            <Chip
              label={task.user?.fullName || task.user?.name || t("Non assigné")}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, bgcolor: "#e3f2fd", color: "#1976d2" }}
            />
          </DetailRow>
        </Stack>
      </DialogContent>

      {/* Actions si Admin/Manager */}
      {(userRole === "Admin" || userRole === "Manager") && (
        <>
          <Divider sx={{ mt: 1 }} />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onEdit && onEdit(task)}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {t("Modifier")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => onDelete && onDelete(task)}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {t("Supprimer")}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
