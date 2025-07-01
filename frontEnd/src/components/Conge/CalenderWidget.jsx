import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, Stack } from "@mui/material";
import { isWithinInterval, isSameDay, parseISO, isAfter } from "date-fns";
import { StyledCard } from "../../style/style";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TodayIcon from '@mui/icons-material/Today';

export default function CalendarWidget({ leaves = [] }) {
  // ---- Jours fériés (désactivé ici) ----
  // const [holidays, setHolidays] = useState([]);

  // Date système à minuit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ---- Seulement les congés approuvés à venir ----
  const leavePeriods = leaves
    .filter(l => {
      if (l.status !== "approved") return false;
      const start = parseISO(l.startDate);
      const end = parseISO(l.endDate);
      return isAfter(end, today) || isSameDay(end, today);
    })
    .map(l => ({
      start: parseISO(l.startDate),
      end: parseISO(l.endDate),
    }));

  // Couleurs et icônes
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    if (leavePeriods.some(({ start, end }) => isWithinInterval(date, { start, end }))) {
      return "calendar-leave";
    }
    if (isSameDay(date, today)) return "calendar-today";
    return "";
  };

  const tileContent = ({ date, view }) => {
    if (view === "month" && isSameDay(date, today)) {
      return <TodayIcon sx={{ fontSize: 19, color: "#00e676", mt: "2px" }} />;
    }
    if (view === "month" && leavePeriods.some(({ start, end }) => isWithinInterval(date, { start, end }))) {
      return <EventAvailableIcon sx={{ fontSize: 18, color: "#1976d2", mt: "2px" }} />;
    }
    return null;
  };

  return (
    <StyledCard
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "#f6f9ff",
        boxShadow: '0 6px 24px rgba(25,118,210,0.07)',
        mt: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={1}>
        Vue Calendrier (Congés à venir)
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        bgcolor: "#f6f9ff",
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
        <EventAvailableIcon sx={{ color: "#1976d2" }} />
        <Typography sx={{ fontSize: 14 }}>Congé approuvé à venir</Typography>
        <TodayIcon sx={{ color: "#00e676" }} />
        <Typography sx={{ fontSize: 14 }}>Aujourd’hui</Typography>
      </Stack>
      <style>
        {`
        .react-calendar {
          border-radius: 18px !important;
          background: #f6f9ff !important;
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
          border-radius: 12px !important;
          font-size: 1.06rem;
          font-weight: 500;
          color: #174479 !important;
          background: transparent !important;
        }
        .calendar-leave {
          background: #e3f2fd !important;
          border: 2px solid #1976d2 !important;
        }
        .calendar-today {
          border: 2.5px solid #00e676 !important;
          background: #fff !important;
        }
        .react-calendar__tile--active {
          background: #1976d2 !important;
          color: #fff !important;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
          font-weight: 600 !important;
          color: #1976d2 !important;
          font-size: 1.03rem;
        }
        /* Pour forcer 5 lignes/semaine : cache la 6e et au-delà */
        .react-calendar__month-view__weeks > div:nth-child(n+6) {
          display: none !important;
        }
        `}
      </style>
    </StyledCard>
  );
}
