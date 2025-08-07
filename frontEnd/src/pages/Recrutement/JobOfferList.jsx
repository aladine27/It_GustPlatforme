import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Typography, TextField, MenuItem, InputAdornment, Grid, Divider, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import JobOfferCard from "../../components/JobOffre/JobOfferCard";
import JobOfferDetailsModal from "../../components/JobOffre/JobOfferDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllJobOffres,
  createJobOffre,
  fetchAllJobCategories,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
} from "../../redux/actions/JobOffreAction";
import CategoryFormModal from "../../components/JobOffre/CategoryFormModal";
import CreateJobOfferModal from "../../components/JobOffre/CreateJobOffreModal";

// Helpers pour l'affichage des statuts/types
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

export default function JobOfferList() {
  const { CurrentUser } = useSelector((state) => state.user);
  const userId = CurrentUser?.user?._id || CurrentUser?._id;
  const dispatch = useDispatch();
  const { list: offersBackend = [], loading, error } = useSelector((state) => state.jobOffre);
  const { list: jobCategories = [] } = useSelector((state) => state.jobCategory);

  // UI state pour filtres/recherche/tri
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [detailOffer, setDetailOffer] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllJobOffres());
    dispatch(fetchAllJobCategories());
  }, [dispatch]);

  // Filtres dynamiques (remplacent le filter sur mock)
  const offers = useMemo(() => {
    let arr = offersBackend;
    if (statusFilter !== "all")
      arr = arr.filter(o => (o.status && o.status.toLowerCase() === statusFilter));
    if (typeFilter !== "all")
      arr = arr.filter(o => (o.type && o.type.toLowerCase() === typeFilter));
    if (searchTerm)
      arr = arr.filter(o =>
        (o.title && o.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.location && o.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.type && o.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    // Tri dynamique
    if (sortBy === "salary")
      arr = [...arr].sort((a, b) => (Number(b.salaryRange) || 0) - (Number(a.salaryRange) || 0));
    else if (sortBy === "title")
      arr = [...arr].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sortBy === "date")
      arr = [...arr].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    return arr;
  }, [offersBackend, searchTerm, statusFilter, typeFilter, sortBy]);

  // Gestion catégories (pas changé)
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
              Job Offers
            </Typography>
            <Typography variant="body1" color="#64748b">
              Manage and track all your job postings
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
              Manage Categories
            </Button>
            <ButtonComponent
              text="Add New Offer"
              icon={<AddCircleOutlineIcon />}
              onClick={() => setCreateModalOpen(true)}
              color="#0082c8"
            />
          </Stack>
        </Stack>

        {/* Search + Filters */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{ width: "100%", position: "relative" }}>
              <TextField
                fullWidth
                label="Rechercher"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Titre, Lieu, Type..."
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
                  sx: {
                    borderRadius: "20px",
                    bgcolor: "#fff",
                    fontWeight: 500,
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              alignItems={{ xs: "start", sm: "center" }}
              justifyContent="flex-end"
            >
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                size="small"
                sx={{
                  minWidth: 120,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
              <TextField
                select
                label="Type"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                size="small"
                sx={{
                  minWidth: 130,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkOutlineIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </TextField>
              <TextField
                select
                label="Sort By"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                size="small"
                sx={{
                  minWidth: 110,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 }
                }}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="salary">Salary</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </TextField>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2, mx: 2 }} />

        
        {loading ? (
          <Typography sx={{ mb: 3, fontWeight: 500, color: "#495672" }}>Chargement...</Typography>
        ) : error ? (
          <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>
        ) : (
          <Typography sx={{ mb: 3, fontWeight: 500, color: "#495672" }}>
            Showing <b>{offers.length}</b> of <b>{offersBackend.length}</b> job offers
          </Typography>
        )}

        {/* Job Cards */}
        <Grid container spacing={3} sx={{ border:"1px solid red"  }}>
          {offers.map((offer) => (
            <Grid item xs={12} md={6} lg={4} key={offer._id} sx={{ border:"1px solid blue"}}>
              <JobOfferCard
                offer={offer}
                getStatusColor={getStatusColor}
                getTypeColor={getTypeColor}
                formatDate={formatDate}
                setDetailOffer={setDetailOffer}
              />
            </Grid>
          ))}
        </Grid>
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
        handleClose={() => setCreateModalOpen(false)}
        jobCategories={jobCategories}
        userId={userId}
        onSubmit={
          async (payload) => {
          await dispatch(createJobOffre(payload)).unwrap();
                dispatch(fetchAllJobOffres());
        }}
      />
    </Box>
  );
}
