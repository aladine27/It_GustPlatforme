// src/components/conge/CongeWidget.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Typography, Box, Stack, Link } from "@mui/material";
import { StyledCard } from "../../style/style";
import { useTranslation } from "react-i18next";

const COUNTRY = "TN";
const TTL_MS = 24 * 60 * 60 * 1000;

// EN -> FR (Tunisie)
const FR_TN = {
  "New Year's Day": "Nouvel An",
  "Revolution Day": "Fête de la Révolution",
  "Independence Day": "Fête de l’Indépendance",
  "Martyrs' Day": "Journée des Martyrs",
  "Labour Day": "Fête du Travail",
  "Republic Day": "Fête de la République",
  "Women's Day": "Fête de la Femme",
  "Evacuation Day": "Journée de l’Évacuation",
  "Eid al-Fitr": "Aïd al-Fitr",
  "Eid al-Fitr Holiday": "Lendemain de l’Aïd al-Fitr",
  "Eid al-Adha": "Aïd al-Adha",
  "Eid al-Adha Holiday": "Lendemain de l’Aïd al-Adha",
  "Islamic New Year": "Nouvel an hégirien",
  "Prophet's Birthday": "Mawlid",
};

const CongeWidget = () => {
  const [raw, setRaw] = useState([]);
  const [error, setError] = useState(null);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const year = new Date().getFullYear();
    const storageKey = `nager-holidays-${COUNTRY}-${year}`;

    const readCache = () => {
      try {
        const cached = localStorage.getItem(storageKey);
        if (!cached) return null;
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return { fetchedAt: 0, data: parsed };
        return parsed;
      } catch {
        return null;
      }
    };

    const cached = readCache();
    const isExpired = !cached || !cached.fetchedAt || Date.now() - cached.fetchedAt > TTL_MS;

    const fetchAll = async () => {
      try {
        const y = new Date().getFullYear();
        const urls = [
          `https://date.nager.at/api/v3/PublicHolidays/${y}/${COUNTRY}`,
          `https://date.nager.at/api/v3/PublicHolidays/${y + 1}/${COUNTRY}`,
        ];
        const [curr, next] = await Promise.all(
          urls.map(u => fetch(u).then(r => { if (!r.ok) throw new Error(); return r.json(); }))
        );
        const data = [...curr, ...next];
        setRaw(data);
        localStorage.setItem(storageKey, JSON.stringify({ fetchedAt: Date.now(), data }));
        setError(null);
      } catch {
        if (cached?.data) setRaw(cached.data);
        else { setRaw([]); setError(t("Impossible de charger les jours fériés.")); }
      }
    };

    if (cached && !isExpired) setRaw(cached.data || []);
    else fetchAll();
  }, [t]);

  const locale = i18n.language?.startsWith("en")
    ? "en-GB"
    : i18n.language?.startsWith("ar")
    ? "ar-TN"
    : "fr-FR";

  // libellé selon langue
  const getName = (h) => {
    if (i18n.language?.startsWith("en")) return h.name;
    if (i18n.language?.startsWith("fr")) return FR_TN[h.name] || h.name;
    // ar ou autres
    return h.localName || h.name;
  };

  const upcoming = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    return (raw || [])
      .filter(h => { const d = new Date(h.date); d.setHours(0,0,0,0); return d >= today; })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [raw]);

  return (
    <StyledCard sx={{ p: 2, borderRadius: 3, bgcolor: "#e3f2fd" }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {t("Jours fériés à venir")}
      </Typography>

      <Stack spacing={1}>
        {error ? (
          <Typography color="error" fontSize={15}>{error}</Typography>
        ) : upcoming.length === 0 ? (
          <Typography color="text.secondary" fontSize={15}>
            {t("Aucun jour férié à venir.")}
          </Typography>
        ) : (
          upcoming.map((h, idx) => (
            <Box key={`${h.date}-${idx}`} sx={{ display:"flex", justifyContent:"space-between",
              bgcolor:"#e3f2fd", borderRadius:2, px:2, py:1 }}>
              <Typography fontWeight={600}>{getName(h)}</Typography>
              <Typography color="text.secondary">
                {new Date(h.date).toLocaleDateString(locale, {
                  weekday: "short", day: "2-digit", month: "short",
                })}
              </Typography>
            </Box>
          ))
        )}
      </Stack>

      <Box textAlign="right" mt={1}>
        <Link href="https://date.nager.at/" target="_blank" rel="noopener noreferrer" fontSize={14}>
          {t("Voir tout")}
        </Link>
      </Box>
    </StyledCard>
  );
};

export default CongeWidget;
