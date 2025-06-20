import React, { useState } from "react";
import {
  Box,
  Paper,
  Divider,
  Button,
  Typography,
  Stack,
  Fade,
  Card,
  CardContent
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledPaper } from "../style/style";
// Tu créeras ce composant modal ou form


import DemandeCongeFormModal from "../components/Conge/DemandeCongeFormeModal";

const CongeEmploye = () => {
  // Onglet actuel (demander / historique)
  const [view, setView] = useState("demande");
  // Modal pour ouvrir le formulaire de demande de congé
  const [openDemandeModal, setOpenDemandeModal] = useState(false);
  const handleDemandeSubmit = (data) => {
    // Ici tu traites la demande (envoi API, affichage toast, etc.)
    console.log('Nouvelle demande reçue :', data);
    setOpenDemandeModal(false); // referme le modal après soumission
  };
  

  return (
    <StyledPaper>
      {/* Barre de navigation locale */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: view === "demande" ? "primary.main" : "#666",
            bgcolor: view === "demande" ? "#f2f7fe" : "transparent"
          }}
          onClick={() => setView("demande")}
        >
          Faire une demande
        </Button>
        <Button
          startIcon={<HistoryIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: view === "history" ? "primary.main" : "#666",
            bgcolor: view === "history" ? "#f2f7fe" : "transparent"
          }}
          onClick={() => setView("history")}
        >
          Suivi de mes demandes
        </Button>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {/* Section principale selon l’onglet */}
      <Box>
        {/* 1. Faire une demande (ouvre le formulaire) */}
        {view === "demande" && (
          <Fade in>
            <Box textAlign="center" py={4}>
              <Typography variant="h5" fontWeight={700} mb={3}>
                Déposer une nouvelle demande de congé
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setOpenDemandeModal(true)}
                sx={{ fontWeight: 700, borderRadius: 3 }}
              >
                Nouvelle demande
              </Button>
              {/* Ici, le formulaire s’ouvre en modal */}
              <DemandeCongeFormModal
                open={openDemandeModal}
                onClose={() => setOpenDemandeModal(false)}
              />
            </Box>
          </Fade>
        )}

      </Box>
      <DemandeCongeFormModal
  open={openDemandeModal}
  handleClose={() => setOpenDemandeModal(false)}
  onSubmit={handleDemandeSubmit} // fonction qui reçoit la demande créée
/>

    </StyledPaper>
    
  );
};

export default CongeEmploye;
