import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CardContent,
  Divider,
  Select,
  MenuItem,
  Chip,
  Stack,
  Badge,
  Card,
  CardActions,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllLeaves,
  updateLeave,
  fetchAllLeaveTypes,
  createLeaveType,
  deleteLeaveType,
  updateLeaveType
} from "../redux/actions/LeaveAction";
import { toast } from "react-toastify";
import PaginationComponent from "../components/Global/PaginationComponent";
import { StyledCard, StyledButton, Title } from "../style/style";
import TypeCongeFormModal from "../components/Conge/TypeCongéFormModal";
import CongeDetailModal from "../components/Conge/CongeDetailModal";
import { useTranslation } from "react-i18next";

const statusChip = (status) => {
  if (status === "approved")
    return (
      <Chip
        label="Approuvé"
        color="success"
        icon={<span>✔</span>}
        sx={{ fontWeight: 700, color: "#fff" }}
      />
    );
  if (status === "rejected")
    return (
      <Chip
        label="Rejeté"
        color="error"
        icon={<span>✘</span>}
        sx={{ fontWeight: 700, color: "#fff" }}
      />
    );
  return (
    <Chip
      label="Pending"
      sx={{ bgcolor: "#ff9800", color: "#fff", fontWeight: 700 }}
    />
  );
};

