import React, { useState } from "react";
import {
  Box, Stack, Typography, Chip, Grid, Divider, Avatar, Tooltip,
  Button, Select, MenuItem, InputAdornment, FormControl, InputLabel, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Card
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { ButtonComponent } from "../components/Global/ButtonComponent";
import PaginationComponent from "../components/Global/PaginationComponent";
import { StyledCard, StyledPaper, Title, SearchTextField } from "../style/style";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


import Navbar from '../components/Navbar';

// Tes données MOCKS restent inchangées ici
const JOBS = [
  {
    id: 1,
    title: "Développeur Full Stack Senior",
    company: "TechInnovate",
    logo: "/placeholder.svg?height=60&width=60&text=TI",
    location: "Paris, France",
    type: "CDI",
    experience: "5+ ans",
    salary: "65 000 - 80 000 €",
    postedDate: "Il y a 2 jours",
    description: "Rejoignez notre équipe dynamique pour développer des applications web innovantes avec React, Node.js et TypeScript. Vous travaillerez sur des projets passionnants avec les dernières technologies.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    remote: true,
    urgent: false,
    featured: true,
    companySize: "50-200",
    sector: "Tech",
    rating: 4.5,
    benefits: ["Télétravail", "Tickets restaurant", "Mutuelle", "Formation"],
  },
  {
    id: 2,
    title: "Designer UX/UI",
    company: "CreativeStudio",
    logo: "/placeholder.svg?height=60&width=60&text=CS",
    location: "Lyon, France",
    type: "CDI",
    experience: "3+ ans",
    salary: "45 000 - 55 000 €",
    postedDate: "Il y a 1 jour",
    description: "Créez des expériences utilisateur exceptionnelles et des interfaces intuitives pour nos produits digitaux. Vous collaborerez étroitement avec les équipes produit et développement.",
    skills: ["Figma", "Adobe Creative", "Prototyping", "User Research", "Design System"],
    remote: false,
    urgent: true,
    featured: false,
    companySize: "20-50",
    sector: "Design",
    rating: 4.2,
    benefits: ["Horaires flexibles", "Congés supplémentaires", "Équipement fourni"],
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataInsights",
    logo: "/placeholder.svg?height=60&width=60&text=DI",
    location: "Bordeaux, France",
    type: "CDI",
    experience: "4+ ans",
    salary: "55 000 - 70 000 €",
    postedDate: "Il y a 3 jours",
    description: "Analysez des données complexes et créez des modèles prédictifs pour optimiser nos processus business. Vous utiliserez Python, R et des outils de machine learning avancés.",
    skills: ["Python", "R", "Machine Learning", "SQL", "Tableau"],
    remote: true,
    urgent: false,
    featured: true,
    companySize: "100-500",
    sector: "Data",
    rating: 4.7,
    benefits: ["Télétravail", "Stock options", "Formation continue", "Congés sabbatiques"],
  },
  {
    id: 4,
    title: "Développeur Mobile Flutter",
    company: "AppFactory",
    logo: "/placeholder.svg?height=60&width=60&text=AF",
    location: "Nantes, France",
    type: "CDD",
    experience: "2+ ans",
    salary: "40 000 - 50 000 €",
    postedDate: "Il y a 5 jours",
    description: "Développez des applications mobiles cross-platform avec Flutter pour nos clients prestigieux. Vous travaillerez sur des projets variés et stimulants.",
    skills: ["Flutter", "Dart", "Firebase", "REST API", "Git"],
    remote: true,
    urgent: false,
    featured: false,
    companySize: "10-50",
    sector: "Mobile",
    rating: 4.0,
    benefits: ["Télétravail partiel", "Prime de performance", "Événements équipe"],
  },
  {
    id: 5,
    title: "Chef de Projet Digital",
    company: "DigitalPro",
    logo: "/placeholder.svg?height=60&width=60&text=DP",
    location: "Toulouse, France",
    type: "CDI",
    experience: "6+ ans",
    salary: "50 000 - 65 000 €",
    postedDate: "Il y a 1 semaine",
    description: "Pilotez des projets digitaux innovants de A à Z. Vous coordonnerez des équipes multidisciplinaires et assurerez la livraison de solutions de qualité.",
    skills: ["Gestion de projet", "Agile", "Scrum", "Leadership", "Budget"],
    remote: false,
    urgent: true,
    featured: false,
    companySize: "200-500",
    sector: "Conseil",
    rating: 4.3,
    benefits: ["Voiture de fonction", "Primes objectives", "CE attractif"],
  },
];
const POPULAR_SEARCHES = [ "Développeur", "Designer", "Marketing", "Data", "Product Manager", "DevOps" ];
const NAVBAR_HEIGHT = 64;

export default function NosOffre() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [salary, setSalary] = useState("all");
  const [remote, setRemote] = useState("all");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState([2]);
  const [showSnack, setShowSnack] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // Pour la modal détail
  const [showApply, setShowApply] = useState(false); // Pour la modal d'upload
  const isMobile = useMediaQuery('(max-width:900px)');

  // Filtrage des offres
  const filtered = JOBS.filter((job) =>
    (search === "" || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()) || job.skills.join(" ").toLowerCase().includes(search.toLowerCase()))
    && (location === "" || job.location.toLowerCase().includes(location.toLowerCase()))
    && (jobType === "all" || job.type.toLowerCase() === jobType)
    && (remote === "all" || (remote === "remote" && job.remote) || (remote === "onsite" && !job.remote))
  );

  // Favoris
  const handleLike = (id) => {
    setSaved((prev) => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
    setShowSnack(true);
  };

  // Pagination
  const handlePage = (e, val) => setPage(val);

  // Modal de postulation (simule upload, IA, etc)
  const handleApply = (job) => setShowApply(job);
  const handleApplyClose = () => setShowApply(false);

  // Modal détail
  const handleOpenDetails = (job) => setSelectedJob(job);
  const handleCloseDetails = () => setSelectedJob(null);

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", bgcolor: "#f8fafc" }}>
      {/* Navbar */}
      <Box sx={{ width: "100vw", height: `${NAVBAR_HEIGHT}px`, position: "fixed", top: 0, left: 0, zIndex: 1100 }}>
        <Navbar />
      </Box>

      {/* Main Content */}
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
  <Box
  maxWidth="lg"
  mx={0}
  px={2}
  py={isMobile ? 1.5 : 3}
>
          {/* Header */}
          <Box textAlign="center" mb={isMobile ? 3 : 5}>
            <Title variant="h1" sx={{ fontSize: { xs: "2rem", sm: "2.6rem" }, mb: 1 }}>
              <span>Trouvez votre </span>
              <span style={{ color: "#1976d2" }}>emploi idéal</span>
            </Title>
            <Typography color="text.secondary" variant="body1" mb={2} maxWidth={600} mx="auto">
              Découvrez des opportunités sur mesure et postulez en 1 clic, avec évaluation intelligente.
            </Typography>
          </Box>

          {/* Grille principale */}
          <Grid container spacing={isMobile ? 2 : 4}>
            {/* Sidebar gauche : Recherche + Filtres */}
          <Grid item xs={12} md={4} lg={4}>

  <Card
    sx={{
      width: "100%",
      minHeight: "calc(100vh - 130px)", // ← Prend toute la hauteur visible sous la navbar (ajuste la valeur selon ton header)
      boxShadow: "none",
      border: "none",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    }}
  >
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
        flex: 1, // ← occupe tout l'espace disponible
        width: "100%",
      }}
    >
      {/* Label + Search */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ fontWeight: 600, mb: 0.7, ml: 0.3, fontSize: 15 }}
        >
          Poste, compétences ou entreprise
        </Typography>
        <SearchTextField
          fullWidth
          placeholder="Poste, compétences, entreprise..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%" }}
        />
      </Box>

      {/* Label + Localisation */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ fontWeight: 600, mb: 0.7, ml: 0.3, fontSize: 15 }}
        >
          Ville ou région
        </Typography>
        <SearchTextField
          fullWidth
          placeholder="Ville, région..."
          value={location}
          onChange={e => setLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PlaceIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%" }}
        />
      </Box>

      {/* Bouton à droite */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          sx={{
            minWidth: 80,
            width: "fit-content",
            borderRadius: 6,
            fontWeight: 700,
            px: 2,
            py: 0.8,
            fontSize: 15,
            boxShadow: 'none',
          }}
        >
          Rechercher
        </Button>
      </Box>

      {/* Bloc filtres en bas de la Card, collé */}
      <StyledPaper sx={{
        mt: 4,
        border: "1px solid #e3f2fd",
        boxShadow: 2,
        width: "100%",
      }}>
        <Typography variant="h6" color="primary" mb={1} fontWeight={700}>
          <WorkOutlineIcon sx={{ mr: 1, fontSize: 20 }} /> Filtres
        </Typography>
        <Stack spacing={2} mt={1}>
          <FormControl>
            <InputLabel>Type de contrat</InputLabel>
            <Select
              value={jobType}
              onChange={e => setJobType(e.target.value)}
              label="Type de contrat"
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="cdi">CDI</MenuItem>
              <MenuItem value="cdd">CDD</MenuItem>
              <MenuItem value="freelance">Freelance</MenuItem>
              <MenuItem value="stage">Stage</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Salaire</InputLabel>
            <Select
              value={salary}
              onChange={e => setSalary(e.target.value)}
              label="Salaire"
            >
              <MenuItem value="all">Tous les salaires</MenuItem>
              <MenuItem value="30-40">30 000 - 40 000 €</MenuItem>
              <MenuItem value="40-50">40 000 - 50 000 €</MenuItem>
              <MenuItem value="50-60">50 000 - 60 000 €</MenuItem>
              <MenuItem value="60+">60 000 € et plus</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Mode de travail</InputLabel>
            <Select
              value={remote}
              onChange={e => setRemote(e.target.value)}
              label="Mode de travail"
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
            onClick={() => { setJobType("all"); setSalary("all"); setRemote("all"); }}
          >
            Réinitialiser
          </Button>
        </Stack>
      </StyledPaper>
    </Box>
  </Card>
</Grid>

            {/* Liste des offres */}
            <Grid item xs={12} md={8} lg={8}>
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
                <Typography variant="h5" color="primary" fontWeight={700}>
                  {filtered.length} offres trouvées
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
                {filtered.map((job) => (
                  <StyledCard
                    key={job.id}
                    sx={{
                      border: job.featured ? "2px solid #ffe082" : "",
                      bgcolor: job.featured ? "#fffde7" : "background.paper",
                      transition: "all 0.17s",
                      p: 2.4,
                      cursor: "pointer",
                      "&:hover": { boxShadow: 8 }
                    }}
                    onClick={() => handleOpenDetails(job)}
                  >
                    <Grid container spacing={2}>
                      {/* Info principale */}
                      <Grid item xs={12} md={10}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                         
                          <Box flex={1}>
                            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
  <Typography variant="h6" fontWeight={700}>
    {job.title}
  </Typography>
  <Chip
    label={job.type}
    icon={<WorkOutlineIcon sx={{ fontSize: 16 }} />}
    sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 700 }}
    size="small"
  />
</Stack>

                            
                            
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={0.4} mb={0.8}>
                              <Typography variant="body2" color="text.secondary">
                                <BusinessIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} /> {job.company}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <PlaceIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} /> {job.location}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} /> {job.postedDate}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.7 }}>
                              {job.description.length > 180
                                ? job.description.slice(0, 180) + "..."
                                : job.description}
                            </Typography>
                            {/* Tags infos */}
                            <Stack direction="row" spacing={1} mb={0.7}>
                           
                              <Chip
                                label={job.salary}
                                icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />}
                                sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }}
                                size="small"
                              />
                             
                              {job.remote && (
                                <Chip
                                  label="Télétravail"
                                  sx={{ bgcolor: "#e0f2f1", color: "#00897b", fontWeight: 700 }}
                                  size="small"
                                />
                              )}
                            </Stack>
                            {/* Skills */}
                            <Stack direction="row" alignItems="center" spacing={1} mb={0.7}>
  <Typography
    variant="subtitle2"
    sx={{ color: "#1976d2", fontWeight: 600, mb: 0, minWidth: 110 /* optionnel: fixe la largeur du label */ }}
  >
    Requirements&nbsp;:
  </Typography>
  {job.skills.slice(0, 4).map((skill) => (
    <Chip
      key={skill}
      label={skill}
      size="small"
      sx={{ bgcolor: "#fafafa", color: "#1976d2", fontWeight: 700 }}
    />
  ))}
  {job.skills.length > 4 && (
    <Chip
      label={`+${job.skills.length - 4}`}
      size="small"
      sx={{ bgcolor: "#fafafa", color: "#1976d2", fontWeight: 700 }}
    />
  )}
