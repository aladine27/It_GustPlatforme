import React, { useState, useEffect } from "react";
import {
  Box, Typography, Select, MenuItem, Chip, CardContent,
  Card
} from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';
import { StyledCard } from "../../style/style";
import PaginationComponent from "../../components/Global/PaginationComponent";
import CongeCard from "./EmployeEnConge";
import { useTranslation } from "react-i18next";
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
    <Box sx={{ width: "100%",border:"solid 2px red" }}>
      <Box sx={{ display:"flex",justifyContent:"space-between",alignItems:"center"}}>
             {/* --- Titre custom --- */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
          py: 1.2,
          pl: 1,
        }}>
          <GroupsIcon sx={{
            color: '#1976D2',
            fontSize: 38,
            mb: 0.2,
            filter: "drop-shadow(0 2px 6px #2ED47A44)"
          }} />
          <Typography
            variant="h4"
            sx={{
             color: '#1976D2',
              fontWeight: 500,
            fontSize: { xs: "2rem", md: "2.3rem" },}}
          >{t("Who's on leave?")}</Typography>
        </Box>
        {/* Filtre par type */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Box sx={{ minWidth: 240, maxWidth: 340 }}>
          <Select
            size="small"
              fullWidth
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              variant="outlined"
            sx={{bgcolor: "#fff",borderRadius: 3,
  fontWeight: 700,
  minHeight: 36, }}
              MenuProps={{ PaperProps: { sx:{maxHeight: 320 } } }}
            >
              <MenuItem value="all">
                <Chip
                  label={t("All")}
                  size="small"
                  sx={{fontWeight: 700,color: "#fff",
                  }}
                /></MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  <Chip
                    label={type.name}
                    size="small"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        </Box>
      <Card
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          width: "100%",
        }}
      >{/* Liste des employés en congé */}
        <CardContent >
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
      </Card>
    </Box>
  );
}
