import * as React from 'react';
import { useState } from 'react';
import {
  Box, Card, Typography, Divider, Grid,
  TextField, InputAdornment, IconButton, Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  AddCircleOutline, CloudDownload, FileUpload, Visibility
} from '@mui/icons-material';
import ButtonComponent from '../components/Global/ButtonComponent';
import PaginationComponent from '../components/Global/PaginationComponent';
import TableComponent from '../components/Global/TableComponent';
import { useTranslation } from 'react-i18next';

const Projet = () => {
  const { t } = useTranslation();

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Tech Innovators',
      description: 'Revolutionizing the tech world',
      duration: '5 months',
      start: 'Jan 15, 2023',
      end: 'May 15, 2023',
      status: '75% complete'
    },
    {
      id: 2,
      title: 'Green Energy Initiative',
      description: 'Promoting a healthier planet',
      duration: '6 months',
      start: 'Feb 02, 2023',
      end: 'Aug 02, 2023',
      status: '60% complete'
    },
    // Ajoute ici les autres projets...
  ]);

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
      icon: <Visibility />,
      tooltip: 'View Tasks',
      onClick: (project) => {
        console.log('Viewing tasks for:', project.title);
      }
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1976d2">
            {t('All Projects')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            label={t('Search here')}
            variant="outlined"
            sx={{ width: '50%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small"><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
          />

          <Grid container spacing={2} justifyContent="flex-end" sx={{ width: 'fit-content' }}>
            <Grid >
              <ButtonComponent text={t('Add')} icon={<AddCircleOutline />} />
            </Grid>
            <Grid >
              <ButtonComponent text={t('Export')} icon={<CloudDownload />} />
            </Grid>
            <Grid >
              <ButtonComponent text={t('Import')} icon={<FileUpload />} />
            </Grid>
          </Grid>
        </Box>

        <TableComponent columns={columns} rows={paginatedProjects} actions={actions} />

        <Box mt={4} display="flex" justifyContent="center">
          <PaginationComponent count={totalPages} page={currentPage} onChange={handlePageChange} />
        </Box>
      </Card>
    </Box>
  );
};

export default Projet;
