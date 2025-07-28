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
const typeColors = {
  "maladie": "#EF9A9A",
  "Annuel": "#A5D6A7",
  "Exceptionnel": "#FFF59D",
  "maternité": "#CE93D8",
  
};
  return (
   
      <Card
        elevation={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width:"90%",
          gap: 2,
          mb: 2,
          px:1,
          py:1.5,
        borderRadius: "1rem",
          bgcolor: "rgba(227,242,253,0.95)",
          boxShadow: "0 6px 36px 0 rgba(25,118,210,0.09)",
         position: "relative",
       transition: "box-shadow .2s",
          "&:hover": {
            boxShadow: "0 12px 44px 0 rgba(25, 118, 210, 0.18)",
            bgcolor: "rgba(227,242,253,1)",
          },
        }}
      >
        {/* Bloc gauche : Avatar */}
        <Box sx={{display:"flex",direction:"row", alignItems:"center"}}>
          <Avatar
            src={person.user?.image ? `http://localhost:3000/uploads/users/${person.user.image}` : undefined}
            alt={person.user?.fullName || t("Employé")}
            sx={{
              width: 50,
              height: 50,
              fontWeight: 700,
              fontSize: 30,
              bgcolor: "#1976D2",
              color: "#fff",
              border: "4px solid #BBDEFB",
              boxShadow: "0 2px 12px 0 #1976d260",
            }}>
            {person.user?.fullName?.[0]?.toUpperCase() || "?"}
          </Avatar>
          <Box sx={{display:"flex",flexDirection:"column"}}>
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
  <Stack direction="row" alignItems="center" spacing={1}>
            {person.user?.role && (
              <Chip
                label={person.user.role}
                size="small"
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "#1976D2",
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: "1rem"
                }}
              />)}
          </Stack>
          </Box>
      </Box>
       {person.title && (
  <Chip
    label={person.title}
    size="small"
    sx={{
      bgcolor: typeColors[person.title] || "#BBDEFB",
      color: "#333",
      fontWeight: 600,
      fontSize: 12,
      borderRadius: "1rem"
    }}
  />
)}<Stack direction="row" alignItems="center" spacing={1}>
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
     
        {/* Bloc droit : Badge jours restants */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          
          }}
        >
          
          <Typography
            variant="body2"
            sx={{
              color: "#1976D2",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {i18n.language === "en" ? "Days left :" : "Jours restants :"}
          </Typography>
        
              <Typography
                variant="h3"
                sx={{
                  color: "#1976D2",
                   fontWeight: 700,
              fontSize: 15,
                }}
              >
                {daysLeft}
              </Typography>
   
        
        </Box>
      </Card>
    );
  
}
