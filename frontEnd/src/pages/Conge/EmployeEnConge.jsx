import React from "react";
import {
  Card, Avatar, Typography, Stack, CardContent, Box, Chip, Tooltip
} from "@mui/material";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { useTranslation } from "react-i18next";

// Fonction pour calculer les jours restants (inclusif)
function getRemainingDays(endDate) {
  const today = new Date();
  const end = new Date(endDate);

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  // +1 pour inclure le dernier jour
  const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 0);
  return diffDays;
}

export default function CongeCard({ person }) {
  const { t, i18n } = useTranslation();
  const daysLeft = getRemainingDays(person.endDate);
  if (daysLeft < 1) return null;

  return (
    <Card
      elevation={4}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
        px: 3,
        py: 2.5,
        borderRadius: "2rem",
        bgcolor: "rgba(227,242,253,0.95)",
        boxShadow: "0 6px 36px 0 rgba(25,118,210,0.09)",
        border: "2px solid #90caf9",
        position: "relative",
        overflow: "visible",
        minHeight: 110,
        transition: "box-shadow .2s",
        "&:hover": {
          boxShadow: "0 12px 44px 0 rgba(25, 118, 210, 0.18)",
          bgcolor: "rgba(227,242,253,1)",
        },
      }}
    >
      {/* Bloc gauche : Avatar */}
      <Box sx={{ pr: { xs: 1, md: 3 }, pl: 1 }}>
        <Avatar
          src={person.user?.image ? `http://localhost:3000/uploads/users/${person.user.image}` : undefined}
          alt={person.user?.fullName || t("Employé")}
          sx={{
            width: 72,
            height: 72,
            fontWeight: 700,
            fontSize: 30,
            bgcolor: "#1976d2",
            color: "#fff",
            border: "4px solid #bbdefb",
            boxShadow: "0 2px 12px 0 #1976d260",
          }}
        >
          {person.user?.fullName?.[0]?.toUpperCase() || "?"}
        </Avatar>
      </Box>

      {/* Bloc central : Infos */}
      <CardContent sx={{
        flex: 1,
        py: 1,
        px: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
        justifyContent: "center"
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: "#185993",
              fontFamily: "Inter, Roboto, sans-serif",
              fontSize: "1.15rem",
              textTransform: "capitalize",
              letterSpacing: 0.1,
              mr: 1
            }}
            noWrap
          >
            {person.user?.fullName || t("Employé")}
          </Typography>
          {person.user?.role && (
            <Chip
              label={person.user.role}
              size="small"
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: "1rem"
              }}
            />
          )}
          
          
        </Stack>
        {person.title && (
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontWeight: 500,
              letterSpacing: 0.03
            }}
            noWrap
          >
            {person.title}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarIcon sx={{ fontSize: 17, color: "#888" }} />
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontWeight: 400,
              fontSize: 15,
              letterSpacing: 0.04
            }}
          >
            {i18n.language === "en" ? "Since" : "Depuis"} {new Date(person.startDate).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>

      {/* Bloc droit : Badge jours restants */}
      <Box
        sx={{
          minWidth: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1,
        }}
      >
        <Tooltip title={t("Jours restants")}>
          <Box
            sx={{
              bgcolor: "#1976d2",
              borderRadius: "1.5rem",
              px: 2.7,
              py: 1.2,
              boxShadow: "0 4px 20px 0 #1976d225",
              display: "flex",
              alignItems: "baseline",
              mb: 0.4
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 32,
                letterSpacing: 0.2,
                lineHeight: 1,
                minWidth: 36,
                textAlign: "center"
              }}
            >
              {daysLeft}
            </Typography>
          </Box>
        </Tooltip>
        <Typography
          variant="body2"
          sx={{
            color: "#1976d2",
            fontWeight: 700,
            fontSize: 15,
            mt: 0.1,
            letterSpacing: 0.1,
            textAlign: "center"
          }}
        >
          {i18n.language === "en" ? "Days left" : "Jours restants"}
        </Typography>
      </Box>
    </Card>
  );
}
