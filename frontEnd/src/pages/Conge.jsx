import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CardContent,
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
} from "@mui/icons-material";
import TypeCongeFormModal from "../components/Conge/TypeCongéFormModal";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import { StyledCard } from "../style/style";
// --- Nouvelle importation :
import PaginationComponent from "../components/Global/PaginationComponent";

// ============ DATA & HELPERS =============
const defaultTypesConge = [
  { _id: "vacation", name: "Vacation", color: "#4caf50", icon: <BeachIcon sx={{ mr: 0.5 }} /> },
  { _id: "sick", name: "Sick", color: "#f44336", icon: <SickIcon sx={{ mr: 0.5 }} /> },
  { _id: "maternity", name: "Maternity", color: "#e91e63", icon: <PregnantWomanIcon sx={{ mr: 0.5 }} /> },
  { _id: "other", name: "Other", color: "#ff9800", icon: <WorkIcon sx={{ mr: 0.5 }} /> },
];

const allOnLeave = [
  // VACATION
  { name: "Sarah", type: "Annual Leave", startDate: "2024-06-01", days: 5, category: "vacation" },
  { name: "Ahmed", type: "Regular Leave", startDate: "2024-06-03", days: 3, category: "vacation" },
  { name: "Nadia", type: "Paid Leave", startDate: "2024-06-06", days: 7, category: "vacation" },
  { name: "Omar", type: "Annual Leave", startDate: "2024-06-13", days: 10, category: "vacation" },
  { name: "Fatma", type: "Unpaid Leave", startDate: "2024-06-18", days: 4, category: "vacation" },
  { name: "Amin", type: "Annual Leave", startDate: "2024-06-24", days: 8, category: "vacation" },

  // SICK
  { name: "Youssef", type: "Sick Leave", startDate: "2024-06-02", days: 2, category: "sick" },
  { name: "Maya", type: "Medical Leave", startDate: "2024-06-04", days: 1, category: "sick" },
  { name: "Ali", type: "Sick Leave", startDate: "2024-06-07", days: 4, category: "sick" },
  { name: "Khalil", type: "Medical Leave", startDate: "2024-06-10", days: 3, category: "sick" },
  { name: "Layla", type: "Sick Leave", startDate: "2024-06-15", days: 5, category: "sick" },

  // MATERNITY
  { name: "Syrine", type: "Maternity Leave", startDate: "2024-05-15", days: 90, category: "maternity" },
  { name: "Imen", type: "Maternity Leave", startDate: "2024-04-20", days: 80, category: "maternity" },
  { name: "Nada", type: "Maternity Leave", startDate: "2024-05-05", days: 60, category: "maternity" },
  { name: "Rania", type: "Maternity Leave", startDate: "2024-06-01", days: 55, category: "maternity" },

  // OTHER
  { name: "Mohamed", type: "Personal Leave", startDate: "2024-06-08", days: 2, category: "other" },
  { name: "Karim", type: "Emergency Leave", startDate: "2024-06-12", days: 1, category: "other" },
  { name: "Asma", type: "RTT", startDate: "2024-06-14", days: 1, category: "other" },
  { name: "Yassine", type: "Family Leave", startDate: "2024-06-17", days: 3, category: "other" },
  { name: "Rim", type: "Special Leave", startDate: "2024-06-20", days: 2, category: "other" },
  { name: "Samir", type: "Training Leave", startDate: "2024-06-21", days: 2, category: "other" },
];


