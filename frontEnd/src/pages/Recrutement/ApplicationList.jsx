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
  console.log("🚀 ApplicationList - Composant initialisé avec selectedOffer:", selectedOffer);
  
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const params = useParams();
  const location = useLocation();
  const routeOffer = location?.state?.offer || null;
  const currentOffer = selectedOffer || routeOffer || null;
  const jobOffreId = currentOffer?._id || params?.jobOffreId || null;

  console.log("📍 ApplicationList - Params et offre:", {
    params,
    routeOffer,
    currentOffer,
    jobOffreId
  });

  // Redux
  const { list: applications = [], loading, error } = useSelector((s) => s.application);
  console.log("🔄 Redux state - applications:", {
    applicationsLength: applications.length,
    applications,
    loading,
    error
  });

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

  console.log("📊 States actuels:", {
    page1, page2, filtered, iaLoading, iaError,
    iaResultsLength: iaResults.length,
    search, scoreRange
  });

  const prettyName = (f = "") => {
    console.log("🎨 prettyName - input:", f);
    const m = f.match(/^[A-Za-z0-9]{10,}[-_](.+)$/);
    const result = m ? m[1] : f;
    console.log("🎨 prettyName - output:", result);
    return result;
  };

  // ✅ FIX helper: normalisation pour correspondance flexible
  const normalizeName = (s = "") => {
    try {
      return decodeURIComponent(s)
        .normalize("NFKD").replace(/[\u0300-\u036f]/g, "") // accents
        .replace(/\s+/g, "")                               // espaces
        .replace(/[~()]/g, "")                              // char parasites
        .toLowerCase()
        .replace(/^(\d{10,}[-_])+/g, "");                  // retire 1+ timestamps-/_ au début
    } catch {
      return String(s).toLowerCase().replace(/^(\d{10,}[-_])+/g, "");
    }
  };

  // Aperçu (modal)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Zoom CV (modal)
  const [zoom, setZoom] = useState(1);
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2;
  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => {
    console.log("🔍 Zoom In - avant:", zoom);
    setZoom((z) => {
      const newZoom = Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2));
      console.log("🔍 Zoom In - après:", newZoom);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    console.log("🔍 Zoom Out - avant:", zoom);
    setZoom((z) => {
      const newZoom = Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2));
      console.log("🔍 Zoom Out - après:", newZoom);
      return newZoom;
    });
  };
  
  const handleZoomReset = () => {
    console.log("🔍 Zoom Reset");
    setZoom(1);
  };

  // Charger candidatures
  useEffect(() => {
    console.log("🔄 useEffect - Chargement des candidatures pour jobOffreId:", jobOffreId);
    if (jobOffreId) {
      console.log("📡 Dispatch fetchApplicationsByJobOffre");
      dispatch(fetchApplicationsByJobOffre(jobOffreId));
    }
  }, [jobOffreId, dispatch]);

  // ===== Bloc 1 : CV reçus (simple) =====
  const cvColumns = [{ id: "displayFilename", label: t("Nom du fichier") }];
  const rowsPerPage1 = 5;

  const cvRows = useMemo(() => {
    console.log("📄 cvRows useMemo - applications:", applications);
    const rows = applications.map((a) => {
      const row = {
        _id: a._id,
        storedFilename: a.cvFile || "-",
        displayFilename: prettyName(a.cvFile || "-"),
      };
      console.log("📄 cvRows - mapping application:", a, "to row:", row);
      return row;
    });
    console.log("📄 cvRows - résultat final:", rows);
    return rows;
  }, [applications]);

  const paginatedCVRows = useMemo(() => {
    console.log("📖 paginatedCVRows - page1:", page1, "rowsPerPage1:", rowsPerPage1);
    const start = (page1 - 1) * rowsPerPage1;
    const result = cvRows.slice(start, start + rowsPerPage1);
    console.log("📖 paginatedCVRows - start:", start, "result:", result);
    return result;
  }, [cvRows, page1]);

  const cvActions = [
    {
      tooltip: t("Aperçu"),
      icon: <PictureAsPdfIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        console.log("👁️ Action Aperçu CV - row:", row);
        setPreviewFile(row.storedFilename);
        setPreviewOpen(true);
        handleZoomReset();
      },
    },
    {
      tooltip: t("Télécharger"),
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        console.log("⬇️ Action Télécharger CV - row:", row);
        const url = `${FILE_BASE}/${row.storedFilename}`;
        console.log("⬇️ URL de téléchargement:", url);
        window.open(url, "_blank");
      },
    },
  ];

  // ===== IA : POST Flask =====
  const handleFilterIA = async () => {
    console.log("🤖 handleFilterIA - Début du filtrage IA");
    console.log("🤖 currentOffer:", currentOffer);
    console.log("🤖 applications:", applications);
    
    const requirements =
      currentOffer?.requirements ||
      applications?.[0]?.jobOffre?.requirements ||
      "";

    console.log("📋 Requirements extraits:", requirements);

    if (!requirements) {
      console.error("❌ Aucun requirements trouvé");
      alert(t("Aucun requirements trouvé pour cette offre."));
      return;
    }

    // Création du Set des fichiers autorisés (logs existants conservés)
    const applicationFiles = applications.map((a) => a?.cvFile).filter(Boolean);
    console.log("📁 Fichiers des applications (avant Set):", applicationFiles);
    
    const allowedSet = new Set(applicationFiles);
    console.log("📁 allowedSet:", allowedSet);
    
    const allowed_filenames = Array.from(allowedSet);
    console.log("📁 allowed_filenames pour Flask:", allowed_filenames);

    // ✅ FIX: index normalisé -> vrais noms DB (gère doublons et variations)
    const allowedIndex = applicationFiles.reduce((map, f) => {
      const k = normalizeName(f);
      map.set(k, [...(map.get(k) || []), f]);
      return map;
    }, new Map());
    console.log("📁 allowedIndex keys (normalisés):", [...allowedIndex.keys()]);

    setFiltered(true);
    setIaLoading(true);
    setIaError(null);

    try {
      console.log("📡 Envoi requête POST à Flask:", {
        url: FLASK_URL,
        payload: { requirements, allowed_filenames }
      });

      const res = await axios.post(FLASK_URL, { requirements, allowed_filenames });
      console.log("📨 Réponse Flask brute:", res.data);
      
      const raw = Array.isArray(res.data) ? res.data : [];
      console.log("📨 Données Flask après vérification array:", raw);

      // ✅ FIX: Filtrage + mapping avec correspondance flexible et remap vers le vrai filename DB
      console.log("🔍 Début filtrage des résultats Flask:");
      const linked = raw.flatMap((r) => {
        const key = normalizeName(r.filename);
        const matches = allowedIndex.get(key);
        console.log(`🔎 IA "${r.filename}" -> key="${key}" | DB matches:`, matches);
        if (!matches) return [];
        // S'il y a plusieurs fichiers DB correspondant au même "nom propre", on les renvoie tous
        return matches.map((storedFilename) => ({
          filename: storedFilename, // ⚠️ on garde le vrai nom DB pour actions (aperçu/téléchargement)
          displayFilename: prettyName(storedFilename),
          email: r.email || "-",
          score: Number.isFinite(r.score) ? Math.round(r.score) : 0,
          skills_matched: r.skills_matched || [],
        }));
      });

      // ✅ FIX: dédoublonner par "filename" au cas d'uploads multiples identiques
      const dedup = Array.from(new Map(linked.map(x => [x.filename, x])).values());

      console.log(`✅ Résultats finaux liés à l'offre: ${dedup.length} / IA total: ${raw.length} (DB: ${applicationFiles.length})`);

      setIaResults(dedup);
      setPage2(1);
    } catch (e) {
      console.error("❌ Erreur lors de l'appel Flask:", e);
      console.error("❌ Détails erreur:", e?.response?.data);
      setIaError(e?.response?.data?.error || e.message);
      setIaResults([]);
    } finally {
      setIaLoading(false);
      console.log("🤖 handleFilterIA - Fin du traitement");
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
      // (petit fallback i18n)
      label: t("Compétences trouvées", { defaultValue: "Compétences trouvées" }),
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
    console.log("🔍 iaRowsFiltered useMemo - Début filtrage des résultats IA");
    console.log("🔍 iaResults avant filtrage:", iaResults);
    console.log("🔍 Filtres appliqués - search:", search, "scoreRange:", scoreRange);
    
    const q = search.trim().toLowerCase();
    const [min, max] = scoreRange;
    
    const filtered = iaResults.filter((r) => {
      const scoreOk = typeof r.score === "number" ? r.score >= min && r.score <= max : true;
      console.log(`🔍 ${r.filename} - Score ${r.score}: scoreOk = ${scoreOk} (range: ${min}-${max})`);
      
      if (!q) {
        console.log(`🔍 ${r.filename} - Pas de recherche textuelle, résultat: ${scoreOk}`);
        return scoreOk;
      }
      
      const hay = `${r.displayFilename} ${r.email} ${(r.skills_matched || []).join(" ")}`.toLowerCase();
      const textMatch = hay.includes(q);
      console.log(`🔍 ${r.filename} - Texte recherché "${q}" dans "${hay}": ${textMatch}`);
      
      const finalResult = scoreOk && textMatch;
      console.log(`🔍 ${r.filename} - Résultat final: ${finalResult}`);
      return finalResult;
    });
    
    console.log("🔍 Résultats après filtrage:", filtered);
    
    const sorted = filtered.sort((a, b) => {
      const scoreA = Number(a.score) || 0;
      const scoreB = Number(b.score) || 0;
      console.log(`📊 Tri: ${a.filename} (${scoreA}) vs ${b.filename} (${scoreB})`);
      return scoreB - scoreA;
    });
    
    console.log("📊 Résultats après tri par score:", sorted);
    return sorted;
  }, [iaResults, search, scoreRange]);

  const iaRows = useMemo(() => {
    console.log("📊 iaRows useMemo - Ajout des rankings");
    console.log("📊 iaRowsFiltered:", iaRowsFiltered);
    
    const result = iaRowsFiltered.map((r, idx) => {
      const rowWithRanking = { ranking: idx + 1, ...r };
      console.log(`📊 Ajout ranking ${idx + 1} pour ${r.filename}:`, rowWithRanking);
      return rowWithRanking;
    });
    
    console.log("📊 iaRows final:", result);
    return result;
  }, [iaRowsFiltered]);

  const paginatedIARows = useMemo(() => {
    console.log("📖 paginatedIARows - page2:", page2, "rowsPerPage2:", rowsPerPage2);
    const start = (page2 - 1) * rowsPerPage2;
    const result = iaRows.slice(start, start + rowsPerPage2);
    console.log("📖 paginatedIARows - start:", start, "result:", result);
    return result;
  }, [iaRows, page2]);

  const iaActions = [
    {
      tooltip: t("Aperçu"),
      icon: <PictureAsPdfIcon fontSize="small" color="primary" />,
      onClick: (row) => {
        console.log("👁️ Action Aperçu IA - row:", row);
        setPreviewFile(row.filename);
        setPreviewOpen(true);
        handleZoomReset();
      },
    },
    {
      tooltip: t("Télécharger CV"),
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        console.log("⬇️ Action Télécharger IA - row:", row);
        const url = `${FILE_BASE}/${row.filename}`;
        console.log("⬇️ URL de téléchargement IA:", url);
        window.open(url, "_blank");
      },
    },
    {
      tooltip: t("Envoyer Email"),
      icon: <EmailIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        console.log("📧 Action Email - row:", row);
        if (!row.email || row.email === "-") {
          console.log("📧 Pas d'email disponible");
          return;
        }
        const mailtoUrl = `mailto:${row.email}?subject=${encodeURIComponent(
          `${t("Candidature")} ${row.filename}`
        )}&body=${encodeURIComponent("Bonjour,")}`;
        console.log("📧 URL mailto:", mailtoUrl);
        window.open(mailtoUrl, "_blank");
      },
    },
  ];

  console.log("🎯 Rendu final - Compteurs:", {
    cvRowsLength: cvRows.length,
    iaResultsLength: iaResults.length,
    iaRowsFilteredLength: iaRowsFiltered.length,
    iaRowsLength: iaRows.length,
    paginatedIARowsLength: paginatedIARows.length
  });
    // nombre de CV issus de l'IA (après recherche + filtre score)
