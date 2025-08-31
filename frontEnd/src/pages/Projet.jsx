// src/pages/Projet.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, InputAdornment, IconButton, CircularProgress, TextField,
  useTheme, Divider, Select, MenuItem, Chip, Link, Tooltip
} from "@mui/material";
import { AddCircleOutline, Search } from "@mui/icons-material";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PaginationComponent from "../components/Global/PaginationComponent";
import CreateProjectModal from "../components/projet/CreateProjectModal";
import DeleteProjectModal from "../components/projet/DeleteProjectModal";
import EditProjectModal from "../components/projet/EditProjectModal";
import ProjectDetailModal from "../components/projet/ProjectDetailModal";
import { fetchAllProjects, deleteProject, updateProject } from "../redux/actions/projectActions";
import { clearProjectMessages } from "../redux/slices/projectSlice";
import { StyledPaper } from "../style/style";
import { ButtonComponent } from "../components/Global/ButtonComponent";
import TableComponent from "../components/Global/TableComponent";

const STATUS = [
  { key: "All", label: "All" },
  { key: "Ongoing", label: "Ongoing" },
  { key: "Completed", label: "Completed" },
];

// couleurs pour statuts
const statusColor = (value) => {
  const v = (value || "").toString().toLowerCase();
  if (["completed", "completé", "complete", "terminé", "termine"].includes(v))
    return { bg: "#ffe4e4", color: "#e04747" }; // rouge
  if (["ongoing", "en cours"].includes(v))
    return { bg: "#e4faeb", color: "#22a77c" }; // vert
  if (["planned", "planifié", "planifie"].includes(v))
    return { bg: "#e3f2fd", color: "#1976d2" };
  return { bg: "#f3f4f6", color: "#607d8b" };
};

// calcul statut dynamique
const computeProjectStatus = (p) => {
  const now = new Date();
  const start = p.startDate ? new Date(p.startDate) : null;
  const end = p.endDate ? new Date(p.endDate) : null;
  if (p.completedAt || p.progress === 100) return "Completed";
  if (end && now > end) return "Completed";
  if (start && now >= start && (!end || now <= end)) return "Ongoing";
  return "Planned";
};

const Projet = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const CurrentUser = useSelector((state) => state.user.CurrentUser);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;
  const isAdminOrManager = ["Admin", "Manager"].includes(userRole);

  const { projects: allRows = [], loading, error: loadError, success } = useSelector((state) => state.project);

  // state filtres + pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // state modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // détails
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDetailProject, setSelectedDetailProject] = useState(null);

  useEffect(() => { dispatch(fetchAllProjects()); }, [dispatch]);
  useEffect(() => {
    if (success) { toast.success(success); dispatch(clearProjectMessages()); }
    if (loadError) { toast.error(loadError); dispatch(clearProjectMessages()); }
  }, [success, loadError, dispatch]);

  // filtre recherche & statut
  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (allRows || []).filter((row) => {
      const searchMatch =
        !s ||
        row.title?.toLowerCase().includes(s) ||
        row.description?.toLowerCase().includes(s);
      const statusMatch =
        statusFilter === "All" ||
        (row.status || "").toLowerCase() === statusFilter.toLowerCase();
      return searchMatch && statusMatch;
    });
  }, [allRows, search, statusFilter]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage) || 1;
  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage]
  );

  // 🔄 update status si différent
  useEffect(() => {
    (async () => {
      for (const p of paginatedRows) {
        const computed = computeProjectStatus(p);
        if (computed && p.status !== computed) {
          await dispatch(updateProject({ id: p._id, updateData: { status: computed } }));
        }
      }
    })();
  }, [paginatedRows, dispatch]);

  // rows pour table
  const tableRows = useMemo(() => paginatedRows.map(p => ({ ...p, id: p._id })), [paginatedRows]);

  // colonnes
  const columns = useMemo(() => ([
    {
      id: "title",
      label: t("Titre"),
      align: "left",
      render: (row) => (
        <Typography fontWeight={700} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {row.title || "-"}
        </Typography>
      ),
    },
 
    {
      id: "status",
      label: t("Statut"),
      render: (row) => {
        const c = statusColor(row.status);
        return (
          <Chip
            label={t(row.status || "—")}
            size="small"
            sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, border: `1px solid ${c.color}20` }}
          />
        );
      },
    },
    {
      id: "duration",
      label: t("Durée"),
      render: (row) => <Typography>{row.duration || t("Non définie")}</Typography>,
    },
    {
      id: "sprints",
      label: t("Sprints"),
      render: (row) => <Typography fontWeight={700}>{row.sprints?.length || 0}</Typography>,
    },
    {
      id: "teams",
      label: t("Équipes"),
      render: (row) => <Typography fontWeight={700}>{row.teams?.length || 0}</Typography>,
    },
    {
      id: "file",
      label: t("Fichier"),
      align: "left",
      render: (row) =>
        row.file ? (
          <Link
            href={`http://localhost:3000/uploads/projects/${row.file}`}
            target="_blank"
            underline="hover"
            sx={{ display: "inline-flex", alignItems: "center", gap: .5, fontWeight: 600 }}
          >
            {t("Fichier de description")}
            <DownloadIcon sx={{ fontSize: 18 }} />
          </Link>
        ) : (
          <Typography color="text.disabled">—</Typography>
        ),
    },
  ]), [t]);

  // actions
  const baseActions = [
    {
      tooltip: t("Voir les tâches"),
      icon: <TimelineIcon sx={{ color: "#0ea5e9" }} />,
      onClick: (row) => navigate(`/dashboard/tache/${row._id}`),
    },
    {
      tooltip: t("Détails"),
      icon: <InfoOutlinedIcon sx={{ color: "#2563eb" }} />,
      onClick: (row) => { setSelectedDetailProject(row); setOpenDetail(true); },
    },
  ];
  const adminActions = isAdminOrManager
    ? [
        {
          tooltip: t("Modifier"),
          icon: <EditIcon sx={{ color: "#16a34a" }} />,
          onClick: (row) => { setSelectedProject(row); setOpenEdit(true); },
        },
        {
          tooltip: t("Supprimer"),
          icon: <DeleteIcon sx={{ color: "#dc2626" }} />,
          onClick: (row) => { setSelectedProject(row); setOpenDelete(true); },
        },
      ]
    : [];

  if (loading)
    return <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress color="primary" /></Box>;
  if (loadError)
    return <Box sx={{ p: 4 }}><Typography color="error" fontWeight={600}>{loadError}</Typography></Box>;

  return (
    <>
      {/* bouton ajouter */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {isAdminOrManager && (
          <ButtonComponent
            onClick={() => setOpenAdd(true)}
            icon={<AddCircleOutline />}
            text={t("Ajouter un nouveau Projet")}
          />
        )}
      </Box>

      <StyledPaper
        sx={{
          p: { xs: 2, md: 4 },
          mt: 2,
          borderRadius: 1.5,
          boxShadow: theme.shadows[2],
          width: "98%",
          maxWidth: "1680px",
          bgcolor: "#f7fafd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* filtres + recherche */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mr: 2 }}>
              {t("Filtrer par statut :")}
            </Typography>
            <Select
              size="small"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              sx={{ minWidth: 140, borderRadius: 2, background: "#fff" }}
            >
              {STATUS.map(st => (
                <MenuItem key={st.key} value={st.key}>{st.label}</MenuItem>
              ))}
            </Select>
          </Box>

          <TextField
            label={t("Rechercher")}
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={t("Titre, Description...")}
            sx={{
              width: { xs: "100%", md: 360 },
              borderRadius: "50px",
              bgcolor: "#fff",
              boxShadow: 1,
              minWidth: 200,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small" color="primary"><Search /></IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "16px", fontSize: "1.03rem" }
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* tableau */}
        <Box sx={{ width: "100%" }}>
          <TableComponent
            rows={tableRows}
            columns={columns}
            actions={[...baseActions, ...adminActions]}
          />
        </Box>

        {/* pagination */}
        {totalPages > 1 && (
          <Box mt={4} display="flex" justifyContent="center">
            <PaginationComponent
              count={totalPages}
              page={currentPage}
              onChange={(_, v) => setCurrentPage(v)}
            />
          </Box>
        )}

        {/* modals */}
        {openAdd && <CreateProjectModal open={openAdd} handleClose={() => setOpenAdd(false)} />}
        {openEdit && selectedProject && (
          <EditProjectModal open={openEdit} handleClose={() => setOpenEdit(false)} project={selectedProject} />
        )}
        {openDelete && selectedProject && (
          <DeleteProjectModal
            open={openDelete}
            handleClose={() => setOpenDelete(false)}
            project={selectedProject}
            onDelete={() => dispatch(deleteProject(selectedProject._id))}
          />
        )}
        {openDetail && selectedDetailProject && (
          <ProjectDetailModal
            open={openDetail}
            handleClose={() => setOpenDetail(false)}
            project={selectedDetailProject}
            userRole={userRole}
            onEdit={() => { setSelectedProject(selectedDetailProject); setOpenEdit(true); setOpenDetail(false); }}
            onDelete={() => { setSelectedProject(selectedDetailProject); setOpenDelete(true); setOpenDetail(false); }}
          />
        )}
      </StyledPaper>
    </>
  );
};

export default Projet;
