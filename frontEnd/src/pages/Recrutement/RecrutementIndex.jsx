// RecrutementIndex.jsx
import React, { useState } from "react";
import { Button, Divider, Stack } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { StyledPaper } from "../../style/style";
import JobOfferList from "./JobOfferList";
import ApplicationList from "./ApplicationList";
import { useTranslation } from "react-i18next";

const RecrutementIndex = () => {
  const { t } = useTranslation();
  const [view, setView] = useState("offers");
  const [selectedOffer, setSelectedOffer] = useState(null);

  const openApplicationsView = (offer) => {
    setSelectedOffer(offer);
    setView("applications");
  };

  return (
    <StyledPaper>
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
          {t("Offres d'emploi")}
        </Button>

        <Button
          disabled={!selectedOffer} // Bloqué si aucune offre n'est sélectionnée
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
          {t("Candidatures")}
        </Button>

        <Divider sx={{ mb: 1, mx: 2 }} />
      </Stack>

      {view === "offers" && (
        <JobOfferList onOpenApplications={openApplicationsView} />
      )}

      {view === "applications" && (
        <ApplicationList selectedOffer={selectedOffer} />
      )}
    </StyledPaper>
  );
};

export default RecrutementIndex;
