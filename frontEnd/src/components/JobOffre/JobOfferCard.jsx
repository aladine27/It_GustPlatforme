import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Link,
  Paper,
  TextField,
  InputAdornment,
  useTheme
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";

// Tooltip custom
import { styled } from "@mui/material/styles";
import MuiTooltip, { tooltipClasses } from "@mui/material/Tooltip";

const WhiteTooltip = styled(({ className, ...props }) => (
  <MuiTooltip
    {...props}
    arrow
    classes={{ popper: className }}
    placement="top"
  />
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
  onSearchChange,     // Ajouté pour la search bar
  searchTerm,         // Ajouté pour la search bar
}) {
  const status = getStatusColor(offer.status);
  const type = getTypeColor(offer.type);
  const theme = useTheme();

  // Search bar en haut de la card (si besoin sur chaque card, sinon place dans la liste globale)
  // Ici en exemple en haut de la card, tu peux le placer global.
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: "20px",
        background: "linear-gradient(145deg, #ffffff, #e3f2fd)",
        minHeight: 420,
        maxWidth: 400,
        mx: "auto",
        mb: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #fff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        },
        "@media (max-width: 600px)": {
          maxWidth: "90vw",
          minHeight: 380,
        },
      }}
    >
      {/* Search bar exemple, sinon place-le globalement */}
      {/* <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          label="Rechercher"
          value={searchTerm}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Titre, Ville, ..."
          sx={{
            width: '100%',
            borderRadius: '50px',
            bgcolor: '#fff',
            boxShadow: theme.shadows[1],
            mb: 2
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton size="small" color="primary">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: '16px', fontSize: '1.03rem' }
          }}
        />
      </Box> */}
      
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#f5faff",
          px: 3,
          pt: 2.5,
          pb: 2,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "#1a237e", mb: 0.5 }}
        >
          {offer.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
          <Typography
            sx={{
              color: "#1976d2",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
            component={Link}
            href={`https://www.google.com/maps/search/${encodeURIComponent(
              offer.location
            )}`}
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
              "&:hover": {
                bgcolor: type.bg,
                filter: "brightness(90%)",
              },
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
            "&:hover": {
              bgcolor: status.bg,
              filter: "brightness(90%)",
            },
          }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, pt: 2.5, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <ChecklistRtlOutlinedIcon
            sx={{ color: "#1976d2", fontSize: 20, mr: 1, mt: 0.5 }}
          />
          <Box>
            <Typography
              fontWeight={600}
              fontSize={15}
              color="#1a237e"
              sx={{ mb: 0.5 }}
            >
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
              }}
            >
              {offer.description}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "#f8fafc",
            borderRadius: "12px",
            p: 2,
            mb: 1,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <ChecklistRtlOutlinedIcon
            sx={{ color: "#1976d2", fontSize: 20, mr: 1, mt: 0.5 }}
          />
          <Box>
            <Typography
              fontWeight={600}
              fontSize={15}
              color="#1a237e"
              sx={{ mb: 0.5 }}
            >
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

      {/* Footer Chips + Applicants */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 3, pb: 1 }}>
        <Chip
          icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 16, color: "#2e7d32" }} />}
          label={`$${offer.salaryRange.split("-")[1]?.trim() || offer.salaryRange}`}
          sx={{
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "12px",
            px: 1,
            height: 26,
            "&:hover": {
              bgcolor: "#e8f5e9",
              filter: "brightness(90%)",
            },
          }}
        />
        <Chip
          icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#d97706" }} />}
          label={`Closes ${formatDate(offer.closingDate)}`}
          sx={{
            bgcolor: "#fff3e0",
            color: "#d97706",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "12px",
            px: 1,
            height: 26,
            "&:hover": {
              bgcolor: "#fff3e0",
              filter: "brightness(90%)",
            },
          }}
        />
      </Box>
      <Box sx={{ pl: 3, pb: 2 }}>
        <Typography component="span" sx={{ fontWeight: 700, color: "#1e3a8a", fontSize: 18 }}>
          {offer.applications ?? 24}
        </Typography>
        <Typography component="span" sx={{ color: "#6b7280", fontWeight: 500, ml: 0.5, fontSize: 16 }}>
          applicants
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5, borderColor: "#e5e7eb" }} />

      {/* Actions + Posted */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pb: 1.5,
          bgcolor: "#f5faff",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <Typography sx={{ color: "#6b7280", fontSize: 14, fontWeight: 500 }}>
          Posted {formatDate(offer.postedDate)}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <WhiteTooltip title="Voir les détails">
            <IconButton
              size="small"
              onClick={() => setDetailOffer(offer)}
              aria-label="View job details"
              sx={{
                "&:hover": { bgcolor: "#e3f2fd" },
              }}
            >
              <InfoOutlinedIcon fontSize="small" sx={{ color: "#1976d2" }} />
            </IconButton>
          </WhiteTooltip>
          <WhiteTooltip title="Modifier l'offre">
            <IconButton
              size="small"
              aria-label="Edit job"
              sx={{
                "&:hover": { bgcolor: "#e3f2fd" },
              }}
            >
              <EditOutlinedIcon fontSize="small" sx={{ color: "#1976d2" }} />
            </IconButton>
          </WhiteTooltip>
          <WhiteTooltip title="Supprimer l'offre">
            <IconButton
              size="small"
              aria-label="Delete job"
              sx={{
                "&:hover": { bgcolor: "#e3f2fd" },
              }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: "#d32f2f" }} />
            </IconButton>
          </WhiteTooltip>
        </Box>
      </Box>
    </Paper>
  );
}
