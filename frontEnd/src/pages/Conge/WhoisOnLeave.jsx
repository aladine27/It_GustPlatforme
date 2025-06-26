import React, { useState, useEffect } from "react";
import {
  Box, Typography, Select, MenuItem, Chip, CardContent, Divider, Grid
} from "@mui/material";
import { StyledCard, Title } from "../../style/style";
import PaginationComponent from "../../components/Global/PaginationComponent";
import CongeCard from "./EmployeEnConge";
import CongeWidget from "../../components/Conge/CongeWidget";

export default function WhoIsOnLeave({
  leaves,
  leaveTypes,
  selectedType,
  setSelectedType,
}) {
  const today = new Date();
  const filteredLeaves =
    selectedType === "all"
      ? leaves.filter(
          (l) =>
            l.status === "approved" &&
            new Date(l.startDate) <= today &&
            new Date(l.endDate) >= today
        )
      : leaves.filter(
          (l) =>
            l.status === "approved" &&
            (l.leaveType?._id === selectedType || l.leaveType === selectedType) &&
            new Date(l.startDate) <= today &&
            new Date(l.endDate) >= today
        );

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
            }}
          >
            <Title>{"Who's on leave?"}</Title>
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
                  }}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                >
                  <MenuItem value="all">
                    <Chip
                      label="Tous"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                      }}
                    />
                  </MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      <Chip
                        label={type.name}
                        size="small"
                        sx={{
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 700,
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <CardContent sx={{ p: 1}}>
              {paginatedLeaves.length > 0 ? (
                paginatedLeaves.map((person, i) => (
                  <React.Fragment key={person._id}>
                    <CongeCard person={person}  />
                    {i < paginatedLeaves.length - 1 }
                  </React.Fragment>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", pt: 5 }}
                >
                  Aucun congé trouvé pour ce type.
                </Typography>
              )}
            </CardContent>

            <PaginationComponent
              count={Math.ceil(filteredLeaves.length / pageSize)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </StyledCard>
      

       
    </Box>
  );
}
