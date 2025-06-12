import * as React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Box, Card, Typography, Divider, TextField, InputAdornment,
  IconButton, Grid, CircularProgress, Chip, Avatar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  AddCircleOutline,
  CloudDownload,
  FileUpload
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { FetchEmployesAction } from '../redux/actions/employeAction';
import TableComponent from '../components/Global/TableComponent';
import PaginationComponent from '../components/Global/PaginationComponent';
import { ButtonComponent } from '../components/Global/ButtonComponent';
import AddEmployeModal from '../components/Employe/AddEmploye';
import DeleteEmploye from '../components/Employe/DeleteEmploye';
import ExportModal from '../components/ExportModal';

const Employe = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // 1. Récupérer la liste depuis Redux
  const { list: rows, loading, error: loadError } = useSelector(state => state.employe);

 
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const { token } = JSON.parse(raw);
        if (token?.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
        }
      } catch (e) {
        console.error('Parsing user/token failed:', e);
      }
    }
    dispatch(FetchEmployesAction());
  }, [dispatch]);

  // 3. Pour les chips de domaine
  const domainColorMap = {};
  const availableColors = ['primary','secondary','success','warning','info','error'];
  let colorIndex = 0;
  const getDomainColor = domain => {
    if (!domainColorMap[domain]) {
      domainColorMap[domain] = availableColors[colorIndex % availableColors.length];
      colorIndex++;
    }
    return domainColorMap[domain];
  };

  // 4. Définition des colonnes, ajout de la photo en première colonne
  const columns = [
    {
      id: 'image',
      
      align: 'center',
      render: row => (
        <Avatar
          src={
            row.image?.startsWith('http')
              ? `${row.image}?t=${Date.now()}`
              : `http://localhost:3000/uploads/users/${encodeURIComponent(row.image)}?t=${Date.now()}`
          }
          alt={row.fullName}
          sx={{ width: 40, height: 40, margin: '0 auto' }}
        />
      )
    },
    { id: 'fullName', label: 'Nom Complet', align: 'left' },
    { id: 'email',    label: 'Email',        align: 'left' },
    {
      id: 'domain',
      label: 'Domaine',
      align: 'center',
      render: row => (
        <Chip
          label={row.domain}
          color={getDomainColor(row.domain)}
          variant="outlined"
          size="small"
        />
      )
    },
    { id: 'role', label: 'Rôle', align: 'center' },
  ];

  // 5. Actions & modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState(null);

  const handleOpenDelete = emp => {
    setSelectedEmploye(emp);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setSelectedEmploye(null);
    setOpenDelete(false);
  };
  const handleConfirmDelete = () => {
    // dispatcher action delete ici si besoin
    handleCloseDelete();
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: t('Supprimer'), onClick: handleOpenDelete }
  ];

  // 6. Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil((rows?.length || 0) / itemsPerPage);
  const paginatedRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);

  // 7. Recherche (locale)
  const [search, setSearch] = useState('');
  const filteredRows = paginatedRows.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  // 8. Affichage
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{loadError}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p:3, bgcolor:'#F3FAFF', minHeight:'100vh' }}>
        <Card sx={{ p:4, borderRadius:3, boxShadow:'0 8px 32px rgba(0,0,0,0.1)', bgcolor:'white' }}>
          <Typography variant="h4" fontWeight="bold" color="#1976d2" mb={2}>
            {t('Gestion des Comptes Utilisateurs')}
          </Typography>
          <Divider sx={{ mb:3 }} />

          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
            <Grid container spacing={2} justifyContent="flex-end" alignItems="center" sx={{ width:'fit-content' }}>
              <Grid item>
                <ButtonComponent onClick={() => setOpenAdd(true)} text={t('Ajouter')} icon={<AddCircleOutline />} />
              </Grid>
              <Grid item>
                <ButtonComponent onClick={() => setOpenExport(true)} text={t('Export')} icon={<CloudDownload />} />
              </Grid>
              <Grid item>
                <ButtonComponent text={t('Import')} icon={<FileUpload />} />
              </Grid>
            </Grid>
            <TextField
              label={t('Rechercher')}
              variant="outlined"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ borderRadius:'50px', width:'50%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="small"><SearchIcon/></IconButton>
                  </InputAdornment>
                ),
                sx:{ borderRadius:'20px', width:'100%' }
              }}
            />
          </Box>

          <TableComponent columns={columns} rows={filteredRows} actions={actions} />

          <Box mt={4} display="flex" justifyContent="center">
            <PaginationComponent count={totalPages} page={currentPage} onChange={handlePageChange} />
          </Box>
        </Card>
      </Box>

      <AddEmployeModal
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        onSubmit={employe => {
          console.log("Nouvel employé :", employe);
          // dispatcher action add ici
        }}
      />

      <DeleteEmploye
        open={openDelete}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
        employeName={selectedEmploye?.fullName}
        cancelText={t('Annuler')}
        confirmText={t('Supprimer')}
      />

      <ExportModal
        open={openExport}
        onClose={() => setOpenExport(false)}
        entity="employes"
      />
    </>
  );
};

export default Employe;
