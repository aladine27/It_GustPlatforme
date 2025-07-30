import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Divider,
  Tooltip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import { StyledCard, StyledPaper } from "../../style/style";

const mockOffers = [
  {
    id: 1,
    title: "DevOps Engineer",
    description: "Manage our cloud infrastructure and deployment pipelines. Work with cutting-edge technologies and help scale our platform.",
    requirements: "3+ years experience\nDevOps, Cloud AWS/GCP, CI/CD, Linux, Docker, scripting.",
    location: "Austin, TX",
    process: "Screening call > Technical test > Final interview",
    type: "Full-time",
    postedDate: "2024-01-20",
    closingDate: "2024-02-20",
    salaryRange: "120000 - 130000",
    emailContact: "hr@techcorp.com",
    status: "Open"
  },
  {
    id: 2,
    title: "Senior Frontend Developer",
    description: "Build amazing user experiences with React and TypeScript. Join our innovative team working on next-gen products.",
    requirements: "5+ years React\nTypeScript, UI/UX, API REST, Figma.",
    location: "San Francisco, CA",
    process: "Portfolio review > Tech assignment > Team fit interview",
    type: "Full-time",
    postedDate: "2024-01-18",
    closingDate: "2024-02-25",
    salaryRange: "140000 - 150000",
    emailContact: "jobs@innovatelab.com",
    status: "Open"
  },
  {
    id: 3,
    title: "UX Designer",
    description: "Design intuitive and beautiful interfaces that users love. Work closely with product and engineering teams.",
    requirements: "2+ years UX/UI, Figma,\nprototyping, Design Thinking.",
    location: "New York, NY",
    process: "CV screening > Design challenge > Final panel",
    type: "Part-time",
    postedDate: "2024-01-10",
    closingDate: "2024-02-15",
    salaryRange: "70000 - 90000",
    emailContact: "careers@designstudio.com",
    status: "Closed"
  },
];

// Helpers color
function getStatusColor(status) {
  if (status.toLowerCase() === "open") return { bg: "#e4faeb", color: "#22a77c" };
  if (status.toLowerCase() === "closed") return { bg: "#ffe4e4", color: "#e04747" };
  return { bg: "#f3f4f6", color: "#607d8b" };
}
function getTypeColor(type) {
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

// ----------- MODAL DÉTAIL -----------
function JobOfferDetailsModal({ open, onClose, offer }) {
  if (!offer) return null;

  const status = getStatusColor(offer.status);
  const type = getTypeColor(offer.type);

  // Pour split les requirements en ligne si \n ou ,
  const reqs = offer.requirements
    ? offer.requirements.split(/\n|,/).map((el) => el.trim()).filter(Boolean)
    : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: StyledPaper,
        sx: {
          p: { xs: 1.5, sm: 3 },
          borderRadius: 4,
          background: "#f9fbfd",
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: "linear-gradient(90deg, #e3f2fd 0%, #e0f1ff 100%)",
          pb: 1,
          borderRadius: "14px 14px 0 0"
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 800, color: "#2563eb", letterSpacing: 0.4, fontSize: "1.16rem" }}
        >
          {offer.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#227FBF', background: "#f3faff", '&:hover': { background: "#e3f2fd" } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mb: 2 }} />
      <DialogContent sx={{ px: { xs: 0, sm: 1 }, minHeight: 260 }}>
        <Stack spacing={2}>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Description:</Typography>
            <Typography sx={{ mt: 0.4 }}>{offer.description}</Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Requirements:</Typography>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {reqs.map((req, idx) => <li key={idx}><Typography>{req}</Typography></li>)}
            </ul>
          </Box>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Process:</Typography>
            <Typography sx={{ mt: 0.4 }}>{offer.process}</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip icon={<WorkOutlineIcon />} label={offer.type} sx={{
              bgcolor: type.bg,
              color: type.color,
              fontWeight: 700,
              fontSize: 14.5,
              borderRadius: 2
            }} />
            <Chip icon={<MonetizationOnOutlinedIcon />} label={`$${offer.salaryRange}`} sx={{
              bgcolor: "#dbf9e9", color: "#14a35e", fontWeight: 700, fontSize: 14.5, borderRadius: 2
            }} />
            <Chip icon={<CalendarMonthOutlinedIcon />} label={`Posted: ${formatDate(offer.postedDate)}`} sx={{
              bgcolor: "#dde6fa", color: "#3969e6", fontWeight: 700, fontSize: 14.5, borderRadius: 2
            }} />
            <Chip icon={<CalendarMonthOutlinedIcon />} label={`Closing: ${formatDate(offer.closingDate)}`} sx={{
              bgcolor: "#fff2d6", color: "#d89b1d", fontWeight: 700, fontSize: 14.5, borderRadius: 2
            }} />
          </Stack>
          <Box>
            <Typography color="text.secondary" fontWeight={700}>Contact:</Typography>
            <Link href={`mailto:${offer.emailContact}`} underline="hover" color="#2264d9" fontWeight={600}>
              {offer.emailContact}
            </Link>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 3 }}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------- MAIN COMPONENT -----------
