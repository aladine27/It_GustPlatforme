import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Box, Stack, Link } from "@mui/material";
import { StyledCard } from "../../style/style";

const CongeWidget = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get("https://calendarific.com/api/v2/holidays", {
          params: {
            api_key: "8nQ30eh3QAsVPpXRHN0GgLS69cXKMYMI", 
            country: "TN", 
            year: new Date().getFullYear(),
          },
        });

        const upcoming = response.data.response.holidays
          .filter(h => new Date(h.date.iso) > new Date())
          .slice(0, 3); // Les 3 prochaines fêtes

        setHolidays(upcoming);
      } catch (err) {
        console.error("Erreur chargement des jours fériés :", err);
      }
    };

    fetchHolidays();
  }, []);

  return (
    <StyledCard sx={{ p: 2, borderRadius: 3, bgcolor:  "#e3f2fd"}}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Jours fériés à venir
      </Typography>
      <Stack spacing={1}>
        {holidays.map((h, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "#e3f2fd",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Typography fontWeight={600}>{h.name}</Typography>
            <Typography color="text.secondary">
              {new Date(h.date.iso).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                weekday: "short",
              })}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Box textAlign="right" mt={1}>
        <Link
          href="https://calendarific.com/"
          target="_blank"
          rel="noopener noreferrer"
          fontSize={14}
        >
          Voir tous
        </Link>
      </Box>
    </StyledCard>
  );
};

export default CongeWidget;
