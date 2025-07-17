import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, InputAdornment,
  IconButton, Grid, CircularProgress, Chip, MenuItem, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  deleteProject,
  fetchAllProjects,
} from '../redux/actions/projectActions';
import { clearProjectMessages } from '../redux/slices/projectSlice';

import TableComponent from '../components/Global/TableComponent';
import PaginationComponent from '../components/Global/PaginationComponent';
import { ButtonComponent } from '../components/Global/ButtonComponent';

import CreateProjectModal from '../components/projet/CreateProjectModal';

import DeleteProjectModal from '../components/projet/DeleteProjectModal';
import EditProjectModal from '../components/projet/EditProjectModal';
import ProjectSprintIndex from './Tache/ProjectSprintIndex';
import { toast } from 'react-toastify';
import { StyledPaper } from '../style/style';
import { AddCircleOutline } from '@mui/icons-material';
import { SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projet = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const CurrentUser = useSelector((state) => state.user.CurrentUser);
  const userRole = CurrentUser?.role || CurrentUser?.user?.role;
  const isAdminOrManager = ["Admin", "Manager"].includes(userRole);

  const { projects: allRows, loading, error: loadError, success } = useSelector(state => state.project);

  // States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [openAdd, setOpenAdd] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();

  // Fetch projects on mount
  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);


  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearProjectMessages());
    }
    if (loadError) {
      toast.error(loadError);
      dispatch(clearProjectMessages());
    }
  }, [success, loadError, dispatch]);

  // Filtrage & search
  const filteredRows = allRows.filter(row => {
    const searchMatch =
      row.title?.toLowerCase().includes(search.toLowerCase()) ||
      row.description?.toLowerCase().includes(search.toLowerCase());

    let statusMatch = true;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Completed') statusMatch = row.status?.toLowerCase().includes('completed');
      if (statusFilter === 'Ongoing') statusMatch = row.status?.toLowerCase().includes('ongoing');
      if (statusFilter === 'Planned') statusMatch = row.status?.toLowerCase().includes('planned');
    }
    return searchMatch && statusMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);
  const handleEditProject = (project) => {
  setSelectedProject(project);
  setOpenEdit(true);
};


  // Columns
  const columns = [
    { id: 'title', label: t('Titre'), align: 'left' },
    { id: 'description', label: t('Description'), align: 'left' },
    { id: 'duration', label: t('Durée'), align: 'center' },
    {
      id: 'file',
      label: t('Fichier'),
      align: 'center',
      render: row => row.file ? (
        <a
          href={`http://localhost:3000/uploads/projects/${row.file}`}
          target="_blank"
          rel="noopener noreferrer"
        >{row.file}</a>
      ) : "-"
    },
    {
      id: 'startDate',
      label: t('Début/Fin'),
      align: 'center',
      render: row => `${row.startDate?.substring(0, 10) || ''} - ${row.endDate?.substring(0, 10) || ''}`
    },
    {
      id: 'status',
      label: t('Statut'),
      align: 'center',
      render: row => (
        <Chip label={row.status} color="primary" variant="outlined" size="small" />
      )
    }
  ];

  const actions = [
    ...(isAdminOrManager
      ? [
        {
          icon: <DeleteIcon />,
          tooltip: t('Supprimer'),
          onClick: project => { setSelectedProject(project); setOpenDelete(true); }
        },
        {
          icon: <EditIcon sx={{ color: "#1976d2" }} />,
          tooltip: t('Modifier'),
          onClick: handleEditProject
        }
      ]
      : []
    ),
  {
    icon: <TimelineIcon sx={{ color: "#1273BA" }} />,
    tooltip: t('Sprints'),
    onClick: project => navigate(`/dashboard/tache/${project._id}`)
  }
];


  // Loader
  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Error
  if (loadError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" fontWeight={600}>{loadError}</Typography>
      </Box>
    );
  }
 const handleDeleteProject = (project) => {
  dispatch(deleteProject(project._id));
};



  // MAIN UI
  return (
    <>
      <StyledPaper sx={{ p: { xs: 2, md: 4 }, mt: 2 }}>
        {/* HEADER BOUTONS + SEARCH + FILTRE */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { md: 'row', xs: 'column' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 3,
            gap: { xs: 2, md: 0 }
          }}
        >
         <Grid container spacing={2} justifyContent="flex-end" alignItems="center" sx={{ width: 'fit-content' }}>
            {isAdminOrManager && (
              <Grid item>
                <ButtonComponent
                  onClick={() => setOpenAdd(true)}
                  text={t('Ajouter')}
                  icon={<AddCircleOutline />}
                  color="primary"
                />
              </Grid>
            )}
          </Grid>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label={t('Rechercher')}
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={t('Titre, Description...')}
              sx={{
                width: { xs: '100%', md: 340 },
                borderRadius: '50px',
                bgcolor: '#fff',
                boxShadow: theme.shadows[1]
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="small" color="primary"><SearchIcon /></IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: '16px', fontSize: '1.03rem' }
              }}
            />
            <TextField
              select
              label={t('Filtrer')}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              sx={{ minWidth: 160, borderRadius: 3, bgcolor: "#fff", boxShadow: theme.shadows[1] }}
            >
              <MenuItem value="All">{t('Tous')}</MenuItem>
              <MenuItem value="Completed">{t('Complété')}</MenuItem>
              <MenuItem value="Ongoing">{t('En cours')}</MenuItem>
              <MenuItem value="Planned">{t('Planifié')}</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* TABLE + PAGINATION */}
        <TableComponent columns={columns} rows={paginatedRows} actions={actions} />
        <Box mt={4} display="flex" justifyContent="center">
          <PaginationComponent count={totalPages} page={currentPage} onChange={handlePageChange} />
        </Box>
      </StyledPaper>
{openAdd && (
  <CreateProjectModal open={openAdd} handleClose={() => setOpenAdd(false)} />
)}
{openEdit && selectedProject && (
  <EditProjectModal
    open={openEdit}
    handleClose={() => setOpenEdit(false)}
    project={selectedProject}
  />
)}
{openDelete && selectedProject && (
  <DeleteProjectModal
    open={openDelete}
    handleClose={() => setOpenDelete(false)}
    project={selectedProject}
    onDelete={handleDeleteProject}
  />
)}
    </>
  );
};

export default Projet;
