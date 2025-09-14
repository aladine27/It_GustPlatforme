import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  FormControl, InputLabel, Select, InputAdornment, Button, Chip, Avatar, Divider
} from "@mui/material";
import {
  CheckCircle, FilterList as FilterIcon, Search as SearchIcon,
  UploadFile as UploadFileIcon, Visibility as VisibilityIcon
} from "@mui/icons-material";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import ModelComponent from "../../components/Global/ModelComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDocuments, updateDocument } from "../../redux/actions/documentAction";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Status Chip pour la colonne Statut
const getStatusChip = (row, t) => {
  if (row.file) {
    return (
      <Chip
        icon={<CheckCircle sx={{ fontSize: 16 }} />}
        label={t("Traité")}
        sx={{ bgcolor: "#4caf50", color: "#fff", fontWeight: 600, "& .MuiChip-icon": { color: "#fff" } }}
        size="small"
      />
    );
  }
  return (
    <Chip
      icon={<UploadFileIcon sx={{ fontSize: 16 }} />}
      label={t("En cours de traitement")}
      sx={{ bgcolor: "#ff9800", color: "#fff", fontWeight: 600, "& .MuiChip-icon": { color: "#fff" } }}
      size="small"
    />
  );
};

const DocumentTraitementRH = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.document);
  const navigate = useNavigate();

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [deadlineOrder, setDeadlineOrder] = useState("desc"); // 'desc' ou 'asc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Modals et sélection
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openCustomModal, setOpenCustomModal] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [currentDocUser, setCurrentDocUser] = useState(null);

  useEffect(() => { console.log("[DEBUG] Documents reçus depuis Redux:", documents); }, [documents]);
  useEffect(() => { dispatch(fetchAllDocuments()); }, [dispatch]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, deadlineOrder]);

  // Filtrage dynamique
  const filtered = (documents || []).filter(doc => {
    const user = doc.user || {};
    const statut = doc.file ? "traite" : "pending";
    const matchesStatus =
      statusFilter === "all" ? true : statusFilter === "pending" ? statut === "pending" : statut === "traite";
    const matchesSearch =
      (doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesSearch && matchesStatus;
  });

  // Tri par date limite
  const sorted = useMemo(() => {
    const arr = Array.isArray(filtered) ? filtered : [];
    return [...arr].sort((a, b) => {
      const da = a?.traitementDateLimite ? new Date(a.traitementDateLimite).getTime() : null;
      const db = b?.traitementDateLimite ? new Date(b.traitementDateLimite).getTime() : null;
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return deadlineOrder === "desc" ? (db - da) : (da - db);
    });
  }, [filtered, deadlineOrder]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedRows = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Colonnes
  const columns = [
    {
      id: "user",
      label: t("Employé"),
      align: "left",
      render: (row) => {
        const user = row.user || {};
        const img = user.image || "";
        const fullName = user.fullName || user.email || "—";
        const initials =
          (!img && fullName && fullName !== "—")
            ? fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
            : "";
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={img ? `http://localhost:3000/uploads/users/${encodeURIComponent(img)}?t=${user.image ? Date.now() : ""}` : undefined}
              alt={fullName}
              sx={{ bgcolor: "#e3f2fd", color: "#1976d2", width: 44, height: 44, fontWeight: 700, fontSize: 19, border: '2px solid #1976d2' }}
            >
              {initials}
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
    { id: "title", label: t("Type de document"), align: "left" },
    { id: "reason", label: t("Motif"), align: "left" },
    {
      id: "traitementDateLimite",
      label: t("Date limite"),
      align: "center",
      render: (row) =>
        row.traitementDateLimite ? new Date(row.traitementDateLimite).toLocaleDateString("fr-FR") : "-",
    },
    { id: "status", label: t("Statut"), align: "center", render: (row) => getStatusChip(row, t) },
    {
      id: "actions",
      label: t("Actions"),
      align: "center",
      render: (row) =>
        !row.file && (
          <Button
            onClick={() => navigate(`/dashboard/document/personnaliser/${row._id}`, { state: { userFullName: row.user?.fullName } })}
            variant="contained"
            size="medium"
            startIcon={<UploadFileIcon />}
            disableElevation
            sx={{
              minWidth: 220, height: 48, px: 2.5, borderRadius: 3,
              textTransform: "none", fontWeight: 700, letterSpacing: .2, color: "#fff",
              bgcolor: "primary.main",
              backgroundImage: "linear-gradient(135deg,#1e88e5 0%,#1565c0 100%)",
              boxShadow: "0 8px 18px rgba(21,101,192,.35)",
              transition: "all .2s ease",
              "& .MuiButton-startIcon > *": { fontSize: 22 },
              "&:hover": {
                backgroundImage: "linear-gradient(135deg,#1976d2 0%,#0d47a1 100%)",
                boxShadow: "0 10px 22px rgba(13,71,161,.45)",
                transform: "translateY(-1px)"
              },
              "&:active": { transform: "translateY(0)" }
            }}
          >
            {t("Générer document")}
          </Button>
        ),
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* Filtres */}
      <Card sx={{ borderRadius: 3, mb: 3, maxWidth: "100%" }} elevation={2}>
        <CardContent sx={{ p: 3, pb: 0 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}  md="auto">
              <TextField
                
                variant="outlined"
                label={t("Recherche employé ou document")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
                  <MenuItem value="pending">{t("À traiter")}</MenuItem>
                  <MenuItem value="traite">{t("Traité")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Nouveau filtre d'ordre des dates limites */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t("Ordre date limite")}</InputLabel>
                <Select
                  value={deadlineOrder}
                  label={t("Ordre date limite")}
                  onChange={(e) => setDeadlineOrder(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="desc">{t("Décroissant")}</MenuItem>
                  <MenuItem value="asc">{t("Croissant ")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => { setSearchTerm(""); setStatusFilter("pending"); setDeadlineOrder("desc"); }}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, py: 1.5 }}
              >
                {t("Réinitialiser")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mb: 3 }} />

        {/* Tableau et pagination */}
        <Box sx={{ px: 3, pb: 3, overflowX: "auto" }}>
          <TableComponent columns={columns} rows={paginatedRows} />

          {/* >>> ESPACE ajouté entre tableau et pagination <<< */}
          <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center" }}>
            <PaginationComponent
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
            />
          </Box>
        </Box>
      </Card>

      {/* Modal Détail */}
      <ModelComponent open={openDetail} handleClose={() => setOpenDetail(false)}>
        <Typography variant="h6" mb={2}>{t("Détails du document")}</Typography>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, margin: 0 }}>
          {selectedDocument ? JSON.stringify(selectedDocument, null, 2) : t("Aucun document sélectionné")}
        </pre>
      </ModelComponent>
    </Box>
  );
};

export default DocumentTraitementRH;
