import React, { useEffect, useState } from "react";
import {
  Box, Divider, Button, Stack, Typography, Chip
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DemandeDocumentFormModal from "../../components/Document/DemandeDocumentFormModal";
import { createDocument, fetchDocumentsByUser } from "../../redux/actions/documentAction";
import { clearDocumentMessages } from "../../redux/slices/documentSlice";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { toast } from "react-toastify";

export default function DocumentEmploye() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;

  const { documents, loading, error, success } = useSelector((state) => state.document);

  const [view, setView] = useState("demande");
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const docs = (documents || []).slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const paginatedRows = docs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(docs.length / itemsPerPage);

  // Status display, respectant la logique file / statut backend
  const getStatusChip = (row) => {
    const hasFile = !!row.file;
    const config = hasFile
      ? { color: "#4caf50", label: t("Traité") }
      : { color: "#ff9800", label: t("En cours de traitement") };
    return (
      <Chip
        label={config.label}
        sx={{
          bgcolor: config.color,
          color: "#fff",
          fontWeight: 600,
        }}
        size="small"
      />
    );
  };

  // Colonnes du tableau, à jour
  const columns = [
    { id: "title", label: t("Type de document"), align: "left" },
    {
      id: "status",
      label: t("Statut"),
      align: "center",
      render: getStatusChip,
    },    
    {
      id: "delevryDate",
      label: t("Date de délivrance"),
      align: "center",
      render: (row) =>
        row.delevryDate
          ? new Date(row.delevryDate).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      id: "createdAt",
      label: t("Date de demande"),
      align: "center",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("fr-FR")
          : "-",
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
            Télécharger
          </a>
        ) : (
          "-"
        ),
    },
    
  ];

  // Ouvrir/fermer le modal
  const handleOpenModal = () => {
    dispatch(clearDocumentMessages());
    setIsSubmitting(false);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setIsSubmitting(false);
    dispatch(clearDocumentMessages());
  };

  // Soumission Redux
  const handleDemandeSubmit = (formData) => {
    setIsSubmitting(true);
    dispatch(createDocument(formData));
  };

  // Charger historique utilisateur à l'ouverture de l'onglet history
  useEffect(() => {
    if (view === "history" && userId) {
      dispatch(fetchDocumentsByUser(userId));
    }
  }, [view, userId, dispatch]);

  // Succès/erreur
  useEffect(() => {
    if (success && isSubmitting && openModal) {
      toast.success(success);
      setOpenModal(false);
      setIsSubmitting(false);
      dispatch(fetchDocumentsByUser(userId));
      setView("history");
      dispatch(clearDocumentMessages());
    }
    if (error && isSubmitting) {
      toast.error(error);
      setIsSubmitting(false);
      dispatch(clearDocumentMessages());
    }
  }, [success, error, isSubmitting, openModal, dispatch, userId]);

  useEffect(() => {
    if (view === "history") setCurrentPage(1);
  }, [view]);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: view === "demande" ? "primary.main" : "#666",
            bgcolor: view === "demande" ? "#f2f7fe" : "transparent",
          }}
          onClick={() => setView("demande")}
        >
          {t("Demande un Nouveau Document")}
        </Button>
        <Button
          startIcon={<HistoryIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: view === "history" ? "primary.main" : "#666",
            bgcolor: view === "history" ? "#f2f7fe" : "transparent",
          }}
          onClick={() => setView("history")}
        >
          {t("Suivi de mes demandes")}
        </Button>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {/* Vue DEMANDE */}
      {view === "demande" && (
        <Box textAlign="center" py={5}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            {t("Déposer une nouvelle demande de document")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenModal}
            sx={{ fontWeight: 700, borderRadius: 3, mb: 2 }}
          >
            {t("Nouvelle demande")}
          </Button>
          <DemandeDocumentFormModal
            open={openModal}
            handleClose={handleCloseModal}
            onSubmit={handleDemandeSubmit}
            userId={userId}
          />
        </Box>
      )}

      {/* HISTORIQUE */}
      {view === "history" && (
        <Box py={2} sx={{ width: "100%" }}>
          <Box sx={{ display: { xs: "block", md: "flex" }, gap: 3, width: "100%", alignItems: "flex-start" }}>
            <Box sx={{ flex: 2, minWidth: 0 }}>
              <Typography variant="h5" fontWeight={700} mb={2}>
                {t("Mes demandes de documents")}
              </Typography>
              {loading ? (
                <Box textAlign="center" py={3}>
                  <Typography color="text.secondary">{t("Chargement...")}</Typography>
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <TableComponent columns={columns} rows={paginatedRows} />
              )}
              {totalPages > 1 && (
                <PaginationComponent
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
