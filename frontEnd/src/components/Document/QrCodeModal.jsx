import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function QrCodeModal({ open, onInsert, onClose, docId }) {
  if (!open) return null;
  return (
    <Box sx={{
      position: "fixed", inset: 0, zIndex: 2500, bgcolor: "rgba(10,30,70,0.16)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Box sx={{
        bgcolor: "#fff", borderRadius: 4, boxShadow: 4, p: 4, display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <Typography fontWeight={700} mb={2}>QR code pour ce document</Typography>
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=https://yourcompany.com/doc/${docId}`} alt="QR" />
        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={onInsert}>Insérer dans le document</Button>
          <Button variant="outlined" onClick={onClose}>Fermer</Button>
        </Stack>
      </Box>
    </Box>
  );
}
