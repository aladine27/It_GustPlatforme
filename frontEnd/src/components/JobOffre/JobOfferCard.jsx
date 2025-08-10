import React from "react";
import {
  Box, Typography, Chip, Divider, IconButton, Link, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import MuiTooltip, { tooltipClasses } from "@mui/material/Tooltip";

const WhiteTooltip = styled(({ className, ...props }) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} placement="top" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#1976d2",
    boxShadow: "0 6px 24px 0 rgba(24, 58, 119, 0.09)",
    fontWeight: 700,
    fontSize: 15,
    padding: "8px 16px",
    borderRadius: 13,
    border: "1px solid #e3e7fa",
    letterSpacing: 0.15,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
    filter: "drop-shadow(0px 2px 6px rgba(24,58,119,0.09))",
  },
}));

export default function JobOfferCard({
  offer,
  getStatusColor,
  getTypeColor,
  formatDate,
  setDetailOffer,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const status = getStatusColor(offer.status);
  const type = getTypeColor(offer.type);
  const salary =
    typeof offer.salaryRange === "number" && !isNaN(offer.salaryRange)
      ? offer.salaryRange
      : "-";

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: "20px",
        background: "linear-gradient(145deg, #ffffff, #e3f2fd)",
        Height: "300",
        maxWidth: 400,
        mx: "auto",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" },
        "@media (max-width: 600px)": { maxWidth: "90vw", minHeight: 380 },
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: "#f5faff", px: 3, pt: 2.5, pb: 2, borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#1a237e", mb: 0.5 }}>
          {offer.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
          <Typography
            sx={{ color: "#1976d2", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}
            component={Link}
            href={`https://www.google.com/maps/search/${encodeURIComponent(offer.location)}`}
            target="_blank"
            rel="noopener"
            underline="hover"
          >
            <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "#1976d2" }} />
            {offer.location}
          </Typography>
          <Chip
            icon={<WorkOutlineIcon sx={{ fontSize: 16, color: type.color }} />}
            label={offer.type}
            sx={{
              bgcolor: type.bg,
              color: type.color,
              fontWeight: 600,
              fontSize: 13,
              borderRadius: "12px",
              px: 1,
              height: 26,
              "&:hover": { bgcolor: type.bg, filter: "brightness(90%)" },
            }}
          />
        </Box>
        <Chip
          label={offer.status}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: status.bg,
            color: status.color,
            fontWeight: 600,
            fontSize: 12,
            borderRadius: "10px",
            px: 1.2,
            height: 24,
            "&:hover": { bgcolor: status.bg, filter: "brightness(90%)" },
          }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, pt: 2.5, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <ChecklistRtlOutlinedIcon sx={{ color: "#1a237e", fontSize: 20, mr: 1, mt: 0.5 }} />
          <Box sx={{ height: "50px", mb: "20px" }}>
            <Typography fontWeight={600} fontSize={15} color="#1a237e" sx={{ mb: 0.5 }}>
              Job Description:
            </Typography>
            <Typography
              variant="body2"
              color="#374151"
              sx={{
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1.5,
                maxHeight: 60,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                mb: 3,
              }}
            >
              {offer.description?.length > 80 ? offer.description.slice(0, 80) + "..." : offer.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, bgcolor: "#f8fafc", borderRadius: "12px", mb: 2, display: "flex", alignItems: "flex-start" }}>
          <ChecklistRtlOutlinedIcon sx={{ color: "#1a237e", fontSize: 20, mr: 1, mt: 0.5 }} />
          <Box sx={{ height: "50px", mb: "20px" }}>
            <Typography fontWeight={600} fontSize={15} color="#1a237e" sx={{ mb: 0.5 }}>
              Requirements:
            </Typography>
            <Typography
              fontSize={14}
              color="#374151"
              sx={{
                fontWeight: 400,
                lineHeight: 1.5,
                maxHeight: 60,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {offer.requirements}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#e5e7eb" }} />

      {/* Footer Chips + Applicants (click => page IA) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 3, pb: 1 }}>
        <Chip
          icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 16, color: "#2e7d32" }} />}
          label={`$${salary}`}
          sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600, fontSize: 13, borderRadius: "12px", px: 1, height: 26 }}
        />
        <Chip
          icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#d97706" }} />}
          label={`Closes ${formatDate(offer.closingDate)}`}
          sx={{ bgcolor: "#fff3e0", color: "#d97706", fontWeight: 600, fontSize: 13, borderRadius: "12px", px: 1, height: 26 }}
        />
      </Box>

      <Box
        sx={{ pl: 3, pb: 2, mt: 2, cursor: "pointer" }}
        onClick={() => navigate(`/dashboard/recrutement/applications/${offer._id}`, { state: { offer } })}
        title="Voir les candidatures de cette offre"
      >
        <Typography component="span" sx={{ fontWeight: 700, color: "#1e3a8a", fontSize: 18 }}>
          {Array.isArray(offer.applications) ? offer.applications.length : 0}
        </Typography>
        <Typography component="span" sx={{ color: "#1e3a8a", fontWeight: 500, ml: 0.5, fontSize: 16 }}>
          applicants
        </Typography>
      </Box>

      {/* Actions + Posted */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pb: 1.5, bgcolor: "#f5faff",
        borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }}>
        <Typography sx={{ color: "#6b7280", fontSize: 14, fontWeight: 500 }}>Posted {formatDate(offer.postedDate)}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <WhiteTooltip title="Voir les détails">
            <IconButton size="small" onClick={() => setDetailOffer(offer)} sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}>
              <InfoOutlinedIcon fontSize="small" sx={{ color: "#1976d2" }} />
            </IconButton>
          </WhiteTooltip>
          <WhiteTooltip title="Modifier l'offre">
            <IconButton size="small" onClick={() => onEdit(offer)} sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}>
              <EditOutlinedIcon fontSize="small" sx={{ color: "#1976d2" }} />
            </IconButton>
          </WhiteTooltip>
          <WhiteTooltip title="Supprimer l'offre">
            <IconButton size="small" onClick={() => onDelete(offer)} sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}>
              <DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: "#d32f2f" }} />
            </IconButton>
          </WhiteTooltip>
        </Box>
      </Box>
    </Paper>
  );
}
