import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
  Select,
  MenuItem,
  Chip,
  Stack,
  Badge,
  Button,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Sick as SickIcon,
  BeachAccess as BeachIcon,
  PregnantWoman as MaternityIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  PregnantWoman,
  PregnantWomanOutlined,
} from "@mui/icons-material";
import TypeCongeFormModal from "../components/Conge/TypeCongéFormModal";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";

// --- Modal Import


// ============ DATA & HELPERS =============
const defaultTypesConge = [
  { _id: "vacation", name: "Vacation", color: "#4caf50", icon: <BeachIcon sx={{ mr: 0.5 }} /> },
  { _id: "sick", name: "Sick", color: "#f44336", icon: <SickIcon sx={{ mr: 0.5 }} /> },
  { _id: "maternity", name: "Maternity", color: "#e91e63", icon: <PregnantWomanIcon sx={{ mr: 0.5 }} /> },

  { _id: "other", name: "Other", color: "#ff9800", icon: <WorkIcon sx={{ mr: 0.5 }} /> },
];

// ** MOCK DATA (Leave) **
const allOnLeave = [
  { name: "hakkouna", type: "Regular Leave", startDate: "2024-06-09", days: 2, category: "vacation" },
  { name: "sarah", type: "Annual Leave", startDate: "2024-06-10", days: 5, category: "vacation" },
  { name: "ahmed", type: "Vacation", startDate: "2024-06-08", days: 3, category: "vacation" },
  { name: "maria", type: "Sick Leave", startDate: "2024-06-11", days: 1, category: "sick" },
  { name: "john", type: "Medical Leave", startDate: "2024-06-09", days: 4, category: "sick" },
  { name: "fatima", type: "Maternity Leave", startDate: "2024-05-15", days: 90, category: "maternity" },
  { name: "youssef", type: "Personal Leave", startDate: "2024-06-12", days: 2, category: "other" },
  { name: "nadia", type: "Emergency Leave", startDate: "2024-06-11", days: 1, category: "other" },
];

const pendingRequests = [
  {
    name: "hakkouna",
    type: "Paternity Leave",
    startDate: "2024-06-17",
    endDate: "2024-06-19",
    days: 3,
    status: "pending",
  },
  {
    name: "emma",
    type: "Annual Leave",
    startDate: "2024-07-01",
    endDate: "2024-07-15",
    days: 15,
    status: "pending",
  },
  {
    name: "alex",
    type: "Sick Leave",
    startDate: "2024-06-20",
    endDate: "2024-06-22",
    days: 3,
    status: "pending",
  },
];

// Helper for status chip
const statusChip = (status) => (
  <Chip
    label={status}
    sx={{
      bgcolor: status === "pending" ? "#ff9800" : "#4caf50",
      color: "#fff",
      fontWeight: 600,
      borderRadius: 2,
      fontSize: "0.875rem",
      textTransform: "capitalize",
      px: 1,
    }}
    size="medium"
  />
);

