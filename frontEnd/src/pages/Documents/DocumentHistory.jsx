import React, { useEffect, useState } from "react";
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
import { fetchAllDocuments } from "../../redux/actions/documentAction";
import { useTranslation } from "react-i18next";

// Utilitaire : couleur & label statut
const getStatusChip = (status, t) => {
  const config = {
    approved: { color: "#4caf50", label: t("Validé"), icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    rejected: { color: "#f44336", label: t("Refusé"), icon: <Cancel sx={{ fontSize: 16 }} /> },
    pending: { color: "#ff9800", label: t("En attente"), icon: <Cancel sx={{ fontSize: 16 }} /> }
  }[status] || { color: "#666", label: status };
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

const DocumentHistory = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.document);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  // Reset page si filtre
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // Stats
  const filteredRaw = documents || [];
  const stats = {
    total: filteredRaw.length,
    approved: filteredRaw.filter((d) => d.status === "approved").length,
    rejected: filteredRaw.filter((d) => d.status === "rejected").length,
    pending: filteredRaw.filter((d) => d.status === "pending").length,
  };

  // Filtrage dynamique
  const filteredDocs = filteredRaw.filter((doc) => {
    const matchesSearch =
      (doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (doc.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (doc.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logique
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_event, value) => setCurrentPage(value);

  // Colonnes du tableau
  const columns = [
    {
      id: "title",
      label: t("Titre"),
      align: "left",
    },
    {
      id: "user",
      label: t("Employé"),
      align: "left",
      render: (row) => {
        const img = row.user?.image || "";
        const fullName = row.user?.fullName || row.user?.email || "—";
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                width: 42,
                height: 42,
                fontWeight: 700,
                fontSize: 17,
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
            </Box>
          </Box>
        );
      }
    },
    {
      id: "delevryDate",
      label: t("Date de délivrance"),
      align: "center",
      render: (row) =>
        row.delevryDate ? new Date(row.delevryDate).toLocaleDateString("fr-FR") : "-",
    },
    {
      id: "status",
      label: t("Statut"),
      align: "center",
      render: (row) => getStatusChip(row.status, t),
    },
    {
      id: "reason",
      label: t("Motif"),
      align: "left",
    },
    {
      id: "justificatif",
      label: t("Justificatif"),
      align: "center",
      render: (row) =>
        row.justificatif ? (
          <a
            href={`http://localhost:3000/uploads/documents/${row.justificatif}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            <VisibilityIcon fontSize="small" />
          </a>
        ) : "-",
    },
  ];

  // Card de stats
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
            title={t("Total des documents")}
            value={stats.total}
            icon={<TrendingUpIcon />}
            color="#1976d2"
            bgColor="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t("Validés")}
            value={stats.approved}
            icon={<CheckCircle />}
            color="#388e3c"
            bgColor="#66bb6a"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t("Rejetés")}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={t("Rechercher par titre ou employé")}
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t("Statut")}</InputLabel>
                <Select
                  value={statusFilter}
                  label={t("Statut")}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">{t("Tous les statuts")}</MenuItem>
                  <MenuItem value="approved">{t("Validé")}</MenuItem>
                  <MenuItem value="rejected">{t("Rejeté")}</MenuItem>
                  <MenuItem value="pending">{t("En attente")}</MenuItem>
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
          {loading ? (
            <Typography color="text.secondary" py={3}>{t("Chargement...")}</Typography>
          ) : error ? (
            <Typography color="error" py={3}>{error}</Typography>
          ) : (
            <>
              <TableComponent columns={columns} rows={paginatedDocs} />
              <PaginationComponent
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default DocumentHistory;
