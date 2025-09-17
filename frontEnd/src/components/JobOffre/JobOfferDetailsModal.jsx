import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Stack, Chip, Box, Divider, IconButton
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

export default function JobOfferDetailsModal({
  open,
  onClose,
  offer,
  getTypeColor,
  formatDate
}) {
  if (!offer) return null;

  const type = getTypeColor(offer.type);

  // === Parsing dynamique ===
  const reqs = offer.requirements
    ? String(offer.requirements).split(/\n|,/).map((el) => el.trim()).filter(Boolean)
    : [];
  const bonuses = offer.bonuses
    ? String(offer.bonuses).split(/\n|,/).map((b) => b.trim()).filter(Boolean)
    : [];

  // Ligne exigences
  const reqsLine = reqs.length ? reqs.join(" - ") : "—";
  const postedFmt  = offer.postedDate  ? formatDate(offer.postedDate)  : "—";
  const closingFmt = offer.closingDate ? formatDate(offer.closingDate) : "—";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: { xs: 1.25, sm: 2.25 },
          borderRadius: 4,
          background: "#f9fbfd",
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: "linear-gradient(90deg, #e3f2fd 0%, #e0f1ff 100%)",
          pb: 0.5,                         // ⬅️ moins d’espace
          borderRadius: "14px 14px 0 0"
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 800, color: "#2563eb", letterSpacing: 0.4, fontSize: "1.12rem" }}
        >
          {offer.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#227FBF', background: "#f3faff", '&:hover': { background: "#e3f2fd" } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ my: 1 }} />        {/* ⬅️ réduit (moins de blanc) */}

      <DialogContent
        sx={{
          px: { xs: 0, sm: 0.5 },
          maxHeight: { xs: '80vh', sm: '82vh' },
          overflowY: 'auto',
          pr: 0.5,

          // === Scrollbar style (copié du Navbar) ===
          scrollbarWidth: 'thin', // Firefox
          scrollbarColor: (theme) => `${theme.palette.primary.main} transparent`,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => theme.palette.primary.main,
            borderRadius: 8,
          },
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => theme.palette.primary.dark,
          },
          '&::-webkit-scrollbar-corner': { background: 'transparent' },
        }}
      >
        <Stack spacing={1.2}>
          {/* Description */}
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Description :</Typography>
            <Typography sx={{ mt: 0.3, whiteSpace: "pre-line" }}>
              {offer.description}
            </Typography>
          </Box>

          {/* Exigences en une ligne */}
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Exigences :</Typography>
            <Typography
              sx={{
                mt: 0.3,
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere"
              }}
            >
              {reqsLine}
            </Typography>
          </Box>

          {/* Processus */}
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Processus :</Typography>
            <Typography sx={{ mt: 0.3, wordBreak: "break-word" }}>
              {offer.process || "—"}
            </Typography>
          </Box>

          {/* Avantages */}
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Avantages :</Typography>
            {bonuses.length ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} sx={{ mt: 0.6 }}>
                {bonuses.map((b, i) => (
                  <Chip
                    key={i}
                    icon={<EmojiEventsOutlinedIcon />}
                    label={b}
                    sx={{ bgcolor: "#e8f1ff", color: "#1976d2", fontWeight: 700, borderRadius: 2 }}
                    size="small"
                  />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ mt: 0.3 }} color="text.secondary">—</Typography>
            )}
          </Box>

          {/* Autres détails (sans la chip Closing) */}
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Autres détails :</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} sx={{ mt: .6 }}>
              <Chip
                icon={<WorkOutlineIcon />}
                label={offer.type}
                sx={{ bgcolor: type.bg, color: type.color, fontWeight: 700, fontSize: 14.5, borderRadius: 2 }}
              />
              <Chip
                icon={<MonetizationOnOutlinedIcon />}
                label={`${offer.salaryRange ?? ""}`} // garde la valeur telle quelle
                sx={{ bgcolor: "#dbf9e9", color: "#14a35e", fontWeight: 700, fontSize: 14.5, borderRadius: 2 }}
              />
              <Chip
                icon={<CalendarMonthOutlinedIcon />}
                label={`Publiée le ${postedFmt}`}
                sx={{ bgcolor: "#dde6fa", color: "#3969e6", fontWeight: 700, fontSize: 14.5, borderRadius: 2 }}
              />
              {/* ⛔ plus de Chip "Closing" ici */}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      {/* Ligne d’actions : date de clôture à gauche, bouton Fermer à droite */}
      <DialogActions
        sx={{
          px: 2.5,
          pb: 2,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1
        }}
      >
        {/* Style proche de la carte : pill jaune avec icône calendrier */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            bgcolor: "#fff2d6",
            color: "#d89b1d",
            fontWeight: 700,
            fontSize: 14.5,
            px: 1.2,
            py: 0.5,
            borderRadius: 2,
            border: "1px solid rgba(216,155,29,0.25)",
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
          {`Clôture le ${closingFmt}`}
        </Box>

        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 3 }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
