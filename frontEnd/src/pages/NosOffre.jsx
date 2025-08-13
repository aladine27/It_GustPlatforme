// src/pages/NosOffre.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Stack, Typography, Chip, Grid, Divider, Button, Select, MenuItem,
  InputAdornment, FormControl, InputLabel, useMediaQuery, Dialog, DialogTitle,
  DialogContent, DialogActions, Card
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
import { fetchAllJobOffres } from "../redux/actions/jobOffreAction";
import { createApplication } from "../redux/actions/applicationAction";

import { ButtonComponent } from "../components/Global/ButtonComponent";
import PaginationComponent from "../components/Global/PaginationComponent";
import { StyledPaper, Title, SearchTextField } from "../style/style";
import Navbar from "../components/Navbar";
import ModelComponent from "../components/Global/ModelComponent";

// --- react-toastify ---
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ---------- helpers ----------
const NAVBAR_HEIGHT = 64;
const parseList = (str = "") =>
  String(str || "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
const uniq = (arr) => [...new Set(arr)];
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

  // Redux offres
  const { list: offers = [], loading, error } = useSelector((s) => s.jobOffre || {});

  useEffect(() => { dispatch(fetchAllJobOffres()); }, [dispatch]);

  // UI states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [salary, setSalary] = useState("all"); // statique
  const [remote, setRemote] = useState("all"); // statique
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

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
        candidatesCount: Array.isArray(o.applications) ? o.applications.length : 0
      };
    });
  }, [offers]);

  // filtres
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobsVM.filter((j) =>
      (q === "" || `${j.title} ${j.company} ${j.requirements.join(" ")}`.toLowerCase().includes(q)) &&
      (location === "" || j.location.toLowerCase().includes(location.toLowerCase())) &&
      (jobType === "all" || (j.type || "").toLowerCase() === jobType)
    );
  }, [jobsVM, search, location, jobType]);

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
    if (file.type !== "application/pdf") {
      toast.warn("Merci d'importer un fichier PDF.");
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

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", bgcolor: "#f8fafc" }}>
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
          bgcolor: "#f8fafc",
        }}
      >
        {/* Header */}
        <Box textAlign="center" px={2} py={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Title variant="h1" sx={{ fontSize: { xs: "2rem", sm: "2.6rem" }, mb: 1 }}>
              <span>Trouvez votre </span>
              <span style={{ color: "#1976d2" }}>emploi idéal</span>
            </Title>
            <Typography color="text.secondary" variant="body1" mb={2} maxWidth={600} mx="auto">
              Découvrez des opportunités sur mesure et postulez en 1 clic, avec évaluation intelligente.
            </Typography>
          </Box>
        </Box>

        <Box maxWidth="lg" mx={0} px={2} py={isMobile ? 1.5 : 4}>
          <Grid container spacing={isMobile ? 2 : 4}>
            {/* Sidebar */}
            <Grid item xs={12} md={4} lg={4}>
              <Card sx={{ boxShadow: "none", border: "none", background: "transparent" }}>
                <Box
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 3,
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
      <FormControl>
        <InputLabel>Type de contrat</InputLabel>
        <Select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          label="Type de contrat"
        >
          <MenuItem value="all">Tous les types</MenuItem>
          <MenuItem value="cdi">cdi</MenuItem>
          <MenuItem value="cdd">cdd</MenuItem>
          <MenuItem value="freelance">freelance</MenuItem>
          <MenuItem value="stage">stage</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Salaire</InputLabel>
        <Select
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          label="Salaire"
        >
          <MenuItem value="all">Tous</MenuItem>
          <MenuItem value="30-40">30 000 - 40 000 DT</MenuItem>
          <MenuItem value="40-50">40 000 - 50 000 DT</MenuItem>
          <MenuItem value="50-60">50 000 - 60 000 DT</MenuItem>
          <MenuItem value="60+">60 000 DT et plus</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Mode</InputLabel>
        <Select
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
          label="Mode"
        >
          <MenuItem value="all">Tous</MenuItem>
          <MenuItem value="remote">Télétravail</MenuItem>
          <MenuItem value="onsite">Présentiel</MenuItem>
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
                    <Select value="recent" displayEmpty>
                      <MenuItem value="recent">Plus récents</MenuItem>
                      <MenuItem value="salary">Salaire croissant</MenuItem>
                      <MenuItem value="relevance">Pertinence</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {filtered.map((job) => {
                  const st = statusStyle(job.status);
                  return (
                    <Card key={job.id} sx={{ transition: "all .17s", p: 2.4, boxShadow: 8, "&:hover": { boxShadow: 12 } }}>
                      <Grid container spacing={2}>
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
                              <Chip
                                label={`Clôture: ${fmt(job.closingDate)}`}
                                icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                                sx={{ bgcolor: "#fff3e0", color: "#d97706", fontWeight: 700 }}
                                size="small"
                              />
                            </Stack>

                            {/* Requirements */}
                            <Stack direction="row" alignItems="center" spacing={0.5} mb={1.2} flexWrap="wrap">
                              <Typography variant="h5">Requirements&nbsp;:</Typography>
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
                              <Typography variant="h5">Bonus&nbsp;:</Typography>
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
                  count={Math.max(1, Math.ceil(filtered.length / 8))}
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
        <Typography mb={1.5}>Déposez votre CV (PDF uniquement)</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            style={{ width: "100%" }}
          />

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
