import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  FormControl, InputLabel, Select, InputAdornment, Button, Chip, Avatar, Divider,
} from "@mui/material";
import {
  CheckCircle, Cancel, FilterList as FilterIcon, Search as SearchIcon,
  TrendingUp as TrendingUpIcon, Visibility as VisibilityIcon,
} from "@mui/icons-material";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLeaves, fetchAllLeaveTypes } from "../../redux/actions/LeaveAction";
import ModelComponent from "../../components/Global/ModelComponent";
import LeaveDetailModal from "../../components/Conge/HistoryAdminDetailModal";
import { useTranslation } from "react-i18next"; // <-- Import

const getStatusChip = (status, t) => {
  const statusConfig = {
    approved: { color: "#4caf50", label: t("Approuvé"), icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    rejected: { color: "#f44336", label: t("Rejeté"), icon: <Cancel sx={{ fontSize: 16 }} /> },
  };
  const config = statusConfig[status] || { color: "#666", label: status };
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      sx={{
        bgcolor: config.color,
        color: "#fff",
        fontWeight: 600,
        "& .MuiChip-icon": { color: "#fff" },
      }}
      size="small"
    />
  );
};

const CongeHistory = () => {
  const { t } = useTranslation(); // <-- hook i18n
  const dispatch = useDispatch();
  const { leaves } = useSelector((state) => state.leave);
  const { leaveTypes } = useSelector((state) => state.leaveType);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal detail
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchAllLeaveTypes());
  }, [dispatch]);

  // Reset page quand on filtre/recherche
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, typeFilter]);

  const filteredRaw = leaves.filter(l => l.status !== "pending");

  const stats = {
    total: filteredRaw.length,
    approved: filteredRaw.filter((l) => l.status === "approved").length,
    rejected: filteredRaw.filter((l) => l.status === "rejected").length,
  };

  // Table columns (use t() for headers)
  const columns = [
    {
      id: "employee",
      label: t("Employé"),
      align: "left",
      render: (row) => {
        const img = row.user?.image || "";
        const role = row.user?.role || "—";
        const fullName = row.user?.fullName || "—";
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                width: 44,
                height: 44,
                fontWeight: 700,
                fontSize: 19,
                border: '2px solid #1976d2',
              }}
              src={
                img
                  ? `http://localhost:3000/uploads/users/${encodeURIComponent(img)}?t=${Date.now()}`
                  : undefined
              }
            >
              {(!img && fullName !== "—")
                ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
                : ""}
            </Avatar>
            <Box>
              <Typography fontWeight={700} fontSize={15} sx={{ color: "#0d2852" }}>
                {fullName}
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                {role}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      id: "periode",
      label: t("Période"),
      align: "center",
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: 15 }}>
            {row.startDate ? new Date(row.startDate).toLocaleDateString("fr-FR") : "-"}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            {row.endDate ? new Date(row.endDate).toLocaleDateString("fr-FR") : "-"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: t("Statut"),
      align: "center",
      render: (row) => getStatusChip(row.status, t),
    },
  ];

  // Actions sur table
  const actions = [
    {
      tooltip: t("Voir détails"),
      icon: <VisibilityIcon fontSize="small" color="primary" />,
      onClick: (row) => {
        setSelectedLeave(row);
        setOpenDetail(true);
      },
    },
  ];

  // Filtrage dynamique
  const filteredLeaves = filteredRaw.filter((leave) => {
    const matchesSearch =
      (leave.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (leave.leaveType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    const matchesType =
      typeFilter === "all" ||
      (leave.leaveType?._id === typeFilter) ||
      (leave.leaveType === typeFilter);
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logique
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
  };

  // Stat card
  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "100px",
          height: "100px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          transform: "translate(30px, -30px)",
        },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ opacity: 0.8 }}>{React.cloneElement(icon, { sx: { fontSize: 48 } })}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t("Total des demandes")}
            value={stats.total}
            icon={<TrendingUpIcon />}
            color="#1976d2"
            bgColor="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t("Approuvées")}
            value={stats.approved}
            icon={<CheckCircle />}
            color="#388e3c"
            bgColor="#66bb6a"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t("Rejetées")}
            value={stats.rejected}
            icon={<Cancel />}
            color="#d32f2f"
            bgColor="#ef5350"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 3 }} elevation={2}>
        <CardContent sx={{ p: 3, pb: 0 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label={t("Rechercher par employé ou type")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Statut")}</InputLabel>
                <Select
                  value={statusFilter}
                  label={t("Statut")}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">{t("Tous les statuts")}</MenuItem>
                  <MenuItem value="approved">{t("Approuvé")}</MenuItem>
                  <MenuItem value="rejected">{t("Rejeté")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Type de congé")}</InputLabel>
                <Select
                  value={typeFilter}
                  label={t("Type de congé")}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">{t("Tous les types")}</MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                {t("Réinitialiser")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ px: 3, pb: 3 }}>
          <TableComponent
            columns={columns}
            rows={paginatedLeaves}
            actions={actions}
          />
          {/* Pagination */}
          <PaginationComponent
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
          {/* Modal */}
          <ModelComponent
            open={openDetail}
            handleClose={() => setOpenDetail(false)}
          >
            <LeaveDetailModal leave={selectedLeave} />
          </ModelComponent>
        </Box>
      </Card>
    </Box>
  );
};

export default CongeHistory;
