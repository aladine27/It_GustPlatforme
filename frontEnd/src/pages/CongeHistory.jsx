import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Button,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  FilterList as FilterIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import TableComponent from "../components/Global/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLeaves, fetchAllLeaveTypes } from "../redux/actions/LeaveAction";

const getStatusChip = (status) => {
  const statusConfig = {
    approved: { color: "#4caf50", label: "Approuvé", icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    rejected: { color: "#f44336", label: "Rejeté", icon: <Cancel sx={{ fontSize: 16 }} /> },
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
  const dispatch = useDispatch();
  const { leaves } = useSelector((state) => state.leave);
  const { leaveTypes } = useSelector((state) => state.leaveType);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchAllLeaveTypes());
  }, [dispatch]);

  // Statistiques
  const filteredRaw = leaves.filter(l => l.status !== "pending");

  const stats = {
    total: filteredRaw.length,
    approved: filteredRaw.filter((l) => l.status === "approved").length,
    rejected: filteredRaw.filter((l) => l.status === "rejected").length,
  };

  // Table columns
  const columns = [
    {
      id: "avatar",
      label: "Employé",
      align: "center",
      render: (row) => (
        <Avatar sx={{
          bgcolor: "#e3f2fd",
          color: "#1976d2",
          width: 44,
          height: 44,
          fontWeight: 700,
          fontSize: 19
        }}>
          {row.user?.fullName
            ? row.user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
            : "?"}
        </Avatar>
      ),
    },
    {
      id: "name",
      label: "Nom",
      align: "left",
      render: (row) => row.user?.fullName || "—",
    },
    {
      id: "type",
      label: "Type",
      align: "center",
      render: (row) => row.leaveType?.name || "—",
    },
    {
      id: "periode",
      label: "Période",
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
      id: "days",
      label: "Jours",
      align: "center",
      render: (row) => (
        <Chip
          label={row.duration}
          size="medium"
          sx={{
            bgcolor: "#e3f2fd",
            color: "#1976d2",
            fontWeight: 700,
            fontSize: 16,
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      ),
    },
    {
      id: "status",
      label: "Statut",
      align: "center",
      render: (row) => getStatusChip(row.status),
    },
  ];

  // Actions sur table
  const actions = [
    {
      tooltip: "Voir détails",
      icon: <VisibilityIcon fontSize="small" color="primary" />,
      onClick: (row) => alert(JSON.stringify(row, null, 2)),
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
      (leave.leaveType === typeFilter); // fallback in cas de leaveType en string
    return matchesSearch && matchesStatus && matchesType;
  });

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
            title="Total des demandes"
            value={stats.total}
            icon={<TrendingUpIcon />}
            color="#1976d2"
            bgColor="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Approuvées"
            value={stats.approved}
            icon={<CheckCircle />}
            color="#388e3c"
            bgColor="#66bb6a"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Rejetées" value={stats.rejected} icon={<Cancel />} color="#d32f2f" bgColor="#ef5350" />
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
                label="Rechercher par employé ou type"
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
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  label="Statut"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">Tous les statuts</MenuItem>
                  <MenuItem value="approved">Approuvé</MenuItem>
                  <MenuItem value="rejected">Rejeté</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type de congé</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type de congé"
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">Tous les types</MenuItem>
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
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        {/* Le divider entre filtres et tableau */}
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ px: 3, pb: 3 }}>
          <TableComponent
            columns={columns}
            rows={filteredLeaves}
            actions={actions}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default CongeHistory;
