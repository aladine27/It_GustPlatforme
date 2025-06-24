import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Divider, Typography, Button, Stack, Grid, Card
} from "@mui/material";
import { toast } from "react-toastify";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import DemandeCongeFormModal from "../components/Conge/DemandeCongeFormModal";
import {
  fetchLeavesByUser,
  createLeave
} from "../redux/actions/LeaveAction";
import { clearLeaveMessages } from "../redux/slices/leaveSlice";
import TableComponent from "../components/Global/TableComponent";
import PaginationComponent from "../components/Global/PaginationComponent";
import CongeWidget from "../components/Conge/CongeWidget";

export default function CongeEmploye() {
  const dispatch = useDispatch();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;

  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState("demande");
  const [currentPage, setCurrentPage] = useState(1);

  const { leaves, loading, error, success } = useSelector((state) => state.leave);
  const itemsPerPage = 6;
  const paginatedRows = leaves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(leaves.length / itemsPerPage);

  const columns = [
    { id: "title", label: "Type", align: "left" },
    { id: "duration", label: "Durée", align: "center" },
    { id: "startDate", label: "Début", align: "center" },
    { id: "endDate", label: "Fin", align: "center" },
    { id: "status", label: "Statut", align: "center" },
    { id: "reason", label: "Motif", align: "left" },
    {
      id: "reasonFile",
      label: "Justificatif",
      align: "center",
      render: (row) =>
        row.reasonFile ? (
          <a
            href={`http://localhost:3000/uploads/leaves/${row.reasonFile}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir
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
    dispatch(clearLeaveMessages());
    setIsSubmitting(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsSubmitting(false);
  };

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
          Faire une demande
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
          Suivi de mes demandes
        </Button>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {/* DEMANDE DE CONGÉ */}
      {view === "demande" && (
        <Box textAlign="center" py={4}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Déposer une nouvelle demande de congé
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenModal}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Nouvelle demande
          </Button>
          <DemandeCongeFormModal
            open={openModal}
            handleClose={handleCloseModal}
            onSubmit={handleDemandeSubmit}
            userId={userId}
          />
        </Box>
      )}

      {/* HISTORIQUE AVEC CARDS */}
      {view === "history" && (
        <Box py={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {/* Leave Balance Placeholder */}
              <Card sx={{ p: 3, mb: 3, minHeight: 140, borderRadius: 3, bgcolor: "#fefefe" }}>
                <Typography variant="h6" fontWeight={700}>
                  Statistiques de congés (à venir)
                </Typography>
                {/* À remplir avec les stats (circular progress etc.) */}
              </Card>

              {/* TABLEAU */}
              <Typography variant="h5" fontWeight={700} mb={2}>
                Mes demandes de congé
              </Typography>
              {loading ? (
                <Box textAlign="center" py={3}>
                  <Typography color="text.secondary">Chargement...</Typography>
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
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Widget à droite */}
              <CongeWidget />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
