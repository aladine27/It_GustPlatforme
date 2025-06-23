import React, { useState } from "react";
import {
  Box,
  Divider,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Conge from "./Conge";
import CongeHistory from "./CongeHistory";
import CongeEmploye from "./CongeEmploye";
import { StyledPaper } from "../style/style";
import { useSelector } from "react-redux";

const CongeIndex = () => {
  const [view, setView] = useState("WhoIsOnLeave");
  const { CurrentUser } = useSelector((state) => state.user);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;

  const isRhOrAdmin =
    userRole &&
    (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "rh");

  // Si user n’est pas RH/Admin, forcer la vue employé
  React.useEffect(() => {
    if (!isRhOrAdmin && view !== "employe") {
      setView("employe");
    }
  }, [isRhOrAdmin, view]);

  return (
    <StyledPaper>
      {/* NAVBAR */}
      <Stack direction="row" alignItems="center" mb={2}>
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

        {isRhOrAdmin && (
          <>
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
          </>
        )}
      </Stack>
      <Divider sx={{ mb: 2, mx: 2 }} />

      {/* Affichage du contenu */}
      {view === "WhoIsOnLeave" && isRhOrAdmin ? (
        <Conge />
      ) : view === "table" && isRhOrAdmin ? (
        <CongeHistory />
      ) : view === "employe" ? (
        <CongeEmploye />
      ) : (
        // Message d’accès refusé si jamais un employé “bricole” l’URL
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography color="error" fontWeight={700} fontSize={22}>
            Accès réservé aux administrateurs ou RH.
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};

export default CongeIndex;
