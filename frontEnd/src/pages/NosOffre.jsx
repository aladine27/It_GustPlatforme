// pages/JobOffersStatic.jsx
import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Grid,
  Paper,
  Divider,
  Avatar,
  Tooltip,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
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
import { ButtonComponent, Buttons } from "../components/Global/ButtonComponent";
import PaginationComponent from "../components/Global/PaginationComponent"
import { StyledCard, StyledPaper, Title, SearchTextField } from "../style/style"

// ====== Données statiques ======
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

const POPULAR_SEARCHES = [
  "Développeur",
  "Designer",
  "Marketing",
  "Data",
  "Product Manager",
  "DevOps"
];

// ====== Composant principal ======
export default function NosOffre() {
  // states search/filtres locaux
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState("all");
  const [salary, setSalary] = useState("all");
  const [remote, setRemote] = useState("all");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState([2]); // juste demo: l’offre 2 est "likée"

  // Filtrage statique (pas de pagination backend ici)
  const filtered = JOBS.filter((job) =>
    (search === "" || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()) || job.skills.join(" ").toLowerCase().includes(search.toLowerCase()))
    && (location === "" || job.location.toLowerCase().includes(location.toLowerCase()))
    && (jobType === "all" || job.type.toLowerCase() === jobType)
    && (remote === "all" || (remote === "remote" && job.remote) || (remote === "onsite" && !job.remote))
  );

  // Fonctions actions demo
  const handleLike = (id) => setSaved((prev) => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  const handlePage = (e, val) => setPage(val);

  // Affichage
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      {/* Barre top + hero */}
      <Paper elevation={0} sx={{
        borderRadius: 0, borderBottom: "1.5px solid #e3f2fd",
        bgcolor: "#fff", mb: 2, py: 2
      }}>
        <Box maxWidth="lg" mx="auto" px={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Typography variant="h2" sx={{ letterSpacing: 0.3, fontWeight: 800, color: "primary.main" }}>
                JobBoard
              </Typography>
              <Stack direction="row" spacing={2} display={{ xs: "none", md: "flex" }}>
                <Buttons to="#">Emplois</Buttons>
                <Buttons to="#">Entreprises</Buttons>
                <Buttons to="#">Salaires</Buttons>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="text" color="primary" sx={{ display: { xs: "none", md: "inline-flex" } }}>
                Connexion
              </Button>
              <ButtonComponent text="Inscription" />
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Hero section */}
      <Box maxWidth="lg" mx="auto" px={3} py={3}>
        <Box textAlign="center" mb={5}>
          <Title variant="h1" sx={{ fontSize: { xs: "2.1rem", sm: "2.7rem" } }}>
            Trouvez votre <span style={{ color: "#1976d2" }}>emploi idéal</span>
          </Title>
          <Typography color="text.secondary" variant="body1" mb={2} maxWidth={600} mx="auto">
            Découvrez des milliers d'opportunités dans les meilleures entreprises
          </Typography>
        </Box>

        {/* Barre de recherche */}
        <StyledCard sx={{ maxWidth: 850, mx: "auto", my: 3, p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <SearchTextField
              placeholder="Titre du poste, compétences, entreprise..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#b0b8c3" }} />
                  </InputAdornment>
                ),
              }}
            />
            <SearchTextField
              placeholder="Ville, région..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon sx={{ color: "#b0b8c3" }} />
                  </InputAdornment>
                ),
              }}
            />
            <ButtonComponent text="Rechercher" icon={<SearchIcon />} color="#1976d2" />
          </Stack>
          {/* Recherches populaires */}
          <Stack direction="row" spacing={1} mt={2}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ alignSelf: "center" }}>
              Recherches populaires :
            </Typography>
            {POPULAR_SEARCHES.map(txt => (
              <Button
                key={txt}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2, fontWeight: 600, borderColor: "#e3f2fd",
                  background: "#fff", color: "#1976d2", minWidth: 90, px: 1,
                  "&:hover": { background: "#e3f2fd" }
                }}
                onClick={() => setSearch(txt)}
              >
                {txt}
              </Button>
            ))}
          </Stack>
        </StyledCard>
      </Box>

      <Box maxWidth="lg" mx="auto" px={3} py={0}>
        <Grid container spacing={4}>
          {/* Sidebar Filtres */}
          <Grid item xs={12} md={4} lg={3}>
            <StyledPaper sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" mb={1} fontWeight={700}>
                <WorkOutlineIcon sx={{ mr: 1, fontSize: 22 }} />
                Filtres
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
                  <InputLabel>Expérience</InputLabel>
                  <Select
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    label="Expérience"
                  >
                    <MenuItem value="all">Toute expérience</MenuItem>
                    <MenuItem value="junior">Débutant (0-2 ans)</MenuItem>
                    <MenuItem value="mid">Confirmé (3-5 ans)</MenuItem>
                    <MenuItem value="senior">Senior (5+ ans)</MenuItem>
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
                    <MenuItem value="all">Tous les modes</MenuItem>
                    <MenuItem value="remote">Télétravail</MenuItem>
                    <MenuItem value="onsite">Présentiel</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RestartAltOutlinedIcon />}
                  sx={{ borderRadius: 2, fontWeight: 600, mt: 1 }}
                  onClick={() => { setJobType("all"); setExperience("all"); setSalary("all"); setRemote("all"); }}
                >
                  Réinitialiser les filtres
                </Button>
              </Stack>
            </StyledPaper>

            <StyledCard sx={{
              mt: 3,
              background: "linear-gradient(135deg, #1976d2 0%, #0082c8 100%)",
              color: "#fff"
            }}>
              <Typography variant="h6" mb={1} fontWeight={700}>
                <EmojiEventsOutlinedIcon sx={{ mr: 1, fontSize: 22 }} />
                Conseils Carrière
              </Typography>
              <Typography fontSize={15} color="#e3eafc" mb={2}>
                Optimisez votre profil et augmentez vos chances d'être recruté
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#1976d2",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#e3f2fd" }
                }}
              >
                Voir les conseils
              </Button>
            </StyledCard>
          </Grid>

          {/* Liste offres */}
          <Grid item xs={12} md={8} lg={9}>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2} mb={2}>
              <Typography variant="h4" color="primary" fontWeight={700}>
                {filtered.length} emplois trouvés
                {search && (
                  <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
                    pour "{search}"
                  </Typography>
                )}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select value="recent" displayEmpty>
                  <MenuItem value="recent">Plus récents</MenuItem>
                  <MenuItem value="salary">Salaire croissant</MenuItem>
                  <MenuItem value="relevance">Pertinence</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={3}>
              {filtered.map((job) => (
                <StyledCard key={job.id} sx={{
                  border: job.featured ? "2px solid #ffe082" : "",
                  bgcolor: job.featured ? "#fffde7" : "background.paper",
                  transition: "all 0.17s"
                }}>
                  <Grid container spacing={2}>
                    {/* Logo et infos principales */}
                    <Grid item xs={12} md={10}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar src={job.logo} alt={job.company} sx={{
                          width: 58, height: 58, bgcolor: "#e3f2fd", border: "2px solid #e3f2fd", fontWeight: 700, fontSize: 23
                        }}>
                          {job.company.slice(0, 2)}
                        </Avatar>
                        <Box flex={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h5" fontWeight={700}>
                              {job.title}
                            </Typography>
                            {job.featured && (
                              <Chip
                                size="small"
                                icon={<StarIcon sx={{ color: "#ffb300", fontSize: 18, ml: -0.7 }} />}
                                label="Recommandé"
                                sx={{ bgcolor: "#fff9c4", color: "#b39500", fontWeight: 700, ml: 1 }}
                              />
                            )}
                            {job.urgent && (
                              <Chip
                                size="small"
                                label="Urgent"
                                sx={{ bgcolor: "#ffebee", color: "#d32f2f", fontWeight: 700, ml: 1 }}
                              />
                            )}
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={2} mt={0.4} mb={0.8}>
                            <Typography variant="body2" color="text.secondary">
                              <BusinessIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} />
                              {job.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <PlaceIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} />
                              {job.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.2 }} />
                              {job.postedDate}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.7 }}>
                            {job.description}
                          </Typography>
                          {/* Tags infos */}
                          <Stack direction="row" spacing={1} mb={0.7}>
                            <Chip
                              label={job.type}
                              icon={<WorkOutlineIcon sx={{ fontSize: 16 }} />}
                              sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 700 }}
                              size="small"
                            />
                            <Chip
                              label={job.salary}
                              icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />}
                              sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }}
                              size="small"
                            />
                            <Chip
                              label={job.experience}
                              icon={<GroupIcon sx={{ fontSize: 16 }} />}
                              sx={{ bgcolor: "#ede7f6", color: "#6a1b9a", fontWeight: 700 }}
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
                          <Stack direction="row" spacing={0.7} mb={0.7}>
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
                          sx={{ minWidth: 110, mb: 0.7 }}
                        />
                        <Stack direction="row" spacing={1}>
                          <Tooltip title={saved.includes(job.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>
                            <Button
                              onClick={() => handleLike(job.id)}
                              size="small"
                              sx={{
                                bgcolor: saved.includes(job.id) ? "#ffebee" : "#fff",
                                color: saved.includes(job.id) ? "#d32f2f" : "#888",
                                minWidth: 0, px: 1.2, borderRadius: 2
                              }}
                            >
                              {saved.includes(job.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </Button>
                          </Tooltip>
                          <Tooltip title="Partager">
                            <Button size="small" sx={{ minWidth: 0, px: 1.2, borderRadius: 2, color: "#1976d2" }}>
                              <ShareOutlinedIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Enregistrer">
                            <Button size="small" sx={{ minWidth: 0, px: 1.2, borderRadius: 2, color: "#1976d2" }}>
                              <BookmarkBorderOutlinedIcon />
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  {/* Footer entreprise */}
                  <Stack direction="row" alignItems="center" spacing={3} justifyContent="space-between" px={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography fontSize={14} color="text.secondary">
                        <StarIcon sx={{ color: "#ffb300", fontSize: 18, mr: 0.2, mb: -0.2 }} /> {job.rating}/5
                      </Typography>
                      <Typography fontSize={14} color="text.secondary">{job.companySize} employés</Typography>
                      <Typography fontSize={14} color="text.secondary">{job.sector}</Typography>
                    </Stack>
                    <Button variant="text" color="primary" endIcon={<SendOutlinedIcon />}>
                      Voir l'entreprise
                    </Button>
                  </Stack>
                </StyledCard>
              ))}
            </Stack>
            {/* Pagination */}
            <Box mt={4}>
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
  );
}
