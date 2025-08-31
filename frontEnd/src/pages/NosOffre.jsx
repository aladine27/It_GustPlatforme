// src/pages/NosOffre.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Typography, Chip, Grid, Divider, Button, Select, MenuItem,
  InputAdornment, FormControl, InputLabel, useMediaQuery, Dialog, DialogTitle,
  DialogContent, DialogActions, Card,
  Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobOffres,fetchAllJobCategories } from "../redux/actions/jobOffreAction";
import { createApplication } from "../redux/actions/applicationAction";
import { ButtonComponent } from "../components/Global/ButtonComponent";
import PaginationComponent from "../components/Global/PaginationComponent";
import { StyledPaper, Title, SearchTextField } from "../style/style";
import Navbar from "../components/Navbar";
import ModelComponent from "../components/Global/ModelComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uniq } from "lodash";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ---------- helpers ----------
const NAVBAR_HEIGHT = 64;
const parseList = (str = "") =>
  String(str || "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
// Removed duplicate uniq declaration - using lodash's uniq instead
const formatTND = (n) =>
  typeof n === "number" && !Number.isNaN(n)
    ? `${new Intl.NumberFormat("fr-TN").format(n)} DT`
    : "—";
const fmt = (d) => {
  try { return format(new Date(d), "dd/MM/yyyy", { locale: fr }); }
  catch { return "—"; }
};
const statusStyle = (s = "") => {
  const k = s.toLowerCase();
  if (["ouvert", "open"].includes(k)) return { bg: "#e8f5e9", color: "#2e7d32", label: s };
  if (["fermée", "closed"].includes(k)) return { bg: "#ffebee", color: "#c62828", label: s };
  return { bg: "#e3f2fd", color: "#1976d2", label: s || "—" };
};

// ---------- component ----------
export default function NosOffre() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [sort, setSort] = useState("recent");
  const today = new Date();

  // Redux offres
  const { list: offers = [], loading, error } = useSelector((s) => s.jobOffre || {});

  useEffect(() => {
     dispatch(fetchAllJobOffres());
     dispatch(fetchAllJobCategories());
    }, [dispatch]);

const { list: categories = [] } = useSelector((state) => state.jobCategory);
  // ====== Fichiers autorisés ======
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/png",
  "image/jpeg", // .jpg .jpeg
]);
const MAX_SIZE_MB = 10;

const getExt = (name = "") => {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
};

  // UI states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [salary, setSalary] = useState("all"); // statique
  const [remote, setRemote] = useState("all"); // statique
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Candidature (Modal prédéfini)
  const [applyJob, setApplyJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  // map backend -> view model
  const jobsVM = useMemo(() => {
    return (offers || []).map((o) => {
      const skills = uniq(parseList(o.requirements));
      const bonuses = uniq(parseList(o.bonuses || ""));
      return {
        id: String(o._id),
        title: o.title,
        company: "ITgust-group",              // statique (pas en DB)
        sector: "Tech",                     // statique           
        remote: false,                      // statique
        location: o.location,
        description: o.description || "",
        type: o.type || "",
        status: o.status || "",
        postedDate: o.postedDate,
        closingDate: o.closingDate,
        salaryRange: o.salaryRange,
        process: o.process || "",
        requirements: skills,
        bonuses,
        candidatesCount: Array.isArray(o.applications) ? o.applications.length : 0,
        categoryId: o.jobCategory ? String((o.jobCategory._id ?? o.jobCategory)) : null
      };
    });
  }, [offers]);

  // filtres
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobsVM.filter((j) => {
      // Recherche par texte
      const matchesSearch = q === "" || `${j.title} ${j.company} ${j.requirements.join(" ")}`.toLowerCase().includes(q);
      
      // Filtre par localisation
      const matchesLocation = location === "" || j.location.toLowerCase().includes(location.toLowerCase());
      
      // Filtre par type de contrat
      const matchesJobType = jobType === "all" || (j.type || "").toLowerCase() === jobType;
      
      // Filtre par catégorie - utiliser categoryId directement depuis jobsVM
      const matchesCategory = selectedCategory === "all" || j.categoryId === selectedCategory;
      
      return matchesSearch && matchesLocation && matchesJobType && matchesCategory;
    });
  }, [jobsVM, search, location, jobType, selectedCategory]);
  
  const sortedFiltered = useMemo(() => {
    const copy = [...filtered];
    switch (sort) {
      case "salary":
        return copy.sort((a, b) => (a.salaryRange || 0) - (b.salaryRange || 0));
      case "relevance":
        return copy.sort((a, b) => b.candidatesCount - a.candidatesCount); // le plus postulé en premier
      case "recent":
      default:
        return copy.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }
  }, [filtered, sort]);

  const handlePage = (_, v) => setPage(v);

  // details
  const openDetails = (job) => setSelectedJob(job);
  const closeDetails = () => setSelectedJob(null);

  // apply (modal prédéfini)
  const openApply = (job) => { setApplyJob(job); setCvFile(null); };
  const closeApply = () => { setApplyJob(null); setCvFile(null); };