const pendingRequests = [
  { name: "Sarah", type: "Annual Leave", startDate: "2024-07-01", endDate: "2024-07-05", days: 5, status: "pending" },
  { name: "Ali", type: "Sick Leave", startDate: "2024-07-10", endDate: "2024-07-12", days: 3, status: "pending" },
  { name: "Layla", type: "Sick Leave", startDate: "2024-07-13", endDate: "2024-07-14", days: 2, status: "pending" },
  { name: "Imen", type: "Maternity Leave", startDate: "2024-07-15", endDate: "2024-10-15", days: 93, status: "pending" },
  { name: "Karim", type: "Emergency Leave", startDate: "2024-07-17", endDate: "2024-07-18", days: 2, status: "pending" },
  { name: "Samir", type: "Training Leave", startDate: "2024-07-19", endDate: "2024-07-21", days: 3, status: "pending" },
  { name: "Amin", type: "Annual Leave", startDate: "2024-07-22", endDate: "2024-07-27", days: 6, status: "pending" },
  { name: "Nadia", type: "Paid Leave", startDate: "2024-07-28", endDate: "2024-07-31", days: 4, status: "pending" },
];


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
  // --- STATES PAGINATION ---
  const [selectedType, setSelectedType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [pageWho, setPageWho] = useState(1);
  const [pagePending, setPagePending] = useState(1);

  // Nombre d'items par page (modifiable selon besoin)
  const pageSizeWho = 4;
  const pageSizePending = 3;

  const [typesConge, setTypesConge] = useState(defaultTypesConge);
  // ...
  const handleCreateType = (name) => { /* ... */ }
  const handleDeleteType = (id) => { /* ... */ }
  const handleEditType = (id, name) => { /* ... */ }

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

  // Filtrage selon type
  const filteredLeaves =
    selectedType === "all"
      ? allOnLeave
      : allOnLeave.filter((p) => p.category === selectedType);

  // PAGINATION LOGIQUE
  const paginatedLeaves = filteredLeaves.slice(
    (pageWho - 1) * pageSizeWho,
    pageWho * pageSizeWho
  );
  const paginatedPending = pendingRequests.slice(
    (pagePending - 1) * pageSizePending,
    pagePending * pageSizePending
  );

  // Reset page à 1 si le filtre change (utile pour ne pas être en page 2 sur un petit filtre)
  React.useEffect(() => {
    setPageWho(1);
  }, [selectedType]);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* ... bouton Ajouter ... */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          variant="outlined"
          sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}
          onClick={() => setModalOpen(true)}
        >
          Ajouter un nouveau type
        </Button>
      </Box>

      {/* WHO'S ON LEAVE section */}
      <StyledCard elevation={2}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Who's on leave?
        </Typography>
        {/* Filtre Type */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Box sx={{ minWidth: 240, maxWidth: 340 }}>
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
                  <Chip
                    label="All"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                    }}
                  />
                </Box>
              </MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Liste paginée */}
        <CardContent sx={{ p: 0 }}>
          {paginatedLeaves.map((person, index) => (
            <React.Fragment key={person.name + person.startDate}>
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  borderLeft: "7px solid #1976d2",
                  bgcolor: "#fff",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    width: 64,
                    height: 64,
                    fontWeight: 700,
                    fontSize: 30,
                    border: "2.5px solid #bbdefb",
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
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Since {person.startDate}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: 3, minWidth: 100, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#1976d2",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      fontSize: "2rem",
                    }}
                  >
                    {person.days}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontWeight: 600,
                      letterSpacing: 0.3,
                    }}
                  >
                    Days off
                  </Typography>
                </Box>
              </Box>
              {index < paginatedLeaves.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {paginatedLeaves.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", pt: 5 }}
            >
              No leave found for this type.
            </Typography>
          )}
        </CardContent>
        {/* PAGINATION */}
        <PaginationComponent
          count={Math.ceil(filteredLeaves.length / pageSizeWho)}
          page={pageWho}
          onChange={(_, value) => setPageWho(value)}
        />
      </StyledCard>

      {/* PENDING REQUESTS section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#1976d2", display: "flex", alignItems: "center", gap: 2 }}>
          <ScheduleIcon sx={{ color: "#ff9800" }} />
          Pending Requests
          <Badge badgeContent={pendingRequests.length} color="warning" sx={{ "& .MuiBadge-badge": { bgcolor: "#ff9800", color: "white", fontWeight: 700 } }} />
        </Typography>
        <StyledCard elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 0 }}>
            {paginatedPending.map((request, index) => (
              <React.Fragment key={index}>
                <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2", width: 56, height: 56, fontSize: 20, fontWeight: 700 }}>
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
                      <Button variant="contained" size="small" sx={{ bgcolor: "#4caf50", minWidth: 40, "&:hover": { bgcolor: "#45a049" }, fontWeight: 600, p: 0 }}>
                        <CheckIcon />
                      </Button>
                      <Button variant="contained" size="small" sx={{
                        bgcolor: "#f44336", minWidth: 40, width: 40, height: 40, p: 0, "&:hover": { bgcolor: "#c62828" },
                        borderRadius: "50%", boxShadow: "0 2px 6px 0 rgba(244,67,54,0.15)", display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <CloseIcon sx={{ fontSize: 24 }} />
                      </Button>
                      <Button variant="outlined" size="small" startIcon={<ViewIcon />} sx={{
                        borderColor: "#1976d2", color: "#1976d2", textTransform: "none", fontWeight: 600,
                        "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.04)" },
                      }}>
                        Details
                      </Button>
                    </Stack>
                  </Box>
                </Box>
                {index < paginatedPending.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </CardContent>
          {/* PAGINATION SOUS LA CARTE */}
          <PaginationComponent
            count={Math.ceil(pendingRequests.length / pageSizePending)}
            page={pagePending}
            onChange={(_, value) => setPagePending(value)}
          />
        </StyledCard>
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
