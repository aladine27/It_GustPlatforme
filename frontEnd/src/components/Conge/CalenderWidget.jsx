import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, Stack } from "@mui/material";
import { isWithinInterval, isSameDay, parseISO, isAfter } from "date-fns";
import { StyledCard } from "../../style/style";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TodayIcon from '@mui/icons-material/Today';

export default function CalendarWidget({ leaves = [] }) {

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
    const isLeave = leavePeriods.some(({ start, end }) => isWithinInterval(date, { start, end }));
    const isToday = isSameDay(date, today);
    if (isToday) return "calendar-today"; // Priorité
    if (isLeave) return "calendar-leave";
    return "";
  };
  
  
  const tileContent = () => null;

  return (
    <StyledCard
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "#e3f2fd" ,
        boxShadow: '0 6px 24px rgba(25,118,210,0.07)',
        mt: 2,
       
      }}
    >
     
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        bgcolor: "#e3f2fd" ,
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
      </Stack>
      <style>
        {`
        .react-calendar {
          border-radius: 18px !important;
          background:"#e3f2fd"  !important;
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
       .calendar-today,
        .calendar-today:enabled:hover,
        .calendar-today:enabled:focus {
          background: #43ea84 !important;
          color: #fff !important;
          border-radius: 50% !important;
          font-weight: bold;
          box-shadow: 0 2px 8px 0 rgba(67, 234, 132, 0.15);
          border: none !important;
          outline: none !important;
        }


        `}
      </style>
    </StyledCard>
  );
}
