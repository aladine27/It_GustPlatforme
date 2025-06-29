import React, { useState } from "react";
import {
  Box, Typography, Avatar, Stack, Card, Button
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { useTranslation } from "react-i18next";

// Accent color pour l'effet
const accentLavender = "#A78BFA";
const accentOrange = "#FFB547";

// Calcul des jours restants entre start et end
function getRemainingDays(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  s.setHours(0,0,0,0);
  e.setHours(0,0,0,0);
  const diff = Math.max(Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1, 0);
  return diff;
}

export default function PendingRequests({ pendingRequests, onDetail }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const paginated = pendingRequests.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ mt: 8 }}>
      <Card elevation={0} sx={{
        borderRadius: 5,
        p: 3,
        boxShadow: "0 6px 32px 0 rgba(25,118,210,0.10)",
        border: "2.5px solid #90caf9",
        mb: 4,
      }}>
        {/* Titre stylé, tout le reste du code reste inchangé */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
          py: 1.2,
          pl: 1,
          borderRadius: "28px",
          background: `linear-gradient(90deg, #e3f2fd 50%, ${accentOrange}18 100%)`,
          boxShadow: "0 4px 14px 0 #FFB54710",
        }}>
          <ScheduleIcon sx={{
            color: accentOrange,
            fontSize: 38,
            mb: 0.2,
            filter: "drop-shadow(0 2px 6px #FFB54755)"
          }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Quicksand', 'Poppins', Arial, sans-serif",
              color: "#1976d2",
              fontWeight: 900,
              letterSpacing: 0.5,
              fontSize: { xs: "2rem", md: "2.2rem" },
              background: `linear-gradient(90deg,#1976d2 70%,${accentOrange} 120%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 2px 6px ${accentLavender}44`,
              display: "inline-block",
              flex: 1,
            }}
          >
            {t("Demandes en attente")}
          </Typography>
          <Box
            sx={{
              bgcolor: accentOrange,
              color: "#fff",
              fontWeight: 800,
              fontSize: 22,
              borderRadius: "16px",
              px: 2.8,
              py: 0.5,
              minWidth: 48,
              minHeight: 36,
              textAlign: "center",
              boxShadow: "0 2px 12px 0 #FFB54733"
            }}
          >
            {pendingRequests.length}
          </Box>
        </Box>

        {paginated.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 6 }}
          >
            {t("Aucune demande en attente pour le moment.")}
          </Typography>
        ) : (
          paginated.map((request) => (
            <Card
              key={request._id}
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
                px: 2,
                py: 2,
                borderRadius: "38px",
                bgcolor: "#e3f2fd",
                border: "2.5px solid #90caf9",
                boxShadow: "0 2px 16px 0 rgba(25,118,210,0.08)",
                transition: "box-shadow .2s cubic-bezier(.4,0,.2,1)",
                "&:hover": { boxShadow: "0 4px 20px 0 rgba(25,118,210,0.14)" }
              }}
            >
              {/* Avatar et Infos Employé */}
              <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
                <Avatar
                  src={request.user?.image ? `http://localhost:3000/uploads/users/${request.user.image}` : undefined}
                  alt={request.user?.fullName || t("Employé")}
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
                  {request.user?.fullName?.[0]?.toUpperCase() || "?"}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#184169", mb: 0.5 }}>
                    {request.user?.fullName}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {request.leaveType?.name && (
                      <Typography
                        variant="body2"
                        sx={{
                          bgcolor: "#bbdefb",
                          color: "#1976d2",
                          fontWeight: 700,
                          px: 1.3,
                          borderRadius: 1.5,
                          mr: 0.7
                        }}
                      >
                        {request.leaveType.name}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 600 }}>
                      {t(request.title)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 0.5 }}>
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
              {/* Badge jours restants */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 90,
                  mr: 3
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#1976d2",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 26,
                    borderRadius: "22px",
                    px: 3.5,
                    py: 0.7,
                    mb: 0.5,
                    minWidth: 50,
                    minHeight: 32,
                    textAlign: "center",
                  }}
                >
                  {getRemainingDays(request.startDate, request.endDate)}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1976d2",
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {t("Jour(s)")}
                </Typography>
              </Box>
              {/* Bouton Détails */}
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  borderRadius: 10,
                  px: 2.7,
                  fontWeight: 700,
                  ml: 1,
                  "&:hover": {
                    borderColor: "#1976d2",
                    bgcolor: "rgba(25,118,210,0.05)",
                  }
                }}
                onClick={() => onDetail(request)}
              >
                {t("Détails")}
              </Button>
            </Card>
          ))
        )}

        <PaginationComponent
          count={Math.ceil(pendingRequests.length / pageSize)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Card>
    </Box>
  );
}