</Stack>

                            {/* Benefits */}
                            <Stack direction="row" spacing={0.7}>
                              {job.benefits.slice(0, 3).map((b) => (
                                <Chip
                                  key={b}
                                  icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 15 }} />}
                                  label={b}
                                  size="small"
                                  sx={{ bgcolor: "#ede7f6", color: "#1976d2", fontWeight: 700 }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>
                      {/* Actions */}
                      <Grid item xs={12} md={2} align="right">
                        <Stack spacing={1} direction="column" alignItems="flex-end" justifyContent="flex-start">
                          <ButtonComponent
                            text="Postuler"
                            icon={<SendOutlinedIcon />}
                            color="#1976d2"
                            sx={{ minWidth: 110, mb: 0.7, boxShadow: 2 }}
                            onClick={e => { e.stopPropagation(); handleApply(job); }}
                          />
                       
                        </Stack>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    {/* Footer entreprise */}
                    <Stack direction="row" alignItems="center" spacing={3} justifyContent="space-between" px={1}>
                      <Stack direction="row" spacing={2} alignItems="center">
                       
                        <Typography fontSize={14} color="text.secondary">{job.companySize} employés</Typography>
                        <Typography fontSize={14} color="text.secondary">{job.sector}</Typography>
                      </Stack>
                      <Button
                        variant="text"
                        color="primary"
                        endIcon={<InfoOutlinedIcon />}
                        sx={{ fontWeight: 700,
                          background: "#e0e0e0",
                         }}
                        onClick={e => { e.stopPropagation(); handleOpenDetails(job); }}
                      >
                        Voir Details
                      </Button>
                    </Stack>
                  </StyledCard>
                ))}
              </Stack>
              {/* Pagination */}
              <Box mt={4} pb={6}>
                <PaginationComponent
                  count={2}
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

      {/* Snack de favoris */}
      <Snackbar
        open={showSnack}
        autoHideDuration={1600}
        onClose={() => setShowSnack(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {saved.length ? "Ajouté aux favoris !" : "Retiré des favoris !"}
        </Alert>
      </Snackbar>

      {/* Modal détail offre */}
      <Dialog open={!!selectedJob} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedJob?.title}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" color="primary">
            {selectedJob?.company}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} mb={2}>
            <Chip label={selectedJob?.location} icon={<PlaceIcon />} />
            <Chip label={selectedJob?.type} icon={<WorkOutlineIcon />} />
            <Chip label={selectedJob?.salary} icon={<AttachMoneyIcon />} />
            <Chip label={selectedJob?.experience} icon={<GroupIcon />} />
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {selectedJob?.description}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" mb={1}>Compétences requises :</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedJob?.skills?.map(skill => (
              <Chip key={skill} label={skill} size="small" sx={{ mb: 0.5 }} />
            ))}
          </Stack>
          {/* Ajoute ici le score de matching IA plus tard */}
          {/* <Typography mt={2}>Score matching IA : 88%</Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="inherit">Fermer</Button>
          <ButtonComponent text="Postuler" icon={<SendOutlinedIcon />} color="#1976d2" onClick={() => { setShowApply(selectedJob); handleCloseDetails(); }} />
        </DialogActions>
      </Dialog>

      {/* Modal Postuler (futur : upload + IA) */}
      <Dialog open={!!showApply} onClose={handleApplyClose} maxWidth="xs" fullWidth>
        <DialogTitle>Postuler à {showApply?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography mb={2}>Déposez votre CV (fonction IA à intégrer ici)</Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled>
            Déposer un CV (à activer)
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyClose}>Annuler</Button>
          <Button variant="contained" color="primary" disabled>Envoyer candidature</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
