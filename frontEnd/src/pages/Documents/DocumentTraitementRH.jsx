import React, { useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals et sélection
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openCustomModal, setOpenCustomModal] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [currentDocUser, setCurrentDocUser] = useState(null);

  // Debug: vérifier ce qu'on reçoit comme documents du store
  useEffect(() => {
    console.log("[DEBUG] Documents reçus depuis Redux:", documents);
  }, [documents]);

  // Récupération des documents
  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  // Reset page si filtre
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // Filtrage dynamique
  const filtered = (documents || []).filter(doc => {
    const user = doc.user || {};
    // Debug: on veut voir la forme de chaque document/user
    console.log("[DEBUG] Document dans filtre:", doc);
    const statut = doc.file ? "traite" : "pending";
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
          ? statut === "pending"
          : statut === "traite";
    const matchesSearch =
      (doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Colonne Employé (avec logs pour debug)
  const columns = [
    {
      id: "user",
      label: t("Employé"),
      align: "left",
      render: (row) => {
        const user = row.user || {};
        const img = user.image || "";
        const fullName = user.fullName || user.email || "—";
        // Calcul initiales
        const initials =
          (!img && fullName && fullName !== "—")
            ? fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "";
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={
                img
                  ? `http://localhost:3000/uploads/users/${encodeURIComponent(img)}?t=${user.image ? Date.now() : ""}`
                  : undefined
              }
              alt={fullName}
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                width: 44,
                height: 44,
                fontWeight: 700,
                fontSize: 19,
                border: '2px solid #1976d2',
              }}
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
        row.traitementDateLimite
          ? new Date(row.traitementDateLimite).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      id: "status",
      label: t("Statut"),
      align: "center",
      render: (row) => getStatusChip(row, t),
    },
    
    {
      id: "actions",
      label: t("Actions"),
      align: "center",
      render: (row) =>
        !row.file && (
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => {
              // Redirection vers la page de personnalisation !
              navigate(
                `/dashboard/document/personnaliser/${row._id}`,
                { state: { userFullName: row.user?.fullName } }
              );
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
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
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("pending");
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
        {/* Tableau et pagination avec overflow fix */}
        <Box sx={{ px: 3, pb: 3, overflowX: "auto" }}>
          <TableComponent columns={columns} rows={paginatedRows} />
          <PaginationComponent
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
          />
        </Box>
      </Card>

      {/* Modal Détail */}
      <ModelComponent open={openDetail} handleClose={() => setOpenDetail(false)}>
        <Typography variant="h6" mb={2}>{t("Détails du document")}</Typography>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, margin: 0 }}>
          {selectedDocument
            ? JSON.stringify(selectedDocument, null, 2)
            : t("Aucun document sélectionné")}
        </pre>
      </ModelComponent>

      
    </Box>
  );
};

export default DocumentTraitementRH;
