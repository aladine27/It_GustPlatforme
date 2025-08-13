// src/pages/Recrutement/ApplicationList.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Typography, Divider, Stack, TextField, InputAdornment, Slider,
  Tooltip, IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EmailIcon from "@mui/icons-material/Email";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import { fetchApplicationsByJobOffre } from "../../redux/actions/applicationAction";
import ModelComponent from "../../components/Global/ModelComponent";

const FILE_BASE = "http://localhost:3000/uploads/applications";
const FLASK_URL = "http://localhost:5000/match_skills";

export default function ApplicationList({ selectedOffer }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const params = useParams();
  const location = useLocation();
  const routeOffer = location?.state?.offer || null;
  const currentOffer = selectedOffer || routeOffer || null;
  const jobOffreId = currentOffer?._id || params?.jobOffreId || null;

  // Redux
  const { list: applications = [], loading, error } = useSelector((s) => s.application);

  // States
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [filtered, setFiltered] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaError, setIaError] = useState(null);
  const [iaResults, setIaResults] = useState([]);

  // Filtres (UNIQUEMENT bloc IA)
  const [search, setSearch] = useState("");
  const [scoreRange, setScoreRange] = useState([0, 100]);

  const prettyName = (f = "") => {
    const m = f.match(/^[A-Za-z0-9]{10,}[-_](.+)$/);
    return m ? m[1] : f;
  };

  // Aperçu (modal)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Zoom CV (modal)
  const [zoom, setZoom] = useState(1);
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2;
  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const handleZoomReset = () => setZoom(1);

  // Charger candidatures
  useEffect(() => {
    if (jobOffreId) dispatch(fetchApplicationsByJobOffre(jobOffreId));
  }, [jobOffreId, dispatch]);

  // ===== Bloc 1 : CV reçus (simple) =====
  const cvColumns = [{ id: "displayFilename", label: t("Nom du fichier") }];
  const rowsPerPage1 = 5;

  const cvRows = useMemo(
    () => applications.map((a) => ({
      _id: a._id,
      storedFilename: a.cvFile || "-",
      displayFilename: prettyName(a.cvFile || "-"),
    })),
    [applications]
  );

  const paginatedCVRows = useMemo(() => {
    const start = (page1 - 1) * rowsPerPage1;
    return cvRows.slice(start, start + rowsPerPage1);
  }, [cvRows, page1]);

  const cvActions = [
    {
      tooltip: t("Aperçu"),
      icon: <PictureAsPdfIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        setPreviewFile(row.storedFilename);
        setPreviewOpen(true);
        handleZoomReset();
      },
    },
    {
      tooltip: t("Télécharger"),
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: (row) => window.open(`${FILE_BASE}/${row.storedFilename}`, "_blank"),
    },
  ];

  // ===== IA : POST Flask =====
  const handleFilterIA = async () => {
    const requirements =
      currentOffer?.requirements ||
      applications?.[0]?.jobOffre?.requirements ||
      "";

    if (!requirements) {
      alert(t("Aucun requirements trouvé pour cette offre."));
      return;
    }

    const allowedSet = new Set(applications.map((a) => a?.cvFile).filter(Boolean));
    const allowed_filenames = Array.from(allowedSet);

    setFiltered(true);
    setIaLoading(true);
    setIaError(null);

    try {
      const res = await axios.post(FLASK_URL, { requirements, allowed_filenames });
      const raw = Array.isArray(res.data) ? res.data : [];
      const onlyLinked = raw
        .filter((it) => allowedSet.has(it.filename))
        .map((r) => ({
          filename: r.filename,                    // brut pour actions
          displayFilename: prettyName(r.filename), // joli pour affichage
          email: r.email || "-",
          score: typeof r.score === "number" ? Math.round(r.score) : 0,
          skills_matched: r.skills_matched || [],
        }));
      setIaResults(onlyLinked);
      setPage2(1);
    } catch (e) {
      setIaError(e?.response?.data?.error || e.message);
      setIaResults([]);
    } finally {
      setIaLoading(false);
    }
  };

  // ===== Bloc 2 : Résultats IA =====
  const iaColumns = [
    { id: "ranking", label: t("Rang"), render: (row) => <b>{row.ranking}</b> },
    { id: "displayFilename", label: t("CV") },
    { id: "email", label: t("Email") },
    { id: "score", label: t("Score IA") },
    {
      id: "skills_matched",
      label: t("Compétences trouvées"),
      render: (row) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {(row.skills_matched || []).map((s) => (
            <Typography
              key={s}
              sx={{
                bgcolor: "#e0f2f1",
                color: "#1976d2",
                borderRadius: 1,
                px: 1,
                mr: 0.5,
                fontSize: 13,
              }}
            >
              {s}
            </Typography>
          ))}
        </Stack>
      ),
    },
  ];
  const rowsPerPage2 = 5;

  // Filtres (recherche + score) appliqués aux résultats IA
  const iaRowsFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const [min, max] = scoreRange;
    return iaResults
      .filter((r) => {
        const scoreOk =
          typeof r.score === "number" ? r.score >= min && r.score <= max : true;
        if (!q) return scoreOk;
        const hay = `${r.displayFilename} ${r.email} ${(r.skills_matched || []).join(" ")}`.toLowerCase();
        return scoreOk && hay.includes(q);
      })
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  }, [iaResults, search, scoreRange]);

  const iaRows = useMemo(
    () => iaRowsFiltered.map((r, idx) => ({ ranking: idx + 1, ...r })),
    [iaRowsFiltered]
  );

  const paginatedIARows = useMemo(() => {
    const start = (page2 - 1) * rowsPerPage2;
    return iaRows.slice(start, start + rowsPerPage2);
  }, [iaRows, page2]);

  const iaActions = [
    {
      tooltip: t("Aperçu"),
      icon: <PictureAsPdfIcon fontSize="small" color="primary" />,
      onClick: (row) => {
        setPreviewFile(row.filename);
        setPreviewOpen(true);
        handleZoomReset();
      },
    },
    {
      tooltip: t("Télécharger CV"),
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: (row) => window.open(`${FILE_BASE}/${row.filename}`, "_blank"),
    },
    {
      tooltip: t("Envoyer Email"),
      icon: <EmailIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        if (!row.email || row.email === "-") return;
        window.open(
          `mailto:${row.email}?subject=${encodeURIComponent(
            `${t("Candidature")} ${row.filename}`
          )}&body=${encodeURIComponent("Bonjour,")}`,
          "_blank"
        );
      },
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", py: 3 }}>
      <Box sx={{ maxWidth: 1250, mx: "auto", px: { xs: 1, md: 2 } }}>
        <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
          {t("Candidatures — Filtrage & Aperçu")}
        </Typography>

        {/* Bloc 1 : Table des CV (backend) */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 1.5, boxShadow: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="h6" fontWeight={700} color="primary">
              {t("CV Reçus")} ({cvRows.length})
            </Typography>
            <ButtonComponent
              text={iaLoading ? t("Analyse...") : t("Filtrer via IA")}
              icon={<FilterAltIcon />}
              onClick={handleFilterIA}
              color="#1976d2"
              disabled={iaLoading || cvRows.length === 0}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Typography>{t("Chargement...")}</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <TableComponent columns={cvColumns} rows={paginatedCVRows} actions={cvActions} />
              <Box sx={{ mt: 2 }}>
                <PaginationComponent
                  count={Math.max(1, Math.ceil(cvRows.length / rowsPerPage1))}
                  page={page1}
                  onChange={(e, p) => setPage1(p)}
                />
              </Box>
            </>
          )}
        </Paper>

        {/* Bloc 2 : Résultats IA */}
        <Paper sx={{ p: 3, borderRadius: 1.5, boxShadow: 2 }}>
          <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
            {t("Résultats du filtrage IA")}
          </Typography>

          {!filtered ? (
            <Typography color="#64748b" fontStyle="italic" mb={2}>
              {t("Lance l’analyse via le bouton {{btn}} au-dessus.", { btn: t("Filtrer via IA") })}
            </Typography>
          ) : iaLoading ? (
            <Typography>{t("Analyse en cours...")}</Typography>
          ) : iaError ? (
            <Typography color="error">{iaError}</Typography>
          ) : (
            <>
              {/* Filtres IA */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", md: "center" }}
                justifyContent="space-between"
                sx={{
                  width: "65%",
                  "& .MuiSlider-rail, & .MuiSlider-track": { height: 6 },
                  "& .MuiSlider-thumb": { width: 16, height: 16 },
                  mb:2,
                }}
              >
                <TextField
                  fullWidth
                  placeholder={t("Rechercher (email, fichier, compétence...)")}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage2(1);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ minWidth: 280 }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {t("Score IA ({{min}} - {{max}})", { min: scoreRange[0], max: scoreRange[1] })}
                  </Typography>
                  <Slider
                    value={scoreRange}
                    onChange={(_, v) => setScoreRange(v)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                  />
                </Box>
              </Stack>

              <TableComponent columns={iaColumns} rows={paginatedIARows} actions={iaActions} />
              <Box sx={{ mt: 2 }}>
                <PaginationComponent
                  count={Math.max(1, Math.ceil(iaRows.length / rowsPerPage2))}
                  page={page2}
                  onChange={(e, p) => setPage2(p)}
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Modal d'aperçu (iframe PDF/HTML) + ZOOM */}
      <ModelComponent
        open={previewOpen}
        handleClose={() => { setPreviewOpen(false); setPreviewFile(null); handleZoomReset(); }}
        title={t("Aperçu du CV")}
        icon={<PictureAsPdfIcon />}
      >
        {previewFile ? (
          <Box>
            {/* Toolbar Zoom */}
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} sx={{ mb: 1 }}>
              <Tooltip title={t("Zoom -")}>
                <span>
                  <IconButton onClick={handleZoomOut} disabled={zoom <= ZOOM_MIN} size="small">
                    <RemoveRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Typography variant="body2" sx={{ minWidth: 64, textAlign: "center" }}>
                {(zoom * 100).toFixed(0)}%
              </Typography>
              <Tooltip title={t("Zoom +")}>
                <span>
                  <IconButton onClick={handleZoomIn} disabled={zoom >= ZOOM_MAX} size="small">
                    <AddRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t("Réinitialiser")}>
                <IconButton onClick={handleZoomReset} size="small">
                  <RestartAltRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Zone scrollable + scale */}
            <Box sx={{ height: "72vh", overflow: "auto", borderRadius: 1, bgcolor: "#fafbfc", p: 1 }}>
              <Box
                sx={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  width: `${100 / zoom}%`,
                }}
              >
                <iframe
                  title="cv-preview"
                  src={`${FILE_BASE}/${previewFile}`}
                  style={{ width: "100%", height: "72vh", border: "none", borderRadius: 8 }}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">{t("Aucun fichier sélectionné.")}</Typography>
        )}
      </ModelComponent>
    </Box>
  );
}
