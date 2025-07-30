import React, { useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { StyledPaper } from "../../style/style";
import JobOfferList from "./JobOfferList";
import ApplicationList from "./ApplicationList";

const RecrutementIndex = () => {
  const [view, setView] = useState("offers");

  return (
    <StyledPaper>
      {/* Onglets navigation */}
      <Stack direction="row" alignItems="center" mb={2}>
        <Button
          sx={{
            mr: 1,
            textTransform: "none",
            fontWeight: 600,
            color: view === "offers" ? "primary.main" : "#666",
            bgcolor: view === "offers" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<WorkOutlineIcon />}
          onClick={() => setView("offers")}
        >
          Offres d'emploi
        </Button>

        <Button
          sx={{
            mr: 1,
            textTransform: "none",
            fontWeight: 600,
            color: view === "applications" ? "primary.main" : "#666",
            bgcolor: view === "applications" ? "#f2f7fe" : "transparent",
          }}
          startIcon={<AssignmentIndIcon />}
          onClick={() => setView("applications")}
        >
          Candidatures
        </Button>

        <Divider sx={{ mb: 1, mx: 2 }} />
      </Stack>

      {/* Vues dynamiques */}
      {view === "offers" && <JobOfferList />}
      {view === "applications" && <ApplicationList />}
    </StyledPaper>
  );
};

export default RecrutementIndex;
