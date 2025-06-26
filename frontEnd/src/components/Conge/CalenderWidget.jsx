import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, Stack } from "@mui/material";
import { isWithinInterval, isSameDay, parseISO } from "date-fns";
import { StyledCard } from "../../style/style";
import axios from "axios";

export default function CalendarWidget({ leaves = [] }) {
  const [holidays, setHolidays] = useState([]);

  // Appel API pour récupérer les jours fériés
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get("https://calendarific.com/api/v2/holidays", {
          params: {
            api_key: "8nQ30eh3QAsVPpXRHN0GgLS69cXKMYMI",
            country: "TN", // Change le code pays si besoin
            year: new Date().getFullYear(),
          },
        });
        // Prends seulement les jours fériés nationaux (optionnel)
        const data = response.data.response.holidays.filter(
          h => h.type && h.type.includes("National holiday")
        );
        setHolidays(data.map(h => h.date.iso));
      } catch (err) {
        setHolidays([]);
        console.error("Erreur chargement jours fériés :", err);
      }
    };
    fetchHolidays();
  }, []);

  // Congés validés par user
  const leavePeriods = leaves
    .filter((l) => l.status === "approved")
    .map((l) => ({
      start: parseISO(l.startDate),
      end: parseISO(l.endDate),
    }));

  // Fonction couleur pour chaque case
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    // Férié dynamique
    if (holidays.some((d) => isSameDay(date, parseISO(d)))) {
      return "calendar-holiday";
    }
    // Congé validé
    if (leavePeriods.some(({ start, end }) => isWithinInterval(date, { start, end }))) {
      return "calendar-leave";
    }
    // Dimanche
    if (date.getDay() === 0) return "calendar-sunday";
    return "";
  };

  // Affichage point pour aujourd’hui
  const tileContent = ({ date, view }) => {
    if (view === "month" && isSameDay(date, new Date())) {
      return <div className="calendar-today-dot"></div>;
    }
    return null;
  };

  return (
    <StyledCard
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "#e3f2fd",
        boxShadow: '0 6px 24px rgba(25,118,210,0.07)',
        mt: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={1}>
        Vue Calendrier (Congés & jours fériés)
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        bgcolor: "#e3f2fd",
        borderRadius: 3
      }}>
        <Calendar
          locale="fr"
          tileClassName={tileClassName}
          tileContent={tileContent}
          prev2Label={null}
          next2Label={null}
        />
      </Box>
      <Stack direction="row" spacing={2} mt={2} alignItems="center" justifyContent="center">
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#43a047", border: '1.5px solid #388e3c' }} />
        <Typography sx={{ fontSize: 14 }}>Congé validé</Typography>
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#e53935", border: '1.5px solid #b71c1c' }} />
        <Typography sx={{ fontSize: 14 }}>Jour férié</Typography>
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#fff", border: '2px solid #1976d2', position: "relative" }}>
          <span style={{
            position: "absolute",
            left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            width: 8, height: 8, background: "#1976d2", borderRadius: "50%"
          }} />
        </Box>
        <Typography sx={{ fontSize: 14 }}>Aujourd’hui</Typography>
      </Stack>
      {/* Style CSS comme avant */}
      <style>
        {`
        .react-calendar {
          border-radius: 18px !important;
          background: #e3f2fd !important;
          font-family: Inter, Roboto, Arial, sans-serif;
          border: none !important;
          box-shadow: none !important;
        }
        .react-calendar__navigation button {
          color: #1976d2 !important;
          font-weight: 700 !important;
          background: none !important;
        }
        .react-calendar__tile {
          border-radius: 16px !important;
          font-size: 1.05rem;
          font-weight: 500;
          color: #174479 !important;
          background: transparent !important;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #b0bec5 !important; 
          background: transparent !important;
        }
        .calendar-sunday:not(.calendar-holiday):not(.calendar-leave) {
          color: #e53935 !important;
        }
        .calendar-holiday {
          background: #e53935 !important;
          color: #fff !important;
          border-radius: 50% !important;
          border: 2px solid #b71c1c !important;
        }
        .calendar-leave {
          background: #43a047 !important;
          color: #fff !important;
          border-radius: 50% !important;
          border: 2px solid #388e3c !important;
        }
        .react-calendar__tile--now {
          background: #fff !important;
          color: #1976d2 !important;
          border: 2px solid #1976d2 !important;
          position: relative;
        }
        .calendar-today-dot {
          width: 8px;
          height: 8px;
          background: #1976d2;
          border-radius: 50%;
          margin: 0 auto;
          position: absolute;
          left: 0; right: 0; bottom: 6px;
        }
        .react-calendar__tile--active {
          background: #1976d2 !important;
          color: #fff !important;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
          font-weight: 600 !important;
          color: #1976d2 !important;
          font-size: 1.04rem;
          letter-spacing: 0.01em;
        }
        `}
      </style>
    </StyledCard>
  );
}