// ================== ROOT COMPONENT =====================
const Conge = () => {
  // State pour filtrer le type sélectionné + gestion du modal
  const [selectedType, setSelectedType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // State CRUD types (remplace par appel API si tu veux)
  const [typesConge, setTypesConge] = useState(defaultTypesConge);

  // Handlers pour le modal
  const handleCreateType = (name) => {
    const exists = typesConge.some((t) => t.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (exists) throw new Error("Ce type existe déjà");
    // Génération d’un id unique basique :
    const newType = {
      _id: name.trim().toLowerCase().replace(/\s+/g, "_"),
      name: name.trim(),
      color: "#607d8b", // couleur par défaut (à adapter)
      icon: <WorkIcon sx={{ mr: 0.5 }} />,
    };
    setTypesConge((prev) => [...prev, newType]);
  };
  const handleDeleteType = (id) => setTypesConge((prev) => prev.filter((t) => t._id !== id));
  const handleEditType = (id, name) =>
    setTypesConge((prev) =>
      prev.map((t) => (t._id === id ? { ...t, name } : t))
    );

  // Remappe les typeMeta en temps réel
  const typeMeta = {};
  typesConge.forEach((t) => {
    typeMeta[t._id] = {
      label: t.name,
      color: t.color,
      icon: t.icon,
      bg: `linear-gradient(135deg, ${t.color} 0%, #f5f5f5 100%)`,
    };
  });

  const leaveTypes = typesConge.map((t) => t._id);

  // Légende des couleurs (colorLegend)
  const colorLegend = (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        {typesConge.map((meta) => (
          <Box key={meta._id} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Chip
              icon={meta.icon}
              label={meta.name}
              sx={{
                bgcolor: meta.color,
                color: "#fff",
                fontWeight: 700,
                borderRadius: 2,
                px: 1.5,
              }}
              size="small"
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );

  // Filtrage des personnes selon type
  const filteredLeaves =
    selectedType === "all"
      ? allOnLeave
      : allOnLeave.filter((p) => p.category === selectedType);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* Who's on leave section */}
      <Box sx={{ mb: 7 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <PersonIcon sx={{ color: "#667eea" }} />
          Who's on leave?
        </Typography>
        {colorLegend}

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Box sx={{ flex: 1, maxWidth: 340 }}>
            <Select
              fullWidth
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              variant="outlined"
              sx={{ bgcolor: "#fff", borderRadius: 3, fontWeight: 700 }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              <MenuItem value="all">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="All" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      icon={typeMeta[type]?.icon}
                      label={typeMeta[type]?.label}
                      size="small"
                      sx={{
                        bgcolor: typeMeta[type]?.color,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="outlined"
            sx={{ ml: 2, borderRadius: 3, fontWeight: 700, textTransform: "none" }}
            onClick={() => setModalOpen(true)}
          >
            View types
          </Button>
        </Box>
        <Box
  sx={{
    maxHeight: 370,
    overflowY: "auto",
    pr: 2,
    "&::-webkit-scrollbar": {
      width: 12,
      bgcolor: "#f1f1f1",
      borderRadius: 6,
    },
    "&::-webkit-scrollbar-thumb": {
      bgcolor: "#c1c1c1",
      borderRadius: 6,
      "&:hover": {
        bgcolor: "#a8a8a8",
      },
    },
    "&::-webkit-scrollbar-track": {
      bgcolor: "#f1f1f1",
      borderRadius: 6,
    },
  }}
>
  <Stack spacing={2}>
    {filteredLeaves.map((person) => {
      const meta = typeMeta[person.category] || typeMeta.other;
      return (
        <Paper
          key={person.name + person.startDate}
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            borderRadius: 4,
            mb: 0,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(60,60,60,0.06)",
            borderLeft: `7px solid ${meta.color}`,
            gap: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${meta.color}18`,
              color: meta.color,
              width: 64,
              height: 64,
              fontWeight: 700,
              fontSize: 30,
              border: `2.5px solid ${meta.color}33`,
              mr: 2,
            }}
          >
            {person.name[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.1,
                color: "#232323",
                textTransform: "capitalize",
                fontSize: "1.25rem",
              }}
            >
              {person.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#505050",
                fontWeight: 500,
                mb: 0.5,
                fontSize: "1.08rem",
              }}
            >
              {person.type}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 17, color: "#666" }} />
              <Typography
                variant="body2"
                sx={{ color: "#666" }}
              >
                Since {person.startDate}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              ml: 3,
              minWidth: 100,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: meta.color,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: "2rem",
              }}
            >
              {person.days}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#333", fontWeight: 600, letterSpacing: 0.3 }}
            >
              Days off
            </Typography>
          </Box>
        </Paper>
      );
    })}
    {filteredLeaves.length === 0 && (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", pt: 5 }}
      >
        No leave found for this type.
      </Typography>
    )}
  </Stack>
</Box>

      </Box>

      {/* Pending Requests section */}
      <Box sx={{ mt: 8 }}>
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
          Pending Requests
          <Badge
            badgeContent={pendingRequests.length}
            color="warning"
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#ff9800",
                color: "white",
                fontWeight: 700,
              },
            }}
          />
        </Typography>
        <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                maxHeight: 350,
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: 8,
                },
                "&::-webkit-scrollbar-track": {
                  bgcolor: "#f1f1f1",
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "#c1c1c1",
                  borderRadius: 4,
                  "&:hover": {
                    bgcolor: "#a8a8a8",
                  },
                },
              }}
            >
              {pendingRequests.map((request, index) => (
                <Box key={index}>
                  <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        width: 56,
                        height: 56,
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {request.name[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {request.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#666", mb: 1 }}>
                        {request.type}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body2" color="text.secondary">
                            {request.startDate} - {request.endDate}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1976d2" }}>
                          {request.days} days
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {statusChip(request.status)}
                      <Stack direction="row" spacing={1}>
                       
                      <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#4caf50",
                        minWidth: 40,
                        "&:hover": { bgcolor: "#45a049" },
                        fontWeight: 600,
                        p: 0,
                      }}
>
                              <CheckIcon />
                            </Button>
                            <Button
    variant="contained"
    size="small"
    sx={{
      bgcolor: "#f44336",
      minWidth: 40,
      width: 40,
      height: 40,
      p: 0,
      "&:hover": { bgcolor: "#c62828" },
      borderRadius: "50%",
      boxShadow: "0 2px 6px 0 rgba(244,67,54,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <CloseIcon sx={{ fontSize: 24 }} />
  </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          sx={{
                            borderColor: "#1976d2",
                            color: "#1976d2",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                              borderColor: "#1565c0",
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                          }}
                        >
                          Details
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                  {index < pendingRequests.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* MODAL POUR LA GESTION DES TYPES */}
      <TypeCongeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        typesConge={typesConge}
        onCreate={handleCreateType}
        onDeleteType={handleDeleteType}
        onEditType={handleEditType}
      />
    </Box>
  );
};

export default Conge;
