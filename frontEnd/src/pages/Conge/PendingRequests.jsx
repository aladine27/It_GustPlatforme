import React, { useState } from "react";
import {
  Box, Typography, Badge, Avatar, Chip, Stack, Divider
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ViewIcon from "@mui/icons-material/Visibility";
import { StyledButton, StyledCard } from "../../style/style";
import PaginationComponent from "../../components/Global/PaginationComponent";

export default function PendingRequests({ pendingRequests, onDetail }) {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const paginated = pendingRequests.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ mt: 8 }}>
      <StyledCard elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ScheduleIcon sx={{ color: "#ff9800" }} />
          Demandes en attente
          <Badge badgeContent={pendingRequests.length} color="warning" sx={{ "& .MuiBadge-badge": { bgcolor: "#ff9800", color: "white", fontWeight: 700 } }} />
        </Typography>

        {/* Afficher la structure même si vide */}
        {paginated.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 6 }}
          >
            Aucune demande en attente pour le moment.
          </Typography>
        ) : (
          paginated.map((request, i) => (
            <React.Fragment key={request._id}>
              <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar
                  src={request.user?.image ? `http://localhost:3000/uploads/users/${request.user.image}` : undefined}
                  alt={request.user?.fullName || "Employé"}
                  sx={{ bgcolor: "#e3f2fd", color: "#1976d2", width: 56, height: 56, fontSize: 20, fontWeight: 700 }}
                >
                  {request.user?.fullName?.[0]?.toUpperCase() || "?"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {request.user?.fullName}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666", mb: 1 }}>
                    {request.title}
                    <Chip size="small" label={request.leaveType?.name || "-"} sx={{ ml: 1, bgcolor: "#e3f2fd", color: "#1976d2" }} />
                  </Typography>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {request.startDate} - {request.endDate}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1976d2" }}>
                      {request.duration} Jour(s)
                    </Typography>
                  </Box>
                </Box>
                <StyledButton
                  variant="outlined"
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => onDetail(request)}
                  sx={{
                    borderColor: "#1976d2 !important",
                    color: "#1976d2",
                    fontWeight: 600,
                    background: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#1565c0",
                      bgcolor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  Détails
                </StyledButton>
              </Box>
              {i < paginated.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}

        {/* Pagination même si vide (inutile si aucun résultat, mais structure gardée) */}
        <PaginationComponent
          count={Math.ceil(pendingRequests.length / pageSize)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </StyledCard>
    </Box>
  );
}
