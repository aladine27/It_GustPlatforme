import React, { useState } from "react";
import {
  Box, Stack, Typography, TextField, MenuItem, InputAdornment, Grid, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import JobOfferCard from "../../components/JobOffre/JobOfferCard";
import JobOfferDetailsModal from "../../components/JobOffre/JobOfferDetailsModal";

// --------- Mock data and helpers ---------
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

export default function JobOfferList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [detailOffer, setDetailOffer] = useState(null);

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
      (a, b) => parseInt(b.salaryRange.split("-")[1]) - parseInt(a.salaryRange.split("-")[1])
    );
  else if (sortBy === "title")
    offers = [...offers].sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "date")
    offers = [...offers].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

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
            pl: 0, // enleve le padding à gauche du field
          },
          "& .MuiInputLabel-root": {
            fontWeight: 700,
            color: "#2563eb",
            fontSize: "1.08rem"
          },
          "& .MuiInputLabel-shrink": {
            color: "#2563eb",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563eb70"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563eb"
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563eb"
          }
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
        {/* Results Count */}
        <Typography sx={{ mb: 3, fontWeight: 500, color: "#495672" }}>
          Showing <b>{offers.length}</b> of <b>{mockOffers.length}</b> job offers
        </Typography>
        {/* Job Cards */}
        <Grid container spacing={3}>
          {offers.map((offer) => (
            <Grid item xs={12} md={6} lg={4} key={offer.id}>
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
      {/* MODAL DÉTAIL */}
      <JobOfferDetailsModal
        open={!!detailOffer}
        onClose={() => setDetailOffer(null)}
        offer={detailOffer}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
        formatDate={formatDate}
      />
    </Box>
  );
}