const iaCount = filtered && !iaLoading && !iaError ? iaRows.length : 0;


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
                  onChange={(e, p) => {
                    console.log("📖 Changement page CV:", p);
                    setPage1(p);
                  }}
                />
              </Box>
            </>
          )}
        </Paper>

        {/* Bloc 2 : Résultats IA */}
        <Paper sx={{ p: 3, borderRadius: 1.5, boxShadow: 2 }}>
       <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
  {t("Résultats du filtrage IA")}
  {filtered && !iaLoading && !iaError ? ` (${iaCount})` : ""}
</Typography>


          {!filtered ? (
            <Typography color="#64748b" fontStyle="italic" mb={2}>
              {t("Lance l'analyse via le bouton {{btn}} au-dessus.", { btn: t("Filtrer via IA"), defaultValue: "Lance l'analyse via le bouton {{btn}} au-dessus." })}
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
                    console.log("🔍 Changement recherche:", e.target.value);
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
                    onChange={(_, v) => {
                      console.log("📊 Changement range score:", v);
                      setScoreRange(v);
                    }}
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
                  onChange={(e, p) => {
                    console.log("📖 Changement page IA:", p);
                    setPage2(p);
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Modal d'aperçu (iframe PDF/HTML) + ZOOM */}
      <ModelComponent
        open={previewOpen}
        handleClose={() => { 
          console.log("❌ Fermeture modal aperçu");
          setPreviewOpen(false); 
          setPreviewFile(null); 
          handleZoomReset(); 
        }}
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
