import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Typography, Chip, Grid, Divider, Button, Select, MenuItem,
  InputAdornment, FormControl, InputLabel, useMediaQuery, Dialog, DialogTitle,
  DialogContent, DialogActions, Card, Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobOffres, fetchAllJobCategories } from "../redux/actions/jobOffreAction";
import { createApplication } from "../redux/actions/applicationAction";
import { ButtonComponent } from "../components/Global/ButtonComponent";
import PaginationComponent from "../components/Global/PaginationComponent";
import { StyledPaper, SearchTextField } from "../style/style";
import Navbar from "../components/Navbar";
import ModelComponent from "../components/Global/ModelComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uniq } from "lodash";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/* ===== Helpers ===== */
const NAVBAR_HEIGHT = 64;
const parseList = (str = "") =>
  String(str || "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

const formatTND = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? `${new Intl.NumberFormat("fr-TN").format(n)} DT`
    : "—";

const fmt = (d) => {
  try { return format(new Date(d), "dd/MM/yyyy", { locale: fr }); }
  catch { return "—"; }
};

/* Traductions simples (uniquement pour l’affichage) */
const FR_MAP = {
  "full-time": "Temps plein",
  "part-time": "Temps partiel",
  "internship": "Stage",
  "contract": "Contrat",
  "freelance": "Freelance",
  "open": "Ouvert",
  "closed": "Fermée",
  "remote": "Télétravail",
  "onsite": "Sur site",
  "on-site": "Sur site",
  "hybrid": "Hybride",
};
const frLabel = (val) => {
  const key = String(val || "").toLowerCase().trim();
  return FR_MAP[key] || val || "";
};

const statusStyle = (s = "") => {
  const k = String(s || "").toLowerCase();
  if (k === "open")   return { bg: "#e8f5e9", color: "#2e7d32", label: frLabel(s) };
  if (k === "closed") return { bg: "#ffebee", color: "#c62828", label: frLabel(s) };
  return { bg: "#e3f2fd", color: "#1976d2", label: frLabel(s || "—") };
};

/* ===== Composant ===== */
export default function NosOffre() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [sort, setSort] = useState("recent");

  // Redux
  const { list: offers = [], loading, error } = useSelector((s) => s.jobOffre || {});
  // ⬇️ même sélecteur que dans l’ancienne version
  const { list: categories = [] } = useSelector((state) => state.jobCategory || {});

  useEffect(() => {
    dispatch(fetchAllJobOffres());
    dispatch(fetchAllJobCategories());
  }, [dispatch]);

  // Upload
  const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
  const ALLOWED_MIME = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ]);
  const MAX_SIZE_MB = 10;
  const getExt = (name = "") => {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i).toLowerCase() : "";
  };

  // UI state
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [salary, setSalary] = useState("all");
  const [remote, setRemote] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  // ⬇️ filtre catégorie (mêmes noms de variables/valeurs que l’ancien code)
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Apply
  const [applyJob, setApplyJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  /* -------- Mapping backend -> view model (avec categoryId) -------- */
  const jobsVM = useMemo(() => {
    return (offers || [])
      // AJOUT : On filtre ici pour ne conserver que les offres avec le statut "open"
      .filter(o => (o.status || "").toLowerCase() === "open")
      .map((o) => {
        const skills  = uniq(parseList(o.requirements));
        const bonuses = uniq(parseList(o.bonuses || ""));

        // robustesse: o.jobCategory peut être un object {_id,name} OU juste l’id
        const catId =
          o?.jobCategory && typeof o.jobCategory === "object"
            ? String(o.jobCategory._id || o.jobCategory.id || "")
            : o?.jobCategory != null
            ? String(o.jobCategory)
            : null;

        return {
          id: String(o._id),
          title: o.title,
          description: o.description || "",
          process: o.process || "",
          type: o.type || "",
          status: o.status || "",
          location: o.location || "",
          postedDate: o.postedDate,
          closingDate: o.closingDate,
          salaryRange: o.salaryRange,
          requirements: skills,
          bonuses,
          candidatesCount: Array.isArray(o.applications) ? o.applications.length : 0,
          categoryId: catId, // 🔸 clé utilisée pour filtrer
          // labels FR d’affichage
          typeLabel: frLabel(o.type),
          statusLabel: frLabel(o.status),
          locationLabel: o.location,
        };
      });
  }, [offers]);

  /* -------- Filtres (même logique que l’ancien) -------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobsVM.filter((j) => {
      const matchesSearch =
        q === "" || `${j.title} ${j.requirements.join(" ")} ${j.description}`
          .toLowerCase()
          .includes(q);

      const matchesLocation =
        location === "" ||
        (j.location || "").toLowerCase().includes(location.toLowerCase());

      const matchesJobType =
        jobType === "all" || (j.type || "").toLowerCase() === jobType;

      // 🔸 filtre par catégorie : compare la string categoryId
      const matchesCategory =
        selectedCategory === "all" ||
        (j.categoryId && String(j.categoryId) === String(selectedCategory));

      return matchesSearch && matchesLocation && matchesJobType && matchesCategory;
    });
  }, [jobsVM, search, location, jobType, selectedCategory]);

  const sortedFiltered = useMemo(() => {
    const copy = [...filtered];
    switch (sort) {
      case "salary":
        return copy.sort((a, b) => (a.salaryRange || 0) - (b.salaryRange || 0));
      case "relevance":
        return copy.sort((a, b) => b.candidatesCount - a.candidatesCount);
      case "recent":
      default:
        return copy.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }
  }, [filtered, sort]);

  // pagination
  const perPage = 8;
  const handlePage = (_e, v) => setPage(v);

  // details/apply
  const openDetails = (job) => setSelectedJob(job);
  const closeDetails = () => setSelectedJob(null);
  const openApply = (job) => { setApplyJob(job); setCvFile(null); };
  const closeApply = () => { setApplyJob(null); setCvFile(null); };

  // upload
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) { setCvFile(null); return; }
    const ext = getExt(file.name);
    const extOk = ALLOWED_EXTENSIONS.includes(ext);
    const mimeOk = !file.type || ALLOWED_MIME.has(file.type);
    const sizeOk = file.size <= MAX_SIZE_MB * 1024 * 1024;
    if (!extOk || !mimeOk) { toast.warn("Types autorisés : PDF, DOC, DOCX, PNG, JPG, JPEG."); e.target.value=""; setCvFile(null); return; }
    if (!sizeOk) { toast.warn(`Taille max ${MAX_SIZE_MB} Mo.`); e.target.value=""; setCvFile(null); return; }
    setCvFile(file);
  };

  const submitApplication = async () => {
    if (!applyJob || !cvFile) return;
    try {
      await dispatch(createApplication({ jobOffre: applyJob.id, cvFile })).unwrap();
      toast.success("Candidature envoyée !");
      closeApply();
    } catch (e) {
      toast.error(e || "Erreur lors de la candidature");
    }
  };

  /* -------- Options des filtres --------
     Types = depuis les offres.
     Catégories = depuis Redux (on n’y touche pas, pas de traduction). */
  const filters = useMemo(() => {
    const typesRaw = uniq(
      offers.map(j => (j.type || "").toLowerCase()).filter(Boolean)
    );
    // catégories affichées telles quelles
    const categoryOptions = (categories || []).map((cat) => ({
      id: String(cat?._id ?? cat?.id ?? ""),
      name: cat?.name ?? cat?.title ?? "",
    })).filter(c => c.id && c.name);
    return { typesRaw, categoryOptions };
  }, [offers, categories]);

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", bgcolor: "#f8fafc" }}>
      <ToastContainer position="bottom-right" autoClose={1800} newestOnTop />
      <Box sx={{ width: "100vw", height: `${NAVBAR_HEIGHT}px`, position: "fixed", top: 0, left: 0, zIndex: 1100 }}>
        <Navbar />
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: `${NAVBAR_HEIGHT}px`,
          left: 0,
          width: "100vw",
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          overflowY: "auto",
          bgcolor: "#dfe9f3ff",
        }}
      >
        {/* Header */}
        <Paper textAlign="center" sx={{ justifyContent: "center", px: 5, py: 3, display: "flex", backgroundColor: "#4398edff", marginLeft: "10%", marginRight: "10%" }}>
          <Box sx={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column" }}>
            <Typography variant="h8">Trouvez votre emploi idéal </Typography>
            <Typography variant="h9">Votre avenir professionnel commence ici : explorez nos offres et candidatez en un clic.</Typography>
          </Box>
        </Paper>

        <Box maxWidth="lg" mx={0} px={2} py={isMobile ? 1.5 : 4}>
          <Grid container spacing={isMobile ? 2 : 4}>
            {/* Sidebar */}
            <Grid item xs={12} md={4} lg={4}>
              <Card sx={{ boxShadow: "none", border: "none" }}>
                <Box sx={{ bgcolor: " #f8fafcff", boxShadow: 1, border: "1.5px solid #b3d6fc", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 0.7, ml: 0.3, fontSize: 15 }}>
                      Poste, compétences ou entreprise
                    </Typography>
                    <SearchTextField
                      fullWidth
                      placeholder="Poste, compétences, entreprise..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 0.7, ml: 0.3, fontSize: 15 }}>
                      Ville ou région
                    </Typography>
                    <SearchTextField
                      fullWidth
                      placeholder="Ville, région..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceIcon sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Divider sx={{ mt: 1, mb: 0 }} />

                  {/* Filtres */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1, ml: 0.3, fontSize: 15 }}>
                      Filtres
                    </Typography>

                    <StyledPaper sx={{ border: "1px solid #e3f2fd", boxShadow: 2, p: 2.2 }}>
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>Type de contrat</InputLabel>
                          <Select value={jobType} onChange={(e) => setJobType(e.target.value)} label="Type de contrat">
                            <MenuItem value="all">Tous</MenuItem>
                            {filters.typesRaw.map((t) => (
                              <MenuItem key={t} value={t}>{frLabel(t)}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth>
                          <InputLabel>Catégorie</InputLabel>
                          <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Catégorie"
                          >
                            <MenuItem value="all">Toutes</MenuItem>
                            {filters.categoryOptions.map((c) => (
                              <MenuItem key={c.id} value={c.id}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<RestartAltOutlinedIcon />}
                          sx={{ borderRadius: 2, fontWeight: 600, mt: 1 }}
                          onClick={() => {
                            setJobType("all");
                            setSalary("all");
                            setRemote("all");
                            setLocation("");
                            setSearch("");
                            setSort("recent");
                            setSelectedCategory("all");
                          }}
                        >
                          Réinitialiser
                        </Button>
                      </Stack>
                    </StyledPaper>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Liste */}
            <Grid item xs={12} md={8} lg={8}>
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
                <Typography variant="h5" color="primary" fontWeight={700}>
                  {loading ? "Chargement..." : error ? "Erreur" : `${filtered.length} offres trouvées`}
                  {search && (
                    <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
                      pour "{search}"
                    </Typography>
                  )}
                </Typography>
                <Box sx={{ minWidth: 140, maxWidth: 220 }}>
                  <FormControl fullWidth size="small">
                    <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                      <MenuItem value="recent">Plus récents</MenuItem>
                      <MenuItem value="salary">Salaire croissant</MenuItem>
                      <MenuItem value="relevance">Pertinence</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {sortedFiltered
                  .slice((page - 1) * 8, page * 8)
                  .map((job) => {
                    const st = statusStyle(job.status);
                    return (
                      <Card key={job.id} sx={{ p: 2.4, boxShadow: 8, "&:hover": { boxShadow: 12 } }}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={10}>
                            <Box>
                              {/* Titre + type + statut */}
                              <Stack direction="row" spacing={1} alignItems="center" mb={1.5} flexWrap="wrap">
                                <Typography variant="h3">{job.title}</Typography>
                                <Chip
                                  label={frLabel(job.type)}
                                  icon={<WorkOutlineIcon sx={{ fontSize: 16 }} />}
                                  sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 700 }}
                                  size="small"
                                />
                                <Chip label={st.label} size="small" sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700 }} />
                              </Stack>

                              {/* meta */}
                              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={1.2}>
                                <Typography variant="body2" color="orange">
                                  <PlaceIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} /> {job.locationLabel}
                                </Typography>
                              </Stack>

                              {/* description */}
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.7 }}>
                                {job.description.length > 180 ? job.description.slice(0, 180) + "..." : job.description}
                              </Typography>

                              {/* salaire + dates */}
                              <Stack direction="row" spacing={1} mb={1.5} mt={1.2} flexWrap="wrap">
                                <Chip
                                  label={formatTND(job.salaryRange)}
                                  icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />}
                                  sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }}
                                  size="small"
                                />
                                <Chip
                                  label={`Publié: ${fmt(job.postedDate)}`}
                                  icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                                  sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 700 }}
                                  size="small"
                                />
                              </Stack>

                              {/* Requirements */}
                              <Stack direction="row" alignItems="center" spacing={0.5} mb={1.2} flexWrap="wrap">
                                <Typography variant="h4">Compétences requises&nbsp;:</Typography>
                                {job.requirements.slice(0, 4).map((s) => (
                                  <Chip key={s} label={s} size="small" sx={{ bgcolor: "#fafafa", color: "#1976d2", fontWeight: 700 }} />
                                ))}
                                {job.requirements.length > 4 && (
                                  <Chip label={`+${job.requirements.length - 4}`} size="small" sx={{ bgcolor: "#fafafa", color: "#1976d2", fontWeight: 700 }} />
                                )}
                              </Stack>

                              {/* Bonus */}
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Typography variant="h4">Bonus&nbsp;:</Typography>
                                {job.bonuses.slice(0, 3).map((b) => (
                                  <Chip
                                    key={b}
                                    icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 15 }} />}
                                    label={b}
                                    size="small"
                                    sx={{ bgcolor: "#ede7f6", color: "#1976d2", fontWeight: 700 }}
                                  />
                                ))}
                                {job.bonuses.length > 3 && (
                                  <Chip label={`+${job.bonuses.length - 3}`} size="small" sx={{ bgcolor: "#ede7f6", color: "#1976d2", fontWeight: 700 }} />
                                )}
                              </Stack>
                            </Box>
                          </Grid>

                          {/* action */}
                          <Grid item xs={12} md={2}>
                            <ButtonComponent
                              text="Postuler"
                              icon={<SendOutlinedIcon />}
                              color="#1976d2"
                              sx={{ minWidth: 110, mb: 0.7, boxShadow: 2 }}
                              onClick={() => openApply(job)}
                            />
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-between" px={1} flexWrap="wrap">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography fontSize={14} color="text.secondary">Tech</Typography>
                            <Typography fontSize={14} color="text.secondary">Candidats: {job.candidatesCount}</Typography>
                            <Typography fontSize={14} color="text.secondary">Clôture: {fmt(job.closingDate)}</Typography>
                          </Stack>
                          <Button variant="text" color="primary" endIcon={<InfoOutlinedIcon />} onClick={() => openDetails(job)}>
                            Voir Details
                          </Button>
                        </Stack>
                      </Card>
                    );
                  })}
              </Stack>

              <Box mt={4} pb={6}>
                <PaginationComponent
                  count={Math.max(1, Math.ceil(sortedFiltered.length / 8))}
                  page={page}
                  onChange={handlePage}
                  color="primary"
                  size="large"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Détails (modale) */}
      <Dialog
        open={!!selectedJob}
        onClose={closeDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden", boxShadow: "0 18px 48px rgba(25,118,210,.20)" } }}
      >
        <DialogTitle sx={{ px: 3, py: 2.5, bgcolor: "linear-gradient(135deg,#f7fbff 0%, #eef6ff 100%)", borderBottom: "1px solid #e6effb" }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: "primary.main", mb: 0.5 }}>
            {selectedJob?.title}
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, border: "none", bgcolor: "#fff" }}>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              <Chip
                label={selectedJob?.location}
                icon={<PlaceIcon sx={{ fontSize: 18 }} />}
                size="small"
                sx={{ bgcolor: "#F3F8FF", border: "1px solid #D8E8FF", fontWeight: 700 }}
              />
              <Chip
                label={frLabel(selectedJob?.type)}
                icon={<WorkOutlineIcon sx={{ fontSize: 18 }} />}
                size="small"
                sx={{ bgcolor: "#FFF7F0", border: "1px solid #FFE2C8", fontWeight: 700 }}
              />
              <Chip
                label={formatTND(selectedJob?.salaryRange)}
                icon={<AttachMoneyIcon sx={{ fontSize: 18 }} />}
                size="small"
                sx={{ bgcolor: "#F1FBF3", border: "1px solid #CDEFD5", fontWeight: 700 }}
              />
              <Chip
                label={`Publié: ${fmt(selectedJob?.postedDate)}`}
                icon={<ScheduleIcon sx={{ fontSize: 18 }} />}
                size="small"
                sx={{ bgcolor: "#F7FAFF", border: "1px solid #E6EEFF", fontWeight: 700 }}
              />
            </Stack>

            <Box sx={{ p: 2, mb: 2.5, borderRadius: 2, bgcolor: "linear-gradient(180deg,#FCFEFF 0%, #F6FAFF 100%)", border: "1px solid #E6EFFB" }}>
              <Typography variant="body2" color="text.secondary">
                {selectedJob?.description}
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <InfoOutlinedIcon sx={{ color: "primary.main" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>Process</Typography>
            </Stack>
            <Typography variant="body2" sx={{ mb: 2.5 }}>
              {selectedJob?.process}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>Compétences requises</Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2.5}>
              {(selectedJob?.requirements || []).map((s) => (
                <Chip key={s} label={s} size="small" sx={{ mb: 0.5, bgcolor: "#EEF4FF", border: "1px solid #D9E6FF", color: "primary.main", fontWeight: 700 }} />
              ))}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EmojiEventsOutlinedIcon sx={{ color: "primary.main" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>Bonus</Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(selectedJob?.bonuses || []).map((b) => (
                <Chip
                  key={b}
                  label={b}
                  size="small"
                  icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{ mb: 0.5, bgcolor: "#F5F0FF", border: "1px solid #E6DAFF", color: "primary.main", fontWeight: 700, "& .MuiChip-icon": { color: "primary.main" } }}
                />
              ))}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#F7FAFF", borderTop: "1px solid #E6EFFB" }}>
          <Button onClick={closeDetails} color="inherit" sx={{ fontWeight: 700 }}>Fermer</Button>
          <ButtonComponent
            text="Postuler"
            icon={<SendOutlinedIcon />}
            color="#1976d2"
            onClick={() => { openApply(selectedJob); closeDetails(); }}
            sx={{ boxShadow: 2 }}
          />
        </DialogActions>
      </Dialog>

      {/* Candidature */}
      <ModelComponent
        open={!!applyJob}
        handleClose={closeApply}
        title={applyJob ? `Postuler à ${applyJob.title}` : ""}
        icon={<SendOutlinedIcon />}
      >
        <Typography mb={1.5}>Déposez votre CV</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <input
            type="file"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,.pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={onFileChange}
            style={{ width: "100%" }}
          />
          <Box
            sx={{
              mt: 1.8, p: 2, borderRadius: 2, position: "relative",
              background: "linear-gradient(135deg, #EEF6FF 0%, #F9FBF5 100%)",
              border: "1px solid", borderColor: "#D9E6FF",
              boxShadow: "0 10px 24px rgba(25,118,210,0.12)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <InfoOutlinedIcon sx={{ color: "#1976d2", mt: "2px" }} />
              <Typography variant="body2" sx={{ color: "#0F172A", lineHeight: 1.7 }}>
                <strong style={{ color: "#0B3D91" }}>Information&nbsp;:</strong>&nbsp;
                si vous n'obtenez pas de réponse sous <b style={{ color: "#1976d2" }}>15&nbsp;jours</b>,
                veuillez considérer que votre candidature n'a pas été retenue. Merci pour votre intérêt.
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button onClick={closeApply}>Annuler</Button>
            <Button variant="contained" color="primary" disabled={!cvFile} onClick={submitApplication}>
              Envoyer candidature
            </Button>
          </Stack>
        </Box>
      </ModelComponent>
    </Box>
  );
}
