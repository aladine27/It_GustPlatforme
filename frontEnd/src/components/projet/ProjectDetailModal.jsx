import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Chip, Box, Divider, IconButton, Typography, Stack, Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledPaper } from '../../style/style';
import { useTranslation } from 'react-i18next';

export default function ProjectDetailModal({
  open,
  handleClose,
  project,
  onEdit,
  onDelete,
  userRole
}) {
  const { t } = useTranslation();
  if (!project) return null;
   // === AJOUTE CES LOGS POUR DEBUG ===
  console.log(">>> project.user brut:", project.user);
  if (typeof project.user === "object") {
    console.log(">>> project.user.fullName:", project.user.fullName);
    console.log(">>> project.user.email:", project.user.email);
  }

  // Statut coloré (chip)
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": case t("Terminé"): return "success";
      case "Ongoing": case t("En cours"): return "warning";
      case "Planned": case t("Planifié"): return "primary";
      default: return "default";
    }
  };

  // Ligne label + valeur stylée
  const DetailRow = ({ label, children }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.3 }}>
      <Typography
        sx={{
          width: { xs: 110, sm: 180 },
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

  // Liste en Chip stylé
  const formatList = arr =>
    Array.isArray(arr) && arr.length
      ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {arr.map((v, i) =>
            <Chip
              key={i}
              label={typeof v === "object" ? (v.title || v.name || JSON.stringify(v)) : v}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500, bgcolor: "#e3f2fd", color: "#227FBF" }}
            />
          )}
        </Box>
      )
      : <Typography variant="body2" color="text.secondary">{t("Aucun")}</Typography>;

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
          boxShadow: '0 6px 30px 0 rgba(25,118,210,0.12)'
        }
      }}
    >
      {/* HEADER identique à Event */}
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
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 800,
            color: "#2563eb",
            letterSpacing: 0.4,
            fontSize: "1.20rem"
          }}
        >
          {project.title}
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

      <DialogContent sx={{ px: { xs: 0, sm: 1 } }}>
        <Stack spacing={0.5}>
          <DetailRow label={t("Description")}>
            <Typography>
              {project.description || <span style={{ color: "#aaa" }}>{t("Aucune description")}</span>}
            </Typography>
          </DetailRow>
          <DetailRow label={t("Durée")}>
            <Typography>{project.duration || <span style={{ color: "#aaa" }}>{t("N/A")}</span>}</Typography>
          </DetailRow>
          <DetailRow label={t("Fichier")}>
            {project.file ?
              <Link href={`/uploads/${project.file}`} target="_blank" underline="hover">
                {project.file}
              </Link>
              :
              <Typography color="#aaa">{t("Aucun")}</Typography>
            }
          </DetailRow>
          <DetailRow label={t("Date début")}>
            <Typography>{project.startDate?.substring(0, 10) || "-"}</Typography>
          </DetailRow>
          <DetailRow label={t("Date fin")}>
            <Typography>{project.endDate?.substring(0, 10) || "-"}</Typography>
          </DetailRow>
          <DetailRow label={t("Statut")}>
            <Chip
              label={project.status ? t(project.status) : t("N/A")}
              size="small"
              color={getStatusColor(project.status)}
              sx={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.4 }}
            />
          </DetailRow>

        <DetailRow label={t("Crée par")}>
  <Typography>
    {project.user && typeof project.user === "object"
      ? (project.user.fullName || "-")
      : (project.user || "-")}
  </Typography>
</DetailRow>
          
        </Stack>
      </DialogContent>

     
    </Dialog>
  );
}
