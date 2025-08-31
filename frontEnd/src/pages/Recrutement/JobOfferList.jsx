// src/pages/Recrutement/JobOfferList.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Typography, TextField, MenuItem, InputAdornment, Grid, Divider, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import JobOfferCard from "../../components/JobOffre/JobOfferCard";
import JobOfferDetailsModal from "../../components/JobOffre/JobOfferDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllJobOffres,
  fetchJobOffreByCategory, 
  createJobOffre,
  updateJobOffre,
  fetchAllJobCategories,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
  deleteJobOffre,
} from "../../redux/actions/jobOffreAction.js";
import CategoryFormModal from "../../components/JobOffre/CategoryFormModal";
import CreateJobOfferModal from "../../components/JobOffre/CreateJobOffreModal";
import CustomDeleteForm from "../../components/Global/CustomDeleteForm";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { useTranslation } from "react-i18next";

// Helpers
function getStatusColor(status) {
  if (!status) return { bg: "#f3f4f6", color: "#607d8b" };
  if (status.toLowerCase() === "open") return { bg: "#e4faeb", color: "#22a77c" };
  if (status.toLowerCase() === "closed") return { bg: "#ffe4e4", color: "#e04747" };
  return { bg: "#f3f4f6", color: "#607d8b" };
}
function getTypeColor(type) {
  if (!type) return { bg: "#f3f4f6", color: "#6366f1" };
  if (type.toLowerCase() === "full-time") return { bg: "#e3edfb", color: "#2563eb" };
  if (type.toLowerCase() === "part-time") return { bg: "#ece4fb", color: "#894ce6" };
  if (type.toLowerCase() === "internship") return { bg: "#fff6e2", color: "#eab308" };
  return { bg: "#f3f4f6", color: "#6366f1" };
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB");
}
function computeOfferStatus(o) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  if (o.status && o.status.toLowerCase() === "closed") return "closed";

  // closingDate : fermé si le jour de clôture est passé
  if (o.closingDate) {
    const end = new Date(o.closingDate);
    end.setHours(23, 59, 59, 999); // fin de journée de clôture
    return today > end ? "closed" : "open";
  }
  return "open";
}

