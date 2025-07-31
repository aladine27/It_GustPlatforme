import React, { useEffect, useState } from "react";
import {
  Box, Typography, InputAdornment, IconButton, Grid, CircularProgress, TextField, Button,
  useTheme, Divider, Select, MenuItem
} from "@mui/material";
import { AddCircleOutline, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PaginationComponent from "../components/Global/PaginationComponent";
import CreateProjectModal from "../components/projet/CreateProjectModal";
import DeleteProjectModal from "../components/projet/DeleteProjectModal";
import EditProjectModal from "../components/projet/EditProjectModal";
import ProjectDetailModal from "../components/projet/ProjectDetailModal";
import ProjectCard from "../components/projet/ProjectCard";
import { deleteProject, fetchAllProjects } from "../redux/actions/projectActions";
import { clearProjectMessages } from "../redux/slices/projectSlice";
import staticProjectImage from "../assets/project_static.jpg";
import { StyledPaper } from "../style/style";
import { ButtonComponent } from "../components/Global/ButtonComponent";

const STATUS = [
  { key: "All", label: "All" },
  { key: "Ongoing", label: "Ongoing" },
  { key: "Completed", label: "Completed" },
];

const Projet = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const CurrentUser = useSelector((state) => state.user.CurrentUser);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;
  const isAdminOrManager = ["Admin", "Manager"].includes(userRole);

  const { projects: allRows, loading, error: loadError, success } = useSelector((state) => state.project);

  // Filtres & pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Modal détail projet
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDetailProject, setSelectedDetailProject] = useState(null);

  useEffect(() => { dispatch(fetchAllProjects()); }, [dispatch]);
  useEffect(() => {
    if (success) { toast.success(success); dispatch(clearProjectMessages()); }
    if (loadError) { toast.error(loadError); dispatch(clearProjectMessages()); }
  }, [success, loadError, dispatch]);

  // Filtrage
  const filteredRows = allRows.filter((row) => {
    const searchMatch =
      row.title?.toLowerCase().includes(search.toLowerCase()) ||
      row.description?.toLowerCase().includes(search.toLowerCase());
    let statusMatch = true;
    if (statusFilter !== "All") {
      statusMatch = row.status?.toLowerCase() === statusFilter.toLowerCase();
    }
    return searchMatch && statusMatch;
  });
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Loader & Error
  if (loading)
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  if (loadError)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" fontWeight={600}>{loadError}</Typography>
      </Box>
    );

  return (
    <>
      {/* === BOUTON AJOUTER EN HAUT À DROITE (HORS PAPER) === */}
 <Box sx={{display: "flex", justifyContent: "flex-end" }}>
          {isAdminOrManager && (
            <ButtonComponent
              onClick={() => setOpenAdd(true)}
             icon={<AddCircleOutline />}
              text={t("Ajouter un nouveau Projet")}
             />)}
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
       
        {/* === HEADER FILTRE & RECHERCHE === */}
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
          {/* Filtres à gauche */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mr: 2 }}>
              {t("Filtrer par statut :")}
            </Typography>
            {/* MENU DEROULANT */}
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
    
          {/* Barre de recherche à droite */}
          <TextField
            label={t('Rechercher')}
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={t('Titre, Description...')}
            sx={{
              width: { xs: '100%', md: 320 },
              borderRadius: '50px',
              bgcolor: '#fff',
              boxShadow: 1,
              minWidth: 200,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small" color="primary"><Search /></IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: '16px', fontSize: '1.03rem' }
            }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Cards grid */}
        <Box sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {paginatedRows.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ py: 7, textAlign: "center" }}>
                  <Typography color="text.secondary" fontWeight={500} fontSize={19}>
                    Aucun projet trouvé
                  </Typography>
                </Box>
              </Grid>
            ) : (
              paginatedRows.map((project) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={project._id} sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <ProjectCard
                    project={project}
                    staticProjectImage={staticProjectImage}
                    navigate={navigate}
                    isAdminOrManager={isAdminOrManager}
                    setSelectedProject={setSelectedProject}
                    setOpenEdit={setOpenEdit}
                    setOpenDelete={setOpenDelete}
                    setOpenDetail={setOpenDetail}
                    setSelectedDetailProject={setSelectedDetailProject}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box mt={4} display="flex" justifyContent="center">
            <PaginationComponent count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} />
          </Box>
        )}

        {/* Modals */}
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

        {/* MODAL DE DETAIL */}
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
