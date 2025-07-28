import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Divider, Typography, Button, Stack, Grid, Card,
  Chip
} from "@mui/material";
import { toast } from "react-toastify";
import {
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import DemandeCongeFormModal from "../../components/Conge/DemandeCongeFormModal";
import {
  fetchLeavesByUser,
  createLeave,
  fetchLeaveBalance
  
} from "../../redux/actions/LeaveAction";
import { clearLeaveMessages } from "../../redux/slices/leaveSlice";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import CongeWidget from "../../components/Conge/CongeWidget";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Cancel, CheckCircle } from "@mui/icons-material";
import CalendarWidget from "../../components/Conge/CalenderWidget";
import { useTranslation } from "react-i18next"; // ← N'oublie pas

export default function CongeEmploye() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState("demande");
  const [currentPage, setCurrentPage] = useState(1);
  const { leaveBalance, loading: leaveLoading } = useSelector((state) => state.leave);
  const { leaves, loading, error, success } = useSelector((state) => state.leave);
  const itemsPerPage = 6;
  const paginatedRows = leaves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(leaves.length / itemsPerPage);

  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { color: "#4caf50", label: t("Approuvé"), icon: <CheckCircle sx={{ fontSize: 16 }} /> },
      rejected: { color: "#f44336", label: t("Rejeté"), icon: <Cancel sx={{ fontSize: 16 }} /> },
      pending: { color: "#ff9800", label: t("En attente"), icon: <Cancel sx={{ fontSize: 16 }} /> }
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

  const columns = [
    { id: "title", label: t("Type"), align: "left" },
    { id: "duration", label: t("Durée"), align: "center" },
    {
      id: "startDate",
      label: t("Début"),
      align: "center",
      render: (row) =>
        row.startDate
          ? new Date(row.startDate).toLocaleDateString("fr-FR")
          : "-"
    },
    {
      id: "endDate",
      label: t("Fin"),
      align: "center",
      render: (row) =>
        row.endDate
          ? new Date(row.endDate).toLocaleDateString("fr-FR")
          : "-"
    },
    { id: "status", label: t("Statut"), align: "center", render: (row) => getStatusChip(row.status) },
    { id: "reason", label: t("Motif"), align: "left" },
    {
      id: "reasonFile",
      label: t("Justificatif"),
      align: "center",
      render: (row) =>
        row.reasonFile ? (
          <a
            href={`http://localhost:3000/uploads/leaves/${row.reasonFile}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisibilityIcon/>
          </a>
        ) : (
          "-"
        ),
    },
  ];

  useEffect(() => {
    if (view === "history" && userId) {
      dispatch(fetchLeavesByUser(userId));
    }
  }, [view, userId, dispatch]);

  useEffect(() => {
    setOpenModal(false);
    setIsSubmitting(false);
  }, [view]);

  useEffect(() => {
    if (success && isSubmitting && openModal) {
      toast.success(success);
      setOpenModal(false);
      setIsSubmitting(false);
      dispatch(fetchLeavesByUser(userId));
      setView("history");
      dispatch(clearLeaveMessages());
    }
    if (error && isSubmitting) {
      toast.error(error);
      setIsSubmitting(false);
      dispatch(clearLeaveMessages());
    }
  }, [success, error, isSubmitting, openModal, dispatch, userId]);

  const handleDemandeSubmit = (formData) => {
    setIsSubmitting(true);
    dispatch(createLeave(formData));
  };

  const handleOpenModal = () => {
    if (leaveLoading) {
      toast.info(t("Chargement du solde de congé..."));
      return;
    }
    if (leaveBalance && leaveBalance.soldeRestant <= 0) {
      toast.error(t("Vous n'avez plus de solde de congé disponible pour cette année."));
      return;
    }
    dispatch(clearLeaveMessages());
    setIsSubmitting(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (view === "demande" && userId) {
      dispatch(fetchLeaveBalance(userId));
    }
  }, [view, userId, dispatch]);

  // ==== Début ajout du cercle Recharts ====
  const COLORS = ["#9c6fe4", "#e5e6f3"]; // Violet, gris clair pour la zone restante
  const chartData = leaveBalance
    ? [
        { name: t("Solde restant"), value: leaveBalance.soldeRestant },
        { name: t("Pris"), value: leaveBalance.soldeInitial - leaveBalance.soldeRestant },
      ]
    : [];
  // ==== Fin ajout du cercle Recharts ====

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
          {t("Demande un Nouveau Congé")}
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
      <Divider sx={{ mb: 1 }} />

      {/* DEMANDE DE CONGÉ */}
      {view === "demande" && (
        <Box textAlign="center" py={4}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            {t("Déposer une nouvelle demande de congé")}
          </Typography>
          {/* Cercle de solde restant avec recharts */}
          {leaveBalance && (
            <Box sx={{ width: 160, mx: "auto", my: 3 }}>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={48}
                    outerRadius={65}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    <Cell key="solde" fill={COLORS[0]} />
                    <Cell key="pris" fill={COLORS[1]} />
                  </Pie>
                  {/* Label central personnalisé */}
                  <foreignObject x="35" y="50" width="80" height="50">
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 700, lineHeight: 1 }}>
                        {t("Disponible")}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: "#1976d2", lineHeight: 1 }}>
                        {String(leaveBalance.soldeRestant).padStart(2, "0")}
                        <span style={{ color: "#ccc", fontSize: 16 }}>/ {leaveBalance.soldeInitial}</span>
                      </Typography>
                    </Box>
                  </foreignObject>
                </PieChart>
              </ResponsiveContainer>
              <Typography align="center" sx={{ fontWeight: 600, color: "#484848", mt: 1 }}>
                {t("Congé Annuel")}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenModal}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            {t("Nouvelle demande")}
          </Button>

          <DemandeCongeFormModal
            open={openModal}
            handleClose={handleCloseModal}
            onSubmit={handleDemandeSubmit}
            userId={userId}
            leaveBalance={leaveBalance}
          />
        </Box>
      )}

      {/* HISTORIQUE AVEC CARDS */}
      {view === "history" && (
        <Box py={2} sx={{ width: "100%" }}>
  <Box sx={{ display: { xs: "block", md: "flex" }, gap: 3, width: "100%", alignItems: "flex-start" }}>
    {/* Colonne principale : Tableau */}
    <Box sx={{ flex: 3, minWidth: 0 }}>
      <Typography variant="h5" fontWeight={700} mb={2} color="#080D50">
        {t("Mes demandes de congé")}
      </Typography>
      {loading ? (
        <Box textAlign="center" py={3}>
          <Typography color="text.secondary">{t("Chargement...")}</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableComponent columns={columns} rows={paginatedRows}  />
      )}
      {totalPages > 1 && (
        <PaginationComponent
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
        />
      )}
    </Box>

    <Box
      sx={{
        flex: 1,
        minWidth: { xs: "100%", md: 290 },
        maxWidth: { xs: "100%", md: 390 },
        mt: { xs: 4, md: 0 },
      }}
    >
      <Stack spacing={2}>
        <CongeWidget />
        <CalendarWidget leaves={leaves} />
      </Stack>
    </Box>
  </Box>
</Box>

      )}
    </>
  );
}
