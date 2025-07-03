import React, { useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import SignaturePad from "react-signature-canvas";

export default function SignatureModal({ open, onValidate, onClose }) {
  const sigRef = useRef();

  if (!open) return null;

  return (
    <Box sx={{
      position: "fixed", inset: 0, zIndex: 2600, bgcolor: "rgba(10,10,30,0.22)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <Box sx={{
        bgcolor: "#fff", borderRadius: 3, boxShadow: 4, p: 4, minWidth: 340, minHeight: 240
      }}>
        <Typography fontWeight={700} mb={2}>Signez ici</Typography>
        <SignaturePad
          penColor="#1976d2"
          canvasProps={{ width: 320, height: 140, style: { borderRadius: 8, border: "1.5px solid #1976d2" } }}
          ref={sigRef}
        />
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={() => onValidate(sigRef.current.getTrimmedCanvas().toDataURL("image/png"))}>Valider</Button>
          <Button variant="outlined" onClick={onClose}>Annuler</Button>
        </Stack>
      </Box>
    </Box>
  );
}