export default function JobOfferList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [detailOffer, setDetailOffer] = useState(null);

  // Filtering logic
  let offers = mockOffers.filter(
    (o) =>
      (statusFilter === "all" || o.status.toLowerCase() === statusFilter) &&
      (typeFilter === "all" || o.type.toLowerCase() === typeFilter) &&
      (searchTerm === "" ||
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  if (sortBy === "salary")
    offers = [...offers].sort(
      (a, b) =>
        parseInt(b.salaryRange.split("-")[1]) -
        parseInt(a.salaryRange.split("-")[1])
    );
  else if (sortBy === "title")
    offers = [...offers].sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "date")
    offers = [...offers].sort(
      (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
    );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", py: 3 }}>
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
          <ButtonComponent
            text="Add New Offer"
            icon={null}
            color="#1976d2"
            sx={{
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 17,
              px: 4,
              py: 1.5,
              boxShadow: "0 2px 12px #a5b4fc39"
            }}
          />
        </Stack>
        {/* Search + Filters */}
        <StyledPaper sx={{ mb: 5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box sx={{ position: "relative", width: "100%" }}>
                <SearchIcon sx={{ position: "absolute", left: 16, top: 15, color: "#b0b8d1", zIndex: 1 }} />
                <TextField
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search job offers..."
                  sx={{
                    pl: 4,
                    borderRadius: 3,
                    bgcolor: "#fff",
                    "& .MuiOutlinedInput-root": { pl: 3.5, borderRadius: 3 }
                  }}
                  InputProps={{
                    sx: { pl: 3.5, height: 48, bgcolor: "#fff" },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems={{ xs: "start", sm: "center" }} justifyContent="flex-end">
                <TextField
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120, bgcolor: "#fff", borderRadius: 2 }}
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
                  onChange={(e) => setTypeFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 130, bgcolor: "#fff", borderRadius: 2 }}
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
                  onChange={(e) => setSortBy(e.target.value)}
                  size="small"
                  sx={{ minWidth: 110, bgcolor: "#fff", borderRadius: 2 }}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="salary">Salary</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </TextField>
              </Stack>
            </Grid>
          </Grid>
        </StyledPaper>
        {/* Results Count */}
        <Typography sx={{ mb: 3, fontWeight: 500, color: "#495672" }}>
          Showing <b>{offers.length}</b> of <b>{mockOffers.length}</b> job offers
        </Typography>
        {/* Job Cards */}
        <Grid container spacing={3}>
          {offers.map((offer) => {
            const status = getStatusColor(offer.status);
            const type = getTypeColor(offer.type);
            return (
              <Grid item xs={12} md={6} lg={4} key={offer.id}>
                <StyledCard
                  sx={{
                    p: 0,
                    borderRadius: "27px",
                    background: "linear-gradient(140deg,#f9fbfe 60%,#f0f4fc 100%)",
                    minHeight: 430,
                    maxWidth: 420,
                    mx: "auto",
                    boxShadow: "0 8px 36px 0 rgba(80,130,210,0.13)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    position: "relative",
                    border: "1.5px solid #c5e0fc",
                    transition: "box-shadow 0.18s, transform 0.14s",
                    "&:hover": {
                      boxShadow: "0 16px 32px #1976d233",
                      transform: "translateY(-6px) scale(1.025)",
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{
                    bgcolor: "#f4f7fb",
                    px: 3,
                    pt: 2.4,
                    pb: 1.5,
                    position: "relative",
                  }}>
                    <Typography variant="h6" fontWeight={800} color="#223"
                      sx={{ fontSize: 20.5, lineHeight: 1.12, mb: 0.2, wordBreak: "break-word" }}>
                      {offer.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#2464b9",
                        fontSize: 15.5,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                      }}
                      component={Link}
                      href={`https://www.google.com/maps/search/${encodeURIComponent(offer.location)}`}
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                    >
                      <LocationOnOutlinedIcon sx={{ fontSize: 17, color: "#90caf9", mr: 0.6 }} />
                      {offer.location}
                    </Typography>
                    <Chip
                      label={offer.status}
                      sx={{
                        position: "absolute",
                        top: 19,
                        right: 19,
                        bgcolor: status.bg,
                        color: status.color,
                        fontWeight: 700,
                        fontSize: 15,
                        borderRadius: "999px",
                        px: 2.1,
                        height: 32,
                        boxShadow: "0 1px 7px #0001",
                      }}
                    />
                  </Box>
                  {/* Body */}
                  <Box sx={{ px: 3, pt: 2.2, flex: 1, background: "rgba(245,248,255,0.6)" }}>
                    <Typography
                      variant="body2"
                      color="#223344"
                      sx={{ fontWeight: 400, mb: 2, fontSize: 15.3, minHeight: 44 }}
                    >
                      {offer.description}
                    </Typography>
                    {/* Bloc requirements */}
                    <Box
                      sx={{
                        bgcolor: "#f5f8fe",
                        borderRadius: "20px",
                        px: 2,
                        py: 1.2,
                        mb: 1.2,
                        mt: 0.8,
                        display: "flex",
                        alignItems: "flex-start",
                        minHeight: 44,
                      }}
                    >
                      <ChecklistRtlOutlinedIcon sx={{ color: "#1976d2", fontSize: 20, mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography fontWeight={700} fontSize={15.5} color="#222" sx={{ lineHeight: 1.2, mb: "2px" }}>
                          Requirements:
                        </Typography>
                        <Typography
                          fontSize={14}
                          color="#1e293b"
                          sx={{
                            fontWeight: 500,
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                            // on limite la taille sur la card pour éviter l'effet compact
                            maxHeight: 50,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2 // Affiche max 2 lignes, le reste sera visible dans le détail
                          }}
                        >
                          {offer.requirements}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Chips infos */}
                    <Stack
                      direction="column"
                      spacing={1.1}
                      mb={1.7}
                      alignItems="flex-start"
                    >
                      <Chip
                        icon={<WorkOutlineIcon sx={{ fontSize: 17 }} />}
                        label={offer.type}
                        sx={{
                          bgcolor: type.bg,
                          color: type.color,
                          fontWeight: 700,
                          fontSize: 14.5,
                          borderRadius: 2,
                          px: 1.2,
                          height: 30,
                          boxShadow: "0 1px 2px #0001",
                        }}
                      />
                      <Chip
                        icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 17 }} />}
                        label={`$${offer.salaryRange}`}
                        sx={{
                          bgcolor: "#dbf9e9",
                          color: "#14a35e",
                          fontWeight: 700,
                          fontSize: 14.5,
                          borderRadius: 2,
                          px: 1.2,
                          height: 30,
                          boxShadow: "0 1px 2px #0001",
                        }}
                      />
                      <Chip
                        icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 17 }} />}
                        label={`Posted: ${formatDate(offer.postedDate)}`}
                        sx={{
                          bgcolor: "#dde6fa",
                          color: "#3969e6",
                          fontWeight: 700,
                          fontSize: 14.5,
                          borderRadius: 2,
                          px: 1.2,
                          height: 30,
                          boxShadow: "0 1px 2px #0001",
                        }}
                      />
                      <Chip
                        icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 17 }} />}
                        label={`Closing: ${formatDate(offer.closingDate)}`}
                        sx={{
                          bgcolor: "#fff2d6",
                          color: "#d89b1d",
                          fontWeight: 700,
                          fontSize: 14.5,
                          borderRadius: 2,
                          px: 1.2,
                          height: 30,
                          boxShadow: "0 1px 2px #0001",
                        }}
                      />
                    </Stack>
                    {/* Email Contact encart */}
                    <Box
                      sx={{
                        bgcolor: "#e9f0fd",
                        borderRadius: 4,
                        px: 2,
                        py: 1,
                        mb: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        boxShadow: "0 1px 7px #0060c31c",
                      }}
                    >
                      <EmailOutlinedIcon sx={{ color: "#2264d9", fontSize: 19 }} />
                      <Typography fontWeight={700} color="#1446b1" fontSize={15.5}>
                        Contact:
                      </Typography>
                      <Link
                        href={`mailto:${offer.emailContact}`}
                        underline="hover"
                        color="#2264d9"
                        fontWeight={600}
                        sx={{ fontSize: 15.5, ml: 0.5 }}
                      >
                        {offer.emailContact}
                      </Link>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 0.7 }} />
                  {/* Footer actions */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    px={2.2}
                    py={1.2}
                    gap={1.3}
                    sx={{ background: "#F6F8FD" }}
                  >
                    <Tooltip title="Détail">
                      <IconButton size="small" onClick={() => setDetailOffer(offer)}>
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small">
                        <DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: "#e04747" }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {/* MODAL DÉTAIL */}
      <JobOfferDetailsModal
        open={!!detailOffer}
        onClose={() => setDetailOffer(null)}
        offer={detailOffer}
      />
    </Box>
  );
}