const Conge = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { leaves } = useSelector((state) => state.leave);
  const { leaveTypes } = useSelector((state) => state.leaveType);

  const [selectedType, setSelectedType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Pagination
  const [pageWho, setPageWho] = useState(1);
  const [pagePending, setPagePending] = useState(1);
  const pageSizeWho = 4;
  const pageSizePending = 3;

  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchAllLeaveTypes());
  }, [dispatch]);

  useEffect(() => {
    setPageWho(1);
  }, [selectedType]);

  // Listes dynamiques
  const today = new Date();

  // FILTRE pour les congés EN COURS
  const filteredLeaves =
    selectedType === "all"
      ? leaves.filter(
          (l) =>
            l.status === "approved" &&
            new Date(l.startDate) <= today &&
            new Date(l.endDate) >= today
        )
      : leaves.filter(
          (l) =>
            l.status === "approved" &&
            (l.leaveType?._id === selectedType || l.leaveType === selectedType) &&
            new Date(l.startDate) <= today &&
            new Date(l.endDate) >= today
        );

  // --- ICI la pagination qui manquait !
  const paginatedLeaves = filteredLeaves.slice(
    (pageWho - 1) * pageSizeWho,
    pageWho * pageSizeWho
  );

  // Filtre demandes en attente (inchangé)
  const pendingRequests = leaves.filter((l) => l.status === "pending");
  const paginatedPending = pendingRequests.slice(
    (pagePending - 1) * pageSizePending,
    pagePending * pageSizePending
  );

  // CRUD Type de congé
  const handleCreateType = async (typeName) => {
    try {
      await dispatch(createLeaveType({ name: typeName })).unwrap();
      toast.success("Type créé !");
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      toast.error(err?.toString() || "Erreur création type !");
    }
  };
  const handleDeleteType = async (typeId) => {
    try {
      await dispatch(deleteLeaveType(typeId)).unwrap();
      toast.success("Type supprimé !");
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      toast.error(err?.toString() || "Erreur suppression type !");
    }
  };
  const handleEditType = async (typeId, newName) => {
    try {
      await dispatch(updateLeaveType({ id: typeId, updateData: { name: newName } })).unwrap();
      toast.success("Type modifié !");
      dispatch(fetchAllLeaveTypes());
    } catch (err) {
      toast.error(err?.toString() || "Erreur modification type !");
    }
  };

  // Modal détail leave
  const handleOpenDetail = (leave) => {
    setSelectedLeave(leave);
    setDetailModalOpen(true);
  };
  const handleCloseDetail = () => {
    setSelectedLeave(null);
    setDetailModalOpen(false);
  };

  // Actions Accepter/Refuser
  const handleApprove = async (id) => {
    try {
      await dispatch(updateLeave({ id, updateData: { status: "approved" } })).unwrap();
      toast.success("Demande approuvée !");
      handleCloseDetail();
      dispatch(fetchAllLeaves());
    } catch (err) {
      toast.error("Erreur : " + err);
    }
  };
  const handleReject = async (id) => {
    try {
      await dispatch(updateLeave({ id, updateData: { status: "rejected" } })).unwrap();
      toast.success("Demande refusée !");
      handleCloseDetail();
      dispatch(fetchAllLeaves());
    } catch (err) {
      toast.error("Erreur : " + err);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pt: 0, pb: 3, px: { xs: 1, md: 3 } }}>
      {/* bouton Ajouter type */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <StyledButton
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
          onClick={() => setModalOpen(true)}
        >
          {t("Ajouter un nouveau type")}
        </StyledButton>
      </Box>

      {/* WHO'S ON LEAVE section */}
      <StyledCard elevation={2}>
        <Title>{t("Who's on leave?")}</Title>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Box sx={{ minWidth: 240, maxWidth: 340 }}>
            <Select
              fullWidth
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              variant="outlined"
              sx={{ bgcolor: "#fff", borderRadius: 3, fontWeight: 700 }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              <MenuItem value="all">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={t("Tous")}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                    }}
                  />
                </Box>
              </MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={t(type.name)}
                      size="small"
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        {/* Liste paginée */}
        <CardContent sx={{ p: 0 }}>
          {paginatedLeaves.map((person, index) => (
            <React.Fragment key={person._id}>
            <Card
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2.5,
        px: 2,
        py: 1.5,
        borderRadius: 3,
        bgcolor: "#f8fbff",
        boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.06)",
        borderLeft: "5px solid #1976d2",
        minHeight: 90,
        "&:hover": {
          boxShadow: "0 6px 24px 0 rgba(25, 118, 210, 0.09)",
        },
      }}
    >
      <Avatar
        src={person.user?.image ? `http://localhost:3000/uploads/users/${person.user.image}` : undefined}
        alt={person.user?.fullName || "Employé"}
        sx={{
          bgcolor: "#e3f2fd",
          color: "#1976d2",
          width: 60,
          height: 60,
          fontWeight: 700,
          fontSize: 26,
          border: "2.5px solid #bbdefb",
        }}
      >
        {person.user?.fullName?.[0]?.toUpperCase() || "?"}
      </Avatar>

      <CardContent sx={{ flex: 1, py: 1, px: 0 }}>
        <Stack spacing={0.6}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#164493", textTransform: "capitalize", fontSize: "1.17rem", lineHeight: 1.18 }}>
            {person.user?.fullName || "Employé"}
          </Typography>
          <Stack direction="row" spacing={1}>
            {person.user?.role && (
              <Chip
                label={person.user.role}
                size="small"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#1565c0",
                  fontWeight: 700,
                  textTransform: "capitalize"
                }}
              />
            )}
            {person.leaveType?.name && (
              <Chip
                label={person.leaveType.name}
                size="small"
                sx={{
                  bgcolor: "#bbdefb",
                  color: "#1565c0",
                  fontWeight: 600
                }}
              />
            )}
          </Stack>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontWeight: 500,
              mt: 0.3,
              fontSize: "1rem",
              textTransform: "capitalize",
            }}
          >
            {person.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mt: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 17, color: "#888" }} />
            <Typography variant="body2" sx={{ color: "#666" }}>
              Depuis {new Date(person.startDate).toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ flexDirection: "column", minWidth: 80, py: 0 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#1976d2",
            fontWeight: 800,
            fontSize: "1.8rem",
            lineHeight: 1.1,
            textAlign: "center",
            mb: -0.5,
          }}
        >
          {person.duration}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#333",
            fontWeight: 600,
            letterSpacing: 0.2,
            textAlign: "center",
          }}
        >
          Jours restants
        </Typography>
      </CardActions>
    </Card>
              {index < paginatedLeaves.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {paginatedLeaves.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", pt: 5 }}
            >
              {t("Aucun congé trouvé pour ce type.")}
            </Typography>
          )}
        </CardContent>
        <PaginationComponent
          count={Math.ceil(filteredLeaves.length / pageSizeWho)}
          page={pageWho}
          onChange={(_, value) => setPageWho(value)}
        />
      </StyledCard>

      {/* PENDING REQUESTS section */}
      <Box sx={{ mt: 8 }}>
        <StyledCard elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ScheduleIcon sx={{ color: "#ff9800" }} />
            {t("Demandes en attente")}
            <Badge
              badgeContent={pendingRequests.length}
              color="warning"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#ff9800",
                  color: "white",
                  fontWeight: 700,
                },
              }}
            />
          </Typography>
          <CardContent sx={{ p: 0 }}>
            {paginatedPending.map((request, index) => (
              <React.Fragment key={request._id}>
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      width: 56,
                      height: 56,
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                    src={request.user?.image ? `http://localhost:3000/uploads/users/${request.user.image}` : undefined}
                    alt={request.user?.fullName || "Employé"}
                  >
                    {request.user?.fullName?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {request.user?.fullName || "Employé"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", mb: 1 }}>
                      {request.title}{" "}
                      <Chip
                        size="small"
                        label={request.leaveType?.name || "-"}
                        sx={{ ml: 1, bgcolor: "#e3f2fd", color: "#1976d2" }}
                      />
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography variant="body2" color="text.secondary">
                          {request.startDate} - {request.endDate}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1976d2" }}
                      >
                        {request.duration} {t("Jour(s)")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {statusChip(request.status, t)}
                    <Stack direction="row" spacing={1}>
                      <StyledButton
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                        sx={{
                          borderColor: "#1976d2 !important",
                          color: "#1976d2",
                          textTransform: "none",
                          fontWeight: 600,
                          background: "#fff",
                          "&:hover": {
                            borderColor: "#1565c0",
                            bgcolor: "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                        onClick={() => handleOpenDetail(request)}
                      >
                        {t("Détails")}
                      </StyledButton>
                    </Stack>
                  </Box>
                </Box>
                {index < paginatedPending.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </CardContent>
          <PaginationComponent
            count={Math.ceil(pendingRequests.length / pageSizePending)}
            page={pagePending}
            onChange={(_, value) => setPagePending(value)}
          />
        </StyledCard>
      </Box>

      {/* Modal Type de congé */}
      <TypeCongeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        typesConge={leaveTypes}
        onCreate={(payload) => dispatch(createLeaveType(payload))}
        onDeleteType={handleDeleteType}
        onEditType={(id, payload) => dispatch(updateLeaveType({ id, updateData: payload }))}
      />

      {/* Modal détail demande */}
      <CongeDetailModal
        open={detailModalOpen}
        handleClose={handleCloseDetail}
        leave={selectedLeave}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Box>
  );
};

export default Conge;
