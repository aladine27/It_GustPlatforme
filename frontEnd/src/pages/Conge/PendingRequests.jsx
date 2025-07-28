import React, { useState } from "react";
import {
  Box, Typography, Avatar, Stack, Card, Button,
  Chip
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { useTranslation } from "react-i18next";
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
    <Box sx={{ mt: 1 }}>
       <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1,
          py: 1.2,
          pl: 1,
          borderRadius: "20px",
        }}>
          <ScheduleIcon sx={{
            color: "#1976d2",
            fontSize: 38,
            mb: 0.2,
          }} />
          <Typography
            variant="h4"
            sx={{
              color: "#1976d2",
              fontWeight: 500,
              fontSize: { xs: "2rem", md: "2.2rem" },
           display: "inline-block",
              flex: 1,
            }}
          >
            {t("Demandes en attente")}
          </Typography>
          <Box
            sx={{
              bgcolor: "#FFB547",
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
      <Card elevation={3} sx={{
        borderRadius:3,
        p: 3,
       mb: 2,
      }}>
        {/* Titre stylé, tout le reste du code reste inchangé */}
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
              elevation={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                px: 2,
                py: 2,
                borderRadius: "25px",
                bgcolor: "#e3f2fd",
                border: "2.5px solid #90caf9",
                boxShadow: "0 2px 16px 0 rgba(25,118,210,0.08)",
                transition: "box-shadow .2s cubic-bezier(.4,0,.2,1)",
                "&:hover": { boxShadow: "0 4px 20px 0 rgba(25,118,210,0.14)" }
              }}
            >
              {/* Avatar et Infos Employé */}
              <Stack direction="row" alignItems="center" justifyContent={"space-between"} spacing={2} sx={{ flex: 1 }}>
                <Box sx={{display:"flex",flexDirection:"row"}}>
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
                <Box sx={{display:"flex",flexDirection:"column"}}>
                 <Typography variant="h6" sx={{ fontWeight: 700, color: "#184169", mb: 0.5 }}>
                    {request.user?.fullName}
                  </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
            {request.user?.role && (
              <Chip
                label={request.user.role}
                size="small"
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "#1976D2",
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: "1rem"
                }}
              />
            )}
          </Stack>
          </Box>
                  </Box>
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
                      >{request.leaveType.name}
                      </Typography>
                    )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 0.5 }}>
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </Typography>
                    {/* Badge jours restants */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 60,
                  mr: 3
                }}>
            <Typography variant="body2" sx={{color: "#1976d2",fontWeight: 600,
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                 {t("Durée")} :{getRemainingDays(request.startDate, request.endDate)}
                </Typography>
              </Box>
                {/* Bouton Détails */}
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  borderRadius: 5,
                  px: 1.5,
                  fontWeight: 500,
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
              </Stack>
          
            
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