// src/pages/Recrutement/ApplicationList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, Divider, Stack } from "@mui/material";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { fetchApplicationsByJobOffre } from "../../redux/actions/applicationAction";

const FILE_BASE = "http://localhost:3000/uploads/applications";
const FLASK_URL = "http://localhost:5000/match_skills";

export default function ApplicationListRHIA() {
  const dispatch = useDispatch();
  const { jobOffreId } = useParams();
  const { state } = useLocation();
  const currentOffer = state?.offer || null;

  const { list: applications = [], loading, error } = useSelector((s) => s.application);

  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [filtered, setFiltered] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaError, setIaError] = useState(null);
  const [iaResults, setIaResults] = useState([]);

  useEffect(() => {
    if (jobOffreId) {
      console.log("[UI] fetching applications for offer:", jobOffreId);
      dispatch(fetchApplicationsByJobOffre(jobOffreId));
    }
  }, [jobOffreId, dispatch]);

  // --- Table 1 (CV reçus)
  const cvColumns = [{ id: "filename", label: "Nom du fichier" }];
  const rowsPerPage1 = 8;

  const cvRows = useMemo(
    () => applications.map((a) => ({ _id: a._id, filename: a.cvFile || "-" })),
    [applications]
  );

  const paginatedCVRows = useMemo(() => {
    const start = (page1 - 1) * rowsPerPage1;
    return cvRows.slice(start, start + rowsPerPage1);
  }, [cvRows, page1]);

  const cvActions = [
    {
      tooltip: "Télécharger",
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: (row) => window.open(`${FILE_BASE}/${row.filename}`, "_blank"),
    },
  ];

  // --- Filtrage IA (Flask) + limite aux fichiers de l'offre
  const handleFilterIA = async () => {
    const requirements =
      currentOffer?.requirements ||
      applications?.[0]?.jobOffre?.requirements ||
      "";

    if (!requirements) {
      alert("Aucun requirements trouvé pour cette offre.");
      return;
    }

    const allowedSet = new Set(applications.map((a) => a?.cvFile).filter(Boolean));
    const allowed_filenames = Array.from(allowedSet);

    console.groupCollapsed("%c[IA] Lancement filtrage", "color:#1976d2;font-weight:bold");
    console.log("[IA] Offer ID:", jobOffreId);
    console.log("[IA] Offer title:", currentOffer?.title);
    console.log("[IA] Requirements (raw):", requirements);
    console.log("[IA] Fichiers autorisés (liés à l'offre) — count:", allowed_filenames.length);
    console.table(allowed_filenames.map((f) => ({ filename: f })));
    console.groupEnd();

    setFiltered(true);
    setIaLoading(true);
    setIaError(null);

    try {
      console.groupCollapsed("%c[IA] POST -> Flask /match_skills (payload)", "color:#6b7280");
      console.log({ requirements, allowed_filenames });
      console.groupEnd();

      const res = await axios.post(FLASK_URL, { requirements, allowed_filenames });

      console.groupCollapsed("%c[IA] Réponse Flask brute", "color:#6b7280");
      console.log(res.status, res.statusText);
      console.table((Array.isArray(res.data) ? res.data : []).map((r) => ({
        filename: r.filename,
        email: r.email || "-",
        score: r.score,
        skills_count: (r.skills_matched || []).length,
        error: r.error || "",
      })));
      console.groupEnd();

      const raw = Array.isArray(res.data) ? res.data : [];
      const onlyLinked = raw.filter((it) => allowedSet.has(it.filename));

      // Log de contrôle: voir s'il manque des fichiers
      const missing = allowed_filenames.filter((f) => !onlyLinked.some((x) => x.filename === f));
      if (missing.length) {
        console.warn("[IA] Ces fichiers liés à l'offre n'apparaissent pas dans la réponse Flask:", missing);
      }

      // Log détaillé par fichier (pour traquer celui qui ne sort rien)
      onlyLinked.forEach((it) => {
        const hasText = !(it.error) && (typeof it.score === "number"); // proxy, on n'a pas la longueur mais on peut lire score/error
        const info = {
          filename: it.filename,
          email: it.email || "-",
          score: it.score,
          skills: (it.skills_matched || []).join(", "),
          error: it.error || "-",
        };
        if (!hasText || it.score === 0) {
          console.warn("[IA][WARN] Pas d'infos/score 0 pour ce CV:", info);
        } else {
          console.log("[IA] OK:", info);
        }
      });

      setIaResults(onlyLinked);
    } catch (e) {
      console.error("[IA][ERROR] Flask call failed:", e);
      setIaError(e?.response?.data?.error || e.message);
      setIaResults([]);
    } finally {
      setIaLoading(false);
    }
  };

  // --- Table 2 (résultat IA)
  const iaColumns = [
    { id: "ranking", label: "Rang", render: (row) => <b>{row.ranking}</b> },
    { id: "filename", label: "CV" },
    { id: "email", label: "Email" },
    { id: "poste", label: "Poste" },
    { id: "score", label: "Score IA" },
    {
      id: "skills_matched",
      label: "Compétences trouvées",
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
  const rowsPerPage2 = 10;

  const iaRows = useMemo(() => {
    const sorted = [...iaResults].sort(
      (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
    );
    return sorted.map((r, idx) => ({
      ranking: idx + 1,
      filename: r.filename,
      email: r.email || "-",
      poste: currentOffer?.title || "-",
      score: r.score ?? "-",
      skills_matched: r.skills_matched || [],
    }));
  }, [iaResults, currentOffer]);

  const paginatedIARows = useMemo(() => {
    const start = (page2 - 1) * rowsPerPage2;
    return iaRows.slice(start, start + rowsPerPage2);
  }, [iaRows, page2]);

  const iaActions = [
    {
      tooltip: "Télécharger CV",
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: (row) => window.open(`${FILE_BASE}/${row.filename}`, "_blank"),
    },
    {
      tooltip: "Envoyer Email",
      icon: <EmailIcon color="primary" fontSize="small" />,
      onClick: (row) => {
        if (!row.email || row.email === "-") return;
        window.open(
          `mailto:${row.email}?subject=${encodeURIComponent(
            `Candidature ${row.filename}`
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
          Candidatures – Filtrage IA
        </Typography>

        {/* Bloc 1 : Table des CV */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="h6" fontWeight={700} color="primary">
              CV Reçus ({applications.length})
            </Typography>
            <ButtonComponent
              text={iaLoading ? "Analyse..." : "Filtrer via IA"}
              icon={<FilterAltIcon />}
              onClick={handleFilterIA}
              color="#1976d2"
              disabled={iaLoading}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Typography>Chargement...</Typography>
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

        {/* Bloc 2 : Résultat IA */}
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
          <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
            Résultats du filtrage IA
          </Typography>

          {!filtered ? (
            <Typography color="#64748b" fontStyle="italic" mb={2}>
              Cliquez sur <b>Filtrer via IA</b> pour lancer l’analyse automatique.
            </Typography>
          ) : iaLoading ? (
            <Typography>Analyse en cours...</Typography>
          ) : iaError ? (
            <Typography color="error">{iaError}</Typography>
          ) : (
            <>
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
    </Box>
  );
}
