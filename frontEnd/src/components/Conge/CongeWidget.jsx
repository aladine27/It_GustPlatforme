import React, { useEffect, useState } from "react";
import { Typography, Box, Stack, Link } from "@mui/material";
import { StyledCard } from "../../style/style";
import { useTranslation } from "react-i18next";

const COUNTRY = "TN";

const CongeWidget = () => {
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState(null);
  const { i18n, t } = useTranslation(); // hook i18next

  useEffect(() => {
    const year = new Date().getFullYear();
    const storageKey = `nager-holidays-${COUNTRY}-${year}`;
    const local = localStorage.getItem(storageKey);

    if (local) {
      setHolidays(JSON.parse(local));
      return;
    }

    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${COUNTRY}`)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then(data => {
        const upcoming = data.filter(h => new Date(h.date) > new Date()).slice(0, 3);
        setHolidays(upcoming);
        localStorage.setItem(storageKey, JSON.stringify(upcoming));
        setError(null);
      })
      .catch(() => {
        setHolidays([]);
        setError(t("Impossible de charger les jours fériés."));
      });
  }, [t]);

  // Choix du champ à afficher selon la langue active
  const isEnglish = i18n.language.startsWith("en");

  return (
    <StyledCard sx={{ p: 2, borderRadius: 3, bgcolor: "#e3f2fd" }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t("Jours fériés à venir")}
      </Typography>
      <Stack spacing={1}>
        {error ? (
          <Typography color="error" fontSize={15}>{error}</Typography>
        ) : holidays.length === 0 ? (
          <Typography color="text.secondary" fontSize={15}>
            {t("Aucun jour férié à venir.")}
          </Typography>
        ) : (
          holidays.map((h, idx) => (
            <Box key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "#e3f2fd",
                borderRadius: 2,
                px: 2, py: 1,
              }}>
              <Typography fontWeight={600}>
                {isEnglish ? h.name : (h.localName || h.name)}
              </Typography>
              <Typography color="text.secondary">
                {new Date(h.date).toLocaleDateString(isEnglish ? "en-GB" : "fr-FR", {
                  day: "2-digit",
                  month: "short",
                  weekday: "short",
                })}
              </Typography>
            </Box>
          ))
        )}
      </Stack>
      <Box textAlign="right" mt={1}>
        <Link
          href="https://date.nager.at/"
          target="_blank"
          rel="noopener noreferrer"
          fontSize={14}
        >
          {t("Voir tous")}
        </Link>
      </Box>
    </StyledCard>
  );
};

export default CongeWidget;
