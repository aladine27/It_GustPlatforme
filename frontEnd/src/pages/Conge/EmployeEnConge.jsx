// components/Conge/CongeCard.jsx
import React from "react";
import {
  Card, Avatar, Typography, Stack, CardContent, CardActions, Chip
} from "@mui/material";
import CalendarIcon from "@mui/icons-material/CalendarToday";

export default function CongeCard({ person }) {
  return (
    <Card
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2.5,
        px: 2,
        py: 1.5,
        borderRadius: 3,
        bgcolor: "#e3f2fd ",
        boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.06)",
        borderLeft: "5px solid #1976d2",
        borderRight: "5px solid #1976d2",
        minHeight: 90,
        "&:hover": {
          boxShadow: "0 6px 24px 0 rgba(25, 118, 210, 0.09)",
        },
      }}
    >
      <Avatar
        src={person.user?.image ? `http://localhost:3000/uploads/users/${person.user.image}` : undefined}
        alt={person.user?.fullName || "Employé"}
        sx={{
          bgcolor: "#e3f2fd",
          color: "#1976d2",
          width: 60,
          height: 60,
          fontWeight: 700,
          fontSize: 26,
          border: "2.5px solid #bbdefb",
        }}
      >
        {person.user?.fullName?.[0]?.toUpperCase() || "?"}
      </Avatar>

      <CardContent sx={{ flex: 1, py: 1, px: 0 }}>
        <Stack spacing={0.6}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#164493", textTransform: "capitalize" }}>
            {person.user?.fullName || "Employé"}
          </Typography>
          <Stack direction="row" spacing={1}>
            {person.user?.role && (
              <Chip label={person.user.role} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 700 }} />
            )}
            {person.leaveType?.name && (
              <Chip label={person.leaveType.name} size="small" sx={{ bgcolor: "#bbdefb", color: "#1565c0", fontWeight: 600 }} />
            )}
          </Stack>
          <Typography variant="body2" sx={{ color: "#555", fontWeight: 500 }}>
            {person.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <CalendarIcon sx={{ fontSize: 17, color: "#888" }} />
            <Typography variant="body2" sx={{ color: "#666" }}>
              Depuis {new Date(person.startDate).toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ flexDirection: "column", minWidth: 80, py: 0 }}>
        <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1.1, textAlign: "center", mb: -0.5 }}>
          {person.duration}
        </Typography>
        <Typography variant="body2" sx={{ color: "#333", fontWeight: 600, letterSpacing: 0.2, textAlign: "center" }}>
          Jours restants
        </Typography>
      </CardActions>
    </Card>
  );
}