export default function JobOfferList({ onOpenApplications }) {
  const { t } = useTranslation();
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  const dispatch = useDispatch();
  const { list: offersBackend = [], loading, error } = useSelector((state) => state.jobOffre);
  const { list: jobCategories = [] } = useSelector((state) => state.jobCategory);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [detailOffer, setDetailOffer] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [deleteOffer, setDeleteOffer] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

   // tick pour recalculer automatiquement au changement de jour (toutes les 60s)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(id);
  }, []);
 

  useEffect(() => {
    dispatch(fetchAllJobOffres());
    dispatch(fetchAllJobCategories());
  }, [dispatch]);


  // Filtres dynamiques avec statut calculé
  const offers = useMemo(() => {
    // enrichir avec computedStatus à chaque rendu (tick déclenche le recalcul)
    let arr = offersBackend.map((o) => ({
      ...o,
      status: computeOfferStatus(o),
    }));

    if (statusFilter !== "all")
      arr = arr.filter((o) => o.computedStatus === statusFilter);

    if (typeFilter !== "all")
      arr = arr.filter((o) => (o.type && o.type.toLowerCase() === typeFilter));

    if (searchTerm)
      arr = arr.filter(
        (o) =>
          (o.title && o.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (o.location && o.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (o.type && o.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );

    if (sortBy === "salary")
      arr = [...arr].sort(
        (a, b) => (Number(b.salaryRange) || 0) - (Number(a.salaryRange) || 0)
      );
    else if (sortBy === "title")
      arr = [...arr].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sortBy === "date")
      arr = [...arr].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

    return arr;
    // tick dans les deps pour recalculer au fil du temps
  }, [offersBackend, searchTerm, statusFilter, typeFilter, sortBy, tick]);

  // Chargement par catégorie
  useEffect(() => {
    if (categoryFilter && categoryFilter !== "all") {
      dispatch(fetchJobOffreByCategory(categoryFilter));
    } else {
      dispatch(fetchAllJobOffres());
    }
  }, [categoryFilter, dispatch]);
  

  const paginatedOffers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return offers.slice(start, start + rowsPerPage);
  }, [offers, page]);

  // Gestion catégories
  const handleCreateCategory = async (name) => {
    await dispatch(createJobCategory({ name })).unwrap();
    dispatch(fetchAllJobCategories());
  };
  const handleEditCategory = async (catId, newName) => {
    await dispatch(updateJobCategory({ id: catId, updateData: { name: newName } })).unwrap();
    dispatch(fetchAllJobCategories());
  };
  const handleDeleteCategory = async (catId) => {
    await dispatch(deleteJobCategory(catId)).unwrap();
    dispatch(fetchAllJobCategories());
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", py: 1 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, md: 2 }, py: 3 }}>
        {/* Header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "start", md: "center" }} justifyContent="space-between" gap={2} mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
              {t("Job Offers")}
            </Typography>
            <Typography variant="body1" color="#64748b">
              {t("Manage and track all your job postings")}
            </Typography>
          </Box>
          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              startIcon={<CategoryIcon />}
              sx={{
                borderRadius: 5,
                px: 2,
                fontWeight: 700,
                color: "#0082c8",
                borderColor: "#0082c8",
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#f3f6f8" },
              }}
              onClick={() => setCategoryModalOpen(true)}
            >
              {t("Manage Categories")}
            </Button>
            <ButtonComponent
              text={t("Add New Offer")}
              icon={<AddCircleOutlineIcon />}
              onClick={() => {
                setCreateModalOpen(true);
                setEditOffer(null);
              }}
              color="#0082c8"
            />
          </Stack>
        </Stack>

        {/* Search + Filters */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ width: "100%", position: "relative" }}>
              <TextField
                fullWidth
                label={t("Rechercher")}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t("Titre, Lieu, Type...")}
                variant="outlined"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "20px",
                  boxShadow: theme => theme.shadows[1],
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    fontSize: "1.08rem",
                    height: 49,
                    pl: 0,
                  },
                  "& .MuiInputLabel-root": {
                    fontWeight: 700,
                    color: "#2563eb",
                    fontSize: "1.08rem"
                  },
                  "& .MuiInputLabel-shrink": { color: "#2563eb" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb70" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <SearchIcon sx={{ color: "#2563eb", fontSize: 24 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "20px", bgcolor: "#fff", fontWeight: 500 }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={10} md={7.8}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              alignItems={{ xs: "start", sm: "center" }}
              justifyContent="flex-end"
            >
              <TextField
                select
                label={t("Status")}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 120, bgcolor: "#fff", borderRadius: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">{t("All Status")}</MenuItem>
                <MenuItem value="open">{t("Open")}</MenuItem>
                <MenuItem value="closed">{t("Closed")}</MenuItem>
              </TextField>

              <TextField
                select
                label={t("Type")}
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 130, bgcolor: "#fff", borderRadius: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkOutlineIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">{t("All Types")}</MenuItem>
                <MenuItem value="full-time">{t("Full-time")}</MenuItem>
                <MenuItem value="part-time">{t("Part-time")}</MenuItem>
                <MenuItem value="internship">{t("Internship")}</MenuItem>
              </TextField>

              <TextField
                select
                label={t("Sort By")}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                size="small"
                sx={{ minWidth: 110, bgcolor: "#fff", borderRadius: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="date">{t("Date")}</MenuItem>
                <MenuItem value="salary">{t("Salary")}</MenuItem>
                <MenuItem value="title">{t("Title")}</MenuItem>
              </TextField>

              <TextField
                select
                label={t("Catégorie")}
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all" sx={{ color: "#8c97a8" }}>{t("All")}</MenuItem>
                {jobCategories.map(cat =>
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                )}
              </TextField>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mx: 2 }} />

        {loading ? (
          <Typography sx={{ mb: 3, fontWeight: 500, color: "#495672" }}>{t("Chargement...")}</Typography>
        ) : error ? (
          <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>
        ) : (
          <Typography sx={{ mb: 3, fontWeight: 500, color: "#495672" }}>
            {t("Showing {{shown}} of {{total}} job offers", {
              shown: offers.length,
              total: offersBackend.length
            })}
          </Typography>
        )}

        {/* Job Cards */}
        <Grid container spacing={3}>
          {paginatedOffers.map((offer) => (
            <Grid item xs={12} md={6} lg={4} key={offer._id}>
              <JobOfferCard
                offer={offer}
                getStatusColor={getStatusColor}
                getTypeColor={getTypeColor}
                formatDate={formatDate}
                setDetailOffer={setDetailOffer}
                onEdit={(offer) => { setEditOffer(offer); setCreateModalOpen(true); }}
                onDelete={(offer) => setDeleteOffer(offer)}
                onOpenApplications={onOpenApplications}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          { rowsPerPage && (
            <PaginationComponent
              count={Math.ceil(offers.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      </Box>

      {/* MODALES */}
      <JobOfferDetailsModal
        open={!!detailOffer}
        onClose={() => setDetailOffer(null)}
        offer={detailOffer}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
        formatDate={formatDate}
      />

      <CategoryFormModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        jobCategories={jobCategories}
        onCreateCategory={handleCreateCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <CreateJobOfferModal
        open={createModalOpen}
        handleClose={() => {
          setCreateModalOpen(false);
          setEditOffer(null);
        }}
        jobCategories={jobCategories}
        userId={userId}
        editOffer={editOffer}
        onSubmit={async (payload) => {
          if (editOffer) {
            await dispatch(updateJobOffre({ id: editOffer._id, updateData: payload })).unwrap();
            setEditOffer(null);
            setCreateModalOpen(false);
          } else {
            await dispatch(createJobOffre(payload)).unwrap();
            setCreateModalOpen(false);
          }
          dispatch(fetchAllJobOffres());
        }}
      />

      <CustomDeleteForm
        open={!!deleteOffer}
        handleClose={() => setDeleteOffer(null)}
        title={t("Confirmer la suppression de l'offre \"{{title}}\" ?", { title: deleteOffer?.title || "" })}
        icon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 34, color: "red" }} />}
      >
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <ButtonComponent
            text={t("Supprimer")}
            onClick={async () => {
              await dispatch(deleteJobOffre(deleteOffer._id)).unwrap();
              setDeleteOffer(null);
              dispatch(fetchAllJobOffres());
            }}
          />
          
        </Box>
      </CustomDeleteForm>
    </Box>
  );
}
