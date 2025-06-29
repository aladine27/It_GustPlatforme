import React, { useState, useEffect } from "react";
import {
  Box, Typography, Select, MenuItem, Chip, CardContent
} from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';
import { StyledCard } from "../../style/style";
import PaginationComponent from "../../components/Global/PaginationComponent";
import CongeCard from "./EmployeEnConge";
import { useTranslation } from "react-i18next";

// Accent colors
const accentGreen = "#2ED47A";
const accentOrange = "#FFB547";
const accentLavender = "#A78BFA";

export default function WhoIsOnLeave({
  leaves,
  leaveTypes,
  selectedType,
  setSelectedType,
}) {
  const { t } = useTranslation();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredLeaves =
    selectedType === "all"
      ? leaves.filter((l) => {
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return l.status === "approved" && start <= today && end >= today;
        })
      : leaves.filter((l) => {
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return (
            l.status === "approved" &&
            (l.leaveType?._id === selectedType || l.leaveType === selectedType) &&
            start <= today &&
            end >= today
          );
        });

  const [page, setPage] = useState(1);
  const pageSize = 4;
  const paginatedLeaves = filteredLeaves.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [selectedType]);

  return (
    <Box sx={{ width: "100%" }}>
      <StyledCard
        elevation={2}
        sx={{
          minHeight: 450,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          width: "100%",
          border: `2.5px solid ${accentLavender}`,
          background: "linear-gradient(120deg, #e3f2fd 60%, #f6fffc 100%)",
          boxShadow: "0 4px 24px 0 #B9F6CA25",
        }}
      >
        {/* --- Titre custom --- */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
          py: 1.2,
          pl: 1,
          borderRadius: "28px",
          background: `linear-gradient(90deg, #e3f2fd 55%, ${accentGreen}12 100%)`,
          boxShadow: "0 4px 14px 0 #2ED47A10",
        }}>
          <GroupsIcon sx={{
            color: accentGreen,
            fontSize: 38,
            mb: 0.2,
            filter: "drop-shadow(0 2px 6px #2ED47A44)"
          }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Quicksand', 'Poppins', Arial, sans-serif",
              color: "#1976d2",
              fontWeight: 900,
              letterSpacing: 0.5,
              fontSize: { xs: "2rem", md: "2.3rem" },
              background: `linear-gradient(90deg,#1976d2 70%,${accentGreen} 120%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 2px 6px ${accentLavender}55`,
              display: "inline-block",
            }}
          >
            {t("Who's on leave?")}
          </Typography>
        </Box>

        {/* Filtre par type */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Box sx={{ minWidth: 240, maxWidth: 340 }}>
            <Select
              fullWidth
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                fontWeight: 700,
                fontFamily: "'Quicksand', Arial, sans-serif",
                border: `2px solid ${accentGreen}`,
                "&:focus, &:hover": { borderColor: accentOrange }
              }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              <MenuItem value="all">
                <Chip
                  label={t("All")}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: accentGreen,
                    color: "#fff",
                  }}
                />
              </MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  <Chip
                    label={type.name}
                    size="small"
                    sx={{
                      bgcolor: accentLavender,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Liste des employés en congé */}
        <CardContent sx={{ p: 1 }}>
          {paginatedLeaves.length > 0 ? (
            paginatedLeaves.map((person, i) => (
              <React.Fragment key={person._id}>
                <CongeCard person={person} />
              </React.Fragment>
            ))
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", pt: 5 }}
            >
              {t("No leave found for this type.")}
            </Typography>
          )}
        </CardContent>

        {/* Pagination */}
        <PaginationComponent
          count={Math.ceil(filteredLeaves.length / pageSize)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </StyledCard>
    </Box>
  );
}
