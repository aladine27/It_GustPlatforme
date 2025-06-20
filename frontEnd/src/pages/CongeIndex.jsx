import React, { useState } from "react";
import {
  Box,
  Divider,
  Button,
  Stack
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Conge from "./Conge";
import CongeHistory from "./CongeHistory";
import CongeEmploye from "./CongeEmploye"; // <-- Ajoute cette ligne !
import { StyledPaper } from "../style/style";

const CongeIndex = () => {
  // 3 onglets maintenant : WhoIsOnLeave, table, employe
  const [view, setView] = useState("WhoIsOnLeave");

  return (
    <StyledPaper>
      {/* NAVBAR */}
      <Stack direction="row" alignItems="center" mb={2}>
        <Button
          sx={{
            mr: 2,
            textTransform: "none",
            fontWeight: 600,
            color: view === "WhoIsOnLeave" ? "primary.main" : "#666",
            bgcolor: view === "WhoIsOnLeave" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<VisibilityIcon />}
          onClick={() => setView("WhoIsOnLeave")}
        >
          Who's on leave?
        </Button>
        <Button
          sx={{
            mr: 2,
            textTransform: "none",
            fontWeight: 600,
            color: view === "table" ? "primary.main" : "#666",
            bgcolor: view === "table" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<HistoryIcon />}
          onClick={() => setView("table")}
        >
          History
        </Button>
        <Button
          sx={{
            mr: 2,
            textTransform: "none",
            fontWeight: 600,
            color: view === "employe" ? "primary.main" : "#666",
            bgcolor: view === "employe" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setView("employe")}
        >
          Mes demandes de congé
        </Button>
      </Stack>
      <Divider sx={{ mb: 2, mx: 2 }} />

      {/* Affichage du contenu selon l’onglet sélectionné */}
      {view === "WhoIsOnLeave" ? (
        <Conge />
      ) : view === "table" ? (
        <CongeHistory />
      ) : (
        <CongeEmploye />
      )}
    </StyledPaper>
  );
};

export default CongeIndex;
