import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip,
  Box, Divider, IconButton, Typography, Stack, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledPaper } from '../../style/style';
import { useTranslation } from 'react-i18next';

export default function EmployeeDetailsModal({ open, handleClose, employe }) {
  const { t } = useTranslation();

  if (!employe) return null;

  // Une ligne d’info
  const DetailRow = ({ label, children }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.1 }}>
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: StyledPaper,
        sx: {
          p: { xs: 1.2, sm: 3 },
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
          alignItems: 'center',
          background: "linear-gradient(90deg, #e3f2fd 0%, #e0f1ff 100%)",
          pb: 1,
          borderRadius: "14px 14px 0 0"
        }}
      >
        <Avatar
          src={
            employe.image?.startsWith('http')
              ? `${employe.image}?t=${Date.now()}`
              : employe.image
                ? `http://localhost:3000/uploads/users/${encodeURIComponent(employe.image)}?t=${Date.now()}`
                : undefined
          }
          alt={employe.fullName}
          sx={{
            width: 58,
            height: 58,
            mr: 2,
            border: '2.5px solid #b3d6fc',
            bgcolor: "#e3f2fd"
          }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 800,
            color: "#2563eb",
            letterSpacing: 0.4,
            fontSize: "1.22rem",
            flex: 1
          }}
        >
          {employe.fullName}
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
          <DetailRow label={t("Email")}>
            <Typography>{employe.email || <span style={{ color: "#aaa" }}>{t("Non défini")}</span>}</Typography>
          </DetailRow>
          <DetailRow label={t("Domaine")}>
            <Chip label={employe.domain} size="small" sx={{ bgcolor: "#e3f2fd", fontWeight: 700, color: "#227FBF" }} />
          </DetailRow>
          <DetailRow label={t("Rôle")}>
            <Chip label={employe.role} size="small" color="primary" sx={{ fontWeight: 700, fontSize: 15 }} />
          </DetailRow>
          <DetailRow label={t("Date d'ajout")}>
            <Typography>
              {employe.createdAt
                ? new Date(employe.createdAt).toLocaleDateString(t('fr-FR'))
                : <span style={{ color: "#aaa" }}>{t("N/A")}</span>}
            </Typography>
          </DetailRow>
          {/* Ajoute d’autres infos si besoin */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
