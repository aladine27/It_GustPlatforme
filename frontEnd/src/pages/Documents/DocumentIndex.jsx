import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { StyledPaper } from "../../style/style";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// On importe maintenant le vrai composant
import DocumentEmploye from "./DocumentEmploye";
import DocumentHistory from "./DocumentHistory";
import DocumentTraitementRH from "./DocumentTraitementRH";

// Placeholders temporaires pour RH/Admin
const DocumentTraitement = () => (
  <Box p={4} textAlign="center">
    <Typography variant="h6" color="warning.main">[Traitement des demandes - RH/Admin]</Typography>
    <Typography sx={{ mt: 1, color: "#888" }}>À remplacer par le vrai composant</Typography>
  </Box>
);

const DocumentHistorique = () => (
  <Box p={4} textAlign="center">
    <Typography variant="h6" color="success.main">[Historique global des documents - RH/Admin]</Typography>
    <Typography sx={{ mt: 1, color: "#888" }}>À remplacer par le vrai composant</Typography>
  </Box>
);

const DocumentIndex = () => {
  const { t } = useTranslation();
  const [view, setView] = useState("employe");
  const { CurrentUser } = useSelector((state) => state.user);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;

  const isRhOrAdmin =
    userRole &&
    (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "rh");

  // Forcer la vue employé si non RH/Admin
  useEffect(() => {
    if (!isRhOrAdmin && view !== "employe") {
      setView("employe");
    }
  }, [isRhOrAdmin, view]);

  return (
    <StyledPaper>
      {/* NAVBAR */}
      {isRhOrAdmin && (
        <Stack direction="row" alignItems="center" mb={2}>
          <Button
            sx={{
              mr: 2,
              textTransform: "none",
              fontWeight: 600,
              color: view === "employe" ? "primary.main" : "#666",
              bgcolor: view === "employe" ? "#f2f7fe" : "transparent",
              borderRadius: 5,
              px: 3.5,
              py: 1.3,
            }}
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setView("employe")}
          >
            {t("Demande de document employé")}
          </Button>
          <Button
            sx={{
              mr: 2,
              textTransform: "none",
              fontWeight: 600,
              color: view === "traitement" ? "primary.main" : "#666",
              bgcolor: view === "traitement" ? "#f2f7fe" : "transparent",
              borderRadius: 5,
              px: 3.5,
              py: 1.3,
            }}
            startIcon={<VisibilityIcon />}
            onClick={() => setView("traitement")}
          >
            {t("Traitement des demandes")}
          </Button>
          <Button
            sx={{
              mr: 2,
              textTransform: "none",
              fontWeight: 600,
              color: view === "historique" ? "primary.main" : "#666",
              bgcolor: view === "historique" ? "#f2f7fe" : "transparent",
              borderRadius: 5,
              px: 3.5,
              py: 1.3,
            }}
            startIcon={<HistoryIcon />}
            onClick={() => setView("historique")}
          >
            {t("Historique des documents")}
          </Button>
        </Stack>
      )}

      <Divider sx={{ mb: 2, mx: 2 }} />

      {/* Affichage du contenu */}
      {view === "traitement" && isRhOrAdmin ? (
        <DocumentTraitementRH />
      ) : view === "historique" && isRhOrAdmin ? (
        < DocumentHistory/>
      ) : view === "employe" ? (
        <DocumentEmploye />
      ) : (
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography color="error" fontWeight={700} fontSize={22}>
            {t("Accès réservé aux administrateurs ou RH.")}
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};

export default DocumentIndex;
