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
  getStatusColor,
  getTypeColor,
  formatDate
}) {
  if (!offer) return null;
  const status = getStatusColor(offer.status);
  const type = getTypeColor(offer.type);

  // Dynamique split requirements/description si besoin
  const reqs = offer.requirements
    ? offer.requirements.split(/\n|,/).map((el) => el.trim()).filter(Boolean)
    : [];
   const bonuses = offer.bonuses
    ? String(offer.bonuses).split(/\n|,/).map((b) => b.trim()).filter(Boolean)
    : [];


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: { xs: 1.5, sm: 3 },
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
          pb: 1,
          borderRadius: "14px 14px 0 0"
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 800, color: "#2563eb", letterSpacing: 0.4, fontSize: "1.16rem" }}
        >
          {offer.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#227FBF', background: "#f3faff", '&:hover': { background: "#e3f2fd" } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mb: 2 }} />
      <DialogContent
        sx={{
          px: { xs: 0, sm: 1 },
          maxHeight: { xs: '80vh', sm: '85vh' },
          overflowY: 'auto',
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Description:</Typography>
            <Typography sx={{ mt: 0.4, whiteSpace: "pre-line" }}>{offer.description}</Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Requirements:</Typography>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {reqs.map((req, idx) => <li key={idx}><Typography>{req}</Typography></li>)}
            </ul>
          </Box>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Process:</Typography>
            <Typography sx={{ mt: 0.4, wordBreak: "break-word" }}>{offer.process}</Typography>
          </Box>
           <Box>
            <Typography color="text.secondary" fontWeight={700}>Bonus:</Typography>
            {bonuses.length ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} sx={{ mt: 0.8 }}>
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
              <Typography sx={{ mt: 0.4 }} color="text.secondary">—</Typography>
            )}
          </Box>

         <Box>
            <Typography color="text.secondary" fontWeight={700}>Autre détaille:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} sx={{ mt:.8 }}>
              <Chip icon={<WorkOutlineIcon />} label={offer.type}
                    sx={{ bgcolor:type.bg, color:type.color, fontWeight:700, fontSize:14.5, borderRadius:2 }} />
              <Chip icon={<MonetizationOnOutlinedIcon />} label={`$${offer.salaryRange}`}
                    sx={{ bgcolor:"#dbf9e9", color:"#14a35e", fontWeight:700, fontSize:14.5, borderRadius:2 }} />
              <Chip icon={<CalendarMonthOutlinedIcon />} label={`Posted: ${formatDate(offer.postedDate)}`}
                    sx={{ bgcolor:"#dde6fa", color:"#3969e6", fontWeight:700, fontSize:14.5, borderRadius:2 }} />
              <Chip icon={<CalendarMonthOutlinedIcon />} label={`Closing: ${formatDate(offer.closingDate)}`}
                    sx={{ bgcolor:"#fff2d6", color:"#d89b1d", fontWeight:700, fontSize:14.5, borderRadius:2 }} />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 3 }}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