const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) { setCvFile(null); return; }

  const ext = getExt(file.name);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);
  const mimeOk = !file.type || ALLOWED_MIME.has(file.type);
  const sizeOk = file.size <= MAX_SIZE_MB * 1024 * 1024;

  if (!extOk || !mimeOk) {
    toast.warn("Types autorisés : PDF, DOC, DOCX, PNG, JPG, JPEG.");
    e.target.value = "";
    setCvFile(null);
    return;
  }
  if (!sizeOk) {
    toast.warn(`Taille max ${MAX_SIZE_MB} Mo.`);
    e.target.value = "";
    setCvFile(null);
    return;
  }
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
  
  const filters = useMemo(() => {
    const types = uniq(offers.map(j => j.type?.toLowerCase()).filter(Boolean));
    const salaries = uniq(offers.map(j => j.salaryRange).filter(Boolean)).sort((a, b) => a - b);
    const categoryOptions = categories.map(cat => ({ id: cat._id, name: cat.name }));
    return { types, salaries, categoryOptions };
  }, [offers, categories]);

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", bgcolor: "#f8fafc",}}>
      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={1800} newestOnTop />

      {/* Navbar */}
      <Box sx={{ width: "100vw", height: `${NAVBAR_HEIGHT}px`, position: "fixed", top: 0, left: 0, zIndex: 1100 }}>
        <Navbar />
      </Box>

      {/* Main */}
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
       <Paper textAlign="center" sx={{justifyContent:"center",px:5,py:3
              ,display:"flex",backgroundColor:"#4398edff",marginLeft:"10%",marginRight:"10%",}}>
            <Box sx={{alignItems:"center",justifyContent:"center"
              ,display:"flex",flexDirection:"column"}}>
                <Typography variant="h6" >Trouvez votre emploi idéal </Typography>
           
            <Typography variant="h7" >
              Votre avenir professionnel commence ici : explorez nos offres et candidatez en un clic.
            </Typography>
            </Box>
       </Paper>
        
        <Box maxWidth="lg" mx={0} px={2} py={isMobile ? 1.5 : 4}>
          <Grid container spacing={isMobile ? 2 : 4}>
            {/* Sidebar */}
            <Grid item xs={12} md={4} lg={4}>
              <Card sx={{ boxShadow: "none", border: "none" }}>
                <Box
                  sx={{
                    bgcolor: " #f8fafcff",
                    boxShadow: 1,
                    border: "1.5px solid #b3d6fc",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Search */}
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

                  {/* Location */}
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

                  {/* Filtres (statique UI) */}
                 {/* --- Title OUTSIDE the paper --- */}
<Box sx={{ mt: 4 }}>
  <Typography
    variant="subtitle2"
    color="primary"
    sx={{ fontWeight: 600, mb: 1, ml: 0.3, fontSize: 15 }}
  >
    Filtres
  </Typography>

  <StyledPaper sx={{ border: "1px solid #e3f2fd", boxShadow: 2, p: 2.2 }}>
    <Stack spacing={2}>
     <FormControl fullWidth>
  <InputLabel>Type de contrat</InputLabel>
  <Select value={jobType} onChange={(e) => setJobType(e.target.value)} label="Type de contrat">
    <MenuItem value="all">Tous</MenuItem>
    {filters.types.map((t) => (
      <MenuItem key={t} value={t}>{t}</MenuItem>
    ))}
  </Select>
</FormControl>

   <FormControl fullWidth>
  <InputLabel>Catégorie</InputLabel>
  <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Catégorie">
    <MenuItem value="all">Toutes</MenuItem>
    {filters.categoryOptions.map((c) => (
      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
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
                      <Select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="recent">Plus récents</MenuItem>
                        <MenuItem value="salary">Salaire croissant</MenuItem>
                        <MenuItem value="relevance">Pertinence</MenuItem>
                      </Select>
                    </FormControl>

                </Box>
              </Stack>

              <Stack spacing={2}>
                {sortedFiltered.map((job) => {
                  const st = statusStyle(job.status);
                  return (
                    <Card key={job.id} sx={{  p: 2.4, boxShadow: 8, "&:hover": { boxShadow: 12 } }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={10}>
                          <Box>
                            {/* Titre + type + statut */}
                            <Stack direction="row" spacing={1} alignItems="center" mb={1.5} flexWrap="wrap">
                              <Typography variant="h3">{job.title}</Typography>
                              <Chip
                                label={job.type}
                                icon={<WorkOutlineIcon sx={{ fontSize: 16 }} />}
                                sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 700 }}
                                size="small"
                              />
                              <Chip label={st.label} size="small" sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700 }} />
                            </Stack>

                            {/* meta */}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={1.2}>
                             
                              <Typography variant="body2" color="orange">
                                <PlaceIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} /> {job.location}
                              </Typography>
                            </Stack>

                            {/* description */}
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.7 }}>
                              {job.description.length > 180 ? job.description.slice(0, 180) + "..." : job.description}
                            </Typography>

                            {/* chips salaire + dates */}
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
                              <Typography variant="h4">Requirements&nbsp;:</Typography>
                              {job.requirements.slice(0, 4).map((s) => (
                                <Chip key={s} label={s} size="small" sx={{ bgcolor: "#fafafa", color: "#1976d2", fontWeight: 700 }} />
                              ))}
                              {job.requirements.length > 4 && (
                                <Chip
                                  label={`+${job.requirements.length - 4}`}
                                  size="small"
                                  sx={{ bgcolor: "#fafafa", color: "#1976d2", fontWeight: 700 }}
                                />
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
                                <Chip
                                  label={`+${job.bonuses.length - 3}`}
                                  size="small"
                                  sx={{ bgcolor: "#ede7f6", color: "#1976d2", fontWeight: 700 }}
                                />
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
                          <Typography fontSize={14} color="text.secondary">{job.sector}</Typography>
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

      {/* Détails (MUI Dialog classique) */}
      <Dialog open={!!selectedJob} onClose={closeDetails} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedJob?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" color="primary">{selectedJob?.company}</Typography>
          <Stack direction="row" spacing={1} mt={1} mb={2} flexWrap="wrap">
            <Chip label={selectedJob?.location} icon={<PlaceIcon />} />
            <Chip label={selectedJob?.type} icon={<WorkOutlineIcon />} />
            <Chip label={formatTND(selectedJob?.salaryRange)} icon={<AttachMoneyIcon />} />
            <Chip label={`Publié: ${fmt(selectedJob?.postedDate)}`} icon={<ScheduleIcon />} />
            <Chip label={`Clôture: ${fmt(selectedJob?.closingDate)}`} icon={<ScheduleIcon />} />
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>{selectedJob?.description}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" mb={1}>Process:</Typography>
          <Typography variant="body2" mb={2}>{selectedJob?.process}</Typography>

          <Typography variant="subtitle2" mb={1}>Compétences requises :</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {(selectedJob?.requirements || []).map((s) => (
              <Chip key={s} label={s} size="small" sx={{ mb: 0.5 }} />
            ))}
          </Stack>

          <Typography variant="subtitle2" mb={1}>Bonus :</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(selectedJob?.bonuses || []).map((b) => (
              <Chip key={b} label={b} size="small" icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 15 }} />} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails} color="inherit">Fermer</Button>
          <ButtonComponent text="Postuler" icon={<SendOutlinedIcon />} color="#1976d2"
            onClick={() => { openApply(selectedJob); closeDetails(); }} />
        </DialogActions>
      </Dialog>

      {/* Candidature : Modal prédéfini */}
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
    mt: 1.8,
    p: 2,
    borderRadius: 2,
    position: "relative",
    background: "linear-gradient(135deg, #EEF6FF 0%, #F9FBFF 100%)",
    border: "1px solid",
    borderColor: "#D9E6FF",
    boxShadow: "0 10px 24px rgba(25,118,210,0.12)",
    overflow: "hidden",
    backdropFilter: "blur(2px)",
    animation: "fadeIn 280ms ease-out",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(6px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    "&:before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 6,
      background: "linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)",
    },
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
            <Button
              variant="contained"
              color="primary"
              disabled={!cvFile}
              onClick={submitApplication}
            >
              Envoyer candidature
            </Button>
          </Stack>
        </Box>
      </ModelComponent>
    </Box>
  );
}