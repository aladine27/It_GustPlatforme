import React from 'react';
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
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledPaper } from '../../style/style';
import { useTranslation } from 'react-i18next';

export default function EventDetailsModal({
  open,
  handleClose,
  event,
  eventTypes,
  onEdit,
  onDelete,
  userRole
}) {
  const { t, i18n } = useTranslation();

  if (!event) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case t("Terminé"):
      case "Terminé":
        return "success";
      case t("Annulé"):
      case "Annulé":
        return "error";
      case t("En cours"):
      case "En cours":
        return "warning";
      default:
        return "default";
    }
  };

  // Gère la locale dynamiquement (sécurisé pour .toLocaleString)
  const getLocale = () => {
    if (i18n.language && i18n.language.startsWith('fr')) return 'fr-FR';
    if (i18n.language && i18n.language.startsWith('en')) return 'en-US';
    return 'fr-FR'; // fallback
  };

  // Un item pour chaque ligne d'info
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
          {event.title}
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
              {event.description || <span style={{ color: "#aaa" }}>{t("Aucune description")}</span>}
            </Typography>
          </DetailRow>

          <DetailRow label={t("Date et heure de début")}>
            <Typography>
              {event.startDate
                ? new Date(event.startDate).toLocaleString(getLocale())
                : <span style={{ color: "#aaa" }}>{t("N/A")}</span>}
            </Typography>
          </DetailRow>

          <DetailRow label={t("Durée")}>
            <Typography>{event.duration || <span style={{ color: "#aaa" }}>{t("N/A")}</span>}</Typography>
          </DetailRow>

          <DetailRow label={t("Emplacement")}>
            <Typography>{event.location || <span style={{ color: "#aaa" }}>{t("N/A")}</span>}</Typography>
          </DetailRow>

          <DetailRow label={t("Statut")}>
            <Chip
              label={event.status ? t(event.status) : t("N/A")}
              size="small"
              color={getStatusColor(event.status)}
              sx={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.4 }}
            />
          </DetailRow>

          <DetailRow label={t("Type d'événement")}>
            <Typography>
              {event.types && event.types.length > 0 && event.types[0]?.name
                ? event.types[0].name
                : <span style={{ color: "#aaa" }}>{t("Non défini")}</span>}
            </Typography>
          </DetailRow>

          <DetailRow label={t("Invités")}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.isArray(event.invited) && event.invited.length > 0
                ? event.invited
                    .filter(user => !!user && (user.fullName || user.name))
                    .map(user => (
                      <Chip
                        key={user._id || user.id || Math.random()}
                        label={user.fullName || user.name || t("invité")}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500, bgcolor: "#e3f2fd", color: "#227FBF" }}
                      />
                    ))
                : <Typography variant="body2" color="text.secondary">{t("Aucun invité")}</Typography>
              }
            </Box>
          </DetailRow>
        </Stack>
      </DialogContent>

      {["Admin", "RH"].includes(userRole) && (
        <>
          <Divider sx={{ mt: 1 }} />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onEdit}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {t("Modifier")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => onDelete(event._id)}
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
