import React, { useEffect, useState } from "react";
import {
  Box, Divider, Button, Stack, Typography, Chip,
  Avatar
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchAllDocuments } from "../../redux/actions/documentAction";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";

export default function DocumentHistoriqueAll() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.document);

  // Tri du plus récent au plus ancien
  const docs = (documents || []).slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const paginatedRows = docs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(docs.length / itemsPerPage);

  // Statut logique : file => Traité, sinon En cours de traitement
  const getStatusChip = (row) => {
    const hasFile = !!row.file;
    const config = hasFile
      ? { color: "#219a6f", label: t("Traité") }
      : { color: "#f9a825", label: t("En cours de traitement") };
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

  // Colonnes : inclure l’employé (fullName ou email)
  const columns = [
    {
      id: "user",
      label: t("Employé"),
      align: "left",
      render: (row) => {
        const user = row.user || {};
        const img = user.image || "";
        const fullName = user.fullName || user.email || "—";
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
                width: 44,
                height: 44,
                fontWeight: 700,
                fontSize: 19,
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
            {t("Télécharger")}
          </a>
        ) : (
          "-"
        ),
    },
  ];

  // Charger tous les documents au premier montage
  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  return (
    <Box>
      

      <Box py={2} sx={{ width: "100%" }}>
        <Box sx={{ display: { xs: "block", md: "flex" }, gap: 3, width: "100%", alignItems: "flex-start" }}>
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              {t("Toutes les demandes de documents")}
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
    </Box>
  );
}
