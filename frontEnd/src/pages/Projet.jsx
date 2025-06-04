import * as React from 'react';
import { useState } from 'react';
import {
  Box, Card, Typography, Divider, Grid,
  TextField, InputAdornment, IconButton, Chip,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  AddCircleOutline, Visibility, Edit, Delete
} from '@mui/icons-material';
import { ButtonComponent } from '../components/Global/ButtonComponent';
import PaginationComponent from '../components/Global/PaginationComponent';
import TableComponent from '../components/Global/TableComponent';
import { useTranslation } from 'react-i18next';
import ProgressChart from '../components/projet/ProgressChart';
import EditProjectModal from '../components/projet/EditProjectModal';
import DeleteProjectModal from '../components/projet/DeleteProjectModal';
import CreateProjectModal from '../components/projet/CreateProjectModal';

const Projet = () => {
const { t } = useTranslation();
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [projectToDelete, setProjectToDelete] = useState(null);
const [createModalOpen, setCreateModalOpen] = useState(false);
const handleDeleteConfirmed = (project) => {
  setProjects(prev => prev.filter(p => p.id !== project.id));
};
const handleCreateProject = (newProject) => {
  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  setProjects(prev => [...prev, { id: newId, ...newProject }]);
};


  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Tech Innovators',
      description: 'Revolutionizing the tech world',
      duration: '5 months',
      start: '2023-01-15',
      end: '2023-05-15',
      status: '75% complete'
    },
    {
      id: 2,
      title: 'Green Energy Initiative',
      description: 'Promoting a healthier planet',
      duration: '6 months',
      start: '2023-02-02',
      end: '2023-08-02',
      status: '60% complete'
    },
    {
      id: 3,
      title: 'Blue Energy Initiative',
      description: 'Sustainable ocean energy',
      duration: '6 months',
      start: '2023-02-02',
      end: '2023-08-02',
      status: '60% complete'
    }
  ]);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleSave = (updatedProject) => {
    setProjects(prev =>
      prev.map(p => (p.id === updatedProject.id ? updatedProject : p))
    );
    setEditModalOpen(false);
  };



  const columns = [
    { id: 'title', label: 'Title', align: 'left' },
    { id: 'description', label: 'Description', align: 'left' },
    { id: 'duration', label: 'Duration', align: 'center' },
    {
      id: 'start',
      label: 'Start/End',
      align: 'center',
      render: row => `${row.start} - ${row.end}`
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: row => (
        <Chip label={row.status} color="primary" variant="outlined" size="small" />
      )
    }
  ];

  const actions = [
    {
      icon: <Visibility sx={{ color: '#1976d2' }} />,
      tooltip: 'View Tasks',
      onClick: (project) => console.log('Viewing tasks for:', project.title)
    },
    {
      icon: <Edit sx={{ color: '#ff9800' }} />,
      tooltip: 'Edit Project',
      onClick: handleEditClick
    },
    {
      icon: <Delete sx={{ color: '#f44336' }} />,
      tooltip: 'Delete Project',
      onClick: (project) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    }
    }
    
  ];

  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = statusFilter === 'All'
    ? projects
    : projects.filter(p => {
        const status = p.status.toLowerCase();
        return (
          (statusFilter === 'Completed' && status.includes('75')) ||
          (statusFilter === 'Ongoing' && status.includes('60')) ||
          (statusFilter === 'Upcoming' && status.includes('30'))
        );
      });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1976d2">
            {t('All Projects')}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderRadius: 3 }}>
          <TextField
            label={t('Search here')}
            variant="outlined"
            sx={{
              width: '50%',
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small"><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
          />

          <Grid container spacing={2} justifyContent="flex-end" sx={{ width: 'fit-content' }}>
            <Grid item>
              <TextField
                select
                label={t('Filter by')}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ minWidth: 150, borderRadius: 3 }}
              >
                <MenuItem value="All">{t('All')}</MenuItem>
                <MenuItem value="Completed">{t('Completed')}</MenuItem>
                <MenuItem value="Ongoing">{t('Ongoing')}</MenuItem>
                <MenuItem value="Upcoming">{t('Upcoming')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
            <ButtonComponent
                     text={t('Add')}
                     icon={<AddCircleOutline />}
                     onClick={() => setCreateModalOpen(true)}
            />
            </Grid>
          </Grid>
        </Box>

        <TableComponent columns={columns} rows={paginatedProjects} actions={actions} />

        <Box mt={4} display="flex" justifyContent="center">
          <PaginationComponent count={totalPages} page={currentPage} onChange={handlePageChange} />
        </Box>
      </Card>

      {selectedProject && (
        <EditProjectModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          project={selectedProject}
          onSave={handleSave}
        />
      
      )}
      {projectToDelete && (
  <DeleteProjectModal
    open={deleteModalOpen}
    handleClose={() => setDeleteModalOpen(false)}
    project={projectToDelete}
    onDelete={handleDeleteConfirmed}
  />
  
)}
<CreateProjectModal
  open={createModalOpen}
  handleClose={() => setCreateModalOpen(false)}
  onCreate={handleCreateProject}
/>




    </Box>
  );
};

export default Projet;
