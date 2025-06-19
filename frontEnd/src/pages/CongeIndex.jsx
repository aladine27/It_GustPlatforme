import React, { useState } from "react";
import {
  Box,
  Paper,
  Divider,
  Button,
  Typography,
  Fade,
  Stack
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import Conge from "./Conge";
import CongeHistory from "./CongeHistory";

const NAV_ITEMS = [
  { label: "Aperçu", icon: <VisibilityIcon />, value: 0 },
  { label: "Historique", icon: <HistoryIcon />, value: 1 },
];

const CongeIndex = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f8fafc", py: 5 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          px: { xs: 1, md: 3 },
          pt: 1,
          pb: 0,
          mx: "auto",
          maxWidth: 1100,
          boxShadow: "0 4px 20px 0 rgba(60,72,102,0.08)",
          mb: 4,
          background: "white",
        }}
      >
        {/* Titre principal */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
        
          mb={3}
          sx={{ pt: 4 }}
        >
          Tableau de bord de congé
        </Typography>

        <Divider sx={{ mb: 2, mx: 2 }} />

        {/* NAVBAR */}
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {NAV_ITEMS.map(({ label, icon, value }) => (
            <Button
              key={label}
              onClick={() => setTab(value)}
              startIcon={icon}
              variant={tab === value ? "contained" : "outlined"}
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1.4,
                borderRadius: 99,
                fontSize: 17,
                background: tab === value ? "linear-gradient(90deg,#1976d2 0,#4f8dfd 100%)" : "#fff",
                color: tab === value ? "#fff" : "#1976d2",
                borderColor: "#1976d2",
                boxShadow: tab === value ? "0 4px 18px 0 rgba(25, 118, 210, 0.07)" : "none",
                transition: "all 0.2s",
                "&:hover": {
                  background: tab === value ? "linear-gradient(90deg,#1976d2 0,#1565c0 100%)" : "#f2f7fe",
                  color: "#1976d2"
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>

        <Divider sx={{ mb: 2, mx: 2 }} />

        {/* Affichage du contenu */}
        <Box sx={{ p: { xs: 1, md: 2 } }}>
          <Fade in={tab === 0} mountOnEnter unmountOnExit>
            <div hidden={tab !== 0}><Conge /></div>
          </Fade>
          <Fade in={tab === 1} mountOnEnter unmountOnExit>
            <div hidden={tab !== 1}><CongeHistory /></div>
          </Fade>
        </Box>
      </Paper>
    </Box>
  );
};

export default CongeIndex;
