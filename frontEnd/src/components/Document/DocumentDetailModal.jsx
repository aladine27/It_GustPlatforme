import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";

const DocumentDetailModal = ({ document }) => {
  if (!document) return null;

  return (
    <Box p={3}>
      <Typography variant="h6" mb={1}>
        Détail de la demande
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography><b>Employé :</b> {document.user?.fullName}</Typography>
      <Typography><b>Type :</b> {document.title}</Typography>
      <Typography><b>Motif :</b> {document.reason}</Typography>
      <Typography><b>Statut :</b> {document.status}</Typography>
      {/* Ajoute ici toutes les infos utiles */}
      {document.justificatif && (
        <a href={`http://localhost:3000/uploads/documents/${document.justificatif}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" sx={{ mt: 2 }}>Voir le justificatif</Button>
        </a>
      )}
      {/* Tu peux aussi ajouter les boutons d'action (délivrer, etc) ici */}
    </Box>
  );
};

export default DocumentDetailModal;
