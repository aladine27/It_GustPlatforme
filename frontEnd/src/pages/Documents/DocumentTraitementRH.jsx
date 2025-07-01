import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  FormControl, InputLabel, Select, InputAdornment, Button, Chip, Avatar, Divider,
  Stack
} from "@mui/material";
import {
  CheckCircle, FilterList as FilterIcon, Search as SearchIcon,
  Visibility as VisibilityIcon, UploadFile as UploadFileIcon
} from "@mui/icons-material";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import ModelComponent from "../../components/Global/ModelComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDocuments, updateDocument } from "../../redux/actions/documentAction";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import DocumentCustomModal from "../../components/Document/DocumentCustomModal";


// Chip de statut dynamique selon file
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
  const { documents, loading, error } = useSelector((state) => state.document);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal détail
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Modal traitement
  const [openTraitement, setOpenTraitement] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [traitementDoc, setTraitementDoc] = useState(null);

  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // Filtrage dynamique
  const filtered = (documents || []).filter(doc => {
    // Statut dynamique: file null => pending, file != null => traité
    const statut =
      doc.file ? "traite" : "pending";
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
          ? statut === "pending"
          : statut === "traite";
    const matchesSearch =
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [openCustomModal, setOpenCustomModal] = useState(false);
const [currentDocId, setCurrentDocId] = useState(null);
const [currentDocUser, setCurrentDocUser] = useState(null);

  // Colonnes
  const columns = [
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
              src={
                img
                  ? `http://localhost:3000/uploads/users/${encodeURIComponent(img)}?t=${Date.now()}`
                  : undefined
              }
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                width: 38,
                height: 38,
                fontWeight: 700,
                fontSize: 16,
                border: '2px solid #1976d2',
              }}
            >
              {(!img && fullName !== "—")
                ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
                : ""}
            </Avatar>
            <Typography fontWeight={700} fontSize={15} sx={{ color: "#0d2852" }}>
              {fullName}
            </Typography>
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
      id: "file",
      label: t("Document généré"),
      align: "center",
      render: (row) =>
        row.file ? (
          <a
            href={`http://localhost:3000/uploads/documents/${row.file}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            <VisibilityIcon fontSize="small" />
          </a>
        ) : (
          "-"
        ),
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
              setCurrentDocId(row._id);
              setCurrentDocUser(row.user?.fullName);
              setOpenCustomModal(true);      // <-- c'est cette modal qu'on ouvre
            }}
          >{t("Générer document")}</Button>
        ),
    },
    
    {
      id: "detail",
      label: t("Détails"),
      align: "center",
      render: (row) => (
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => { setSelectedDocument(row); setOpenDetail(true); }}
        >
          {t("Voir")}
        </Button>
      ),
    }
  ];

  // Gestion PATCH (envoi fichier généré)
  const handleTraiterDocument = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      toast.error(t("Merci de joindre le fichier généré."));
      return;
    }
    const formData = new FormData();
    formData.append("file", fileToUpload);
    // Optionnel : delevryDate = now
    formData.append("delevryDate", new Date().toISOString());
    try {
       dispatch(updateDocument({
        id: traitementDoc._id,
        updateData: formData
      }));
      toast.success(t("Document traité avec succès !"));
      setOpenTraitement(false);
      setFileToUpload(null);
      setTraitementDoc(null);
      dispatch(fetchAllDocuments());
    } catch (err) {
      toast.error(t("Erreur lors du traitement du document !"));
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      <Card sx={{ borderRadius: 3, mb: 3 }} elevation={2}>
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
        <Box sx={{ px: 3, pb: 3 }}>
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

      {/* Modal traitement admin/RH : Upload document généré */}
      <ModelComponent
        open={openTraitement}
        handleClose={() => {
          setOpenTraitement(false);
          setFileToUpload(null);
        }}
        title={t("Traitement de la demande")}
        maxWidth="xs"
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          onSubmit={handleTraiterDocument}
        >
          <Typography fontWeight={600}>
            {t("Joindre le fichier généré pour")} <span style={{ color: "#1976d2" }}>{traitementDoc?.user?.fullName}</span>
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            fullWidth
            sx={{ mb: 1 }}
          >
            {t("Sélectionner le fichier généré")}
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
            />
          </Button>
          {fileToUpload && (
            <Typography fontSize={13} color="text.secondary">
              {t("Fichier sélectionné")}: {fileToUpload.name}
            </Typography>
          )}
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button type="submit" variant="contained" color="primary">
              {t("Traiter")}
            </Button>
          </Stack>
        </Box>
      </ModelComponent>
      <DocumentCustomModal
  open={openCustomModal}
  handleClose={() => setOpenCustomModal(false)}
  docId={currentDocId}
  userFullName={currentDocUser}
/>

    </Box>
    
  );
};

export default DocumentTraitementRH;
