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

import { FetchEmployesBySearchAction,deleteEmployeAction,ImportEmployesExcel } from '../redux/actions/employeAction';
import TableComponent from '../components/Global/TableComponent';
import PaginationComponent from '../components/Global/PaginationComponent';
import { ButtonComponent } from '../components/Global/ButtonComponent';
import AddEmployeModal from '../components/Employe/AddEmploye';
import DeleteEmploye from '../components/Employe/DeleteEmploye';
import ExportModal from '../components/ExportModal';
import { toast } from 'react-toastify';

const Employe = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { list: rows, loading, error: loadError } = useSelector(state => state.employe);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fileInputRef = React.useRef();

  // Token header setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Appel initial : fetch tous les employés
  useEffect(() => {
    dispatch(FetchEmployesBySearchAction(''));
  }, [dispatch]);

  // Recherche dynamique
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(FetchEmployesBySearchAction(search));
    }, 500); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

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
    { id: 'fullName', label: t('Nom Complet'), align: 'left' },
    { id: 'email',    label: t('Email'),        align: 'left' },
    {
      id: 'domain',
      label: t('Domaine'),
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
    { id: 'role', label: t('Rôle'), align: 'center' },
  ];

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
  const handleConfirmDelete = async () => {
    if (!selectedEmploye?._id) return;
    try {
      await dispatch(deleteEmployeAction(selectedEmploye._id)).unwrap();
      toast.success('Employé supprimé !');
      handleCloseDelete();
    } catch (err) {
      toast.error('Erreur lors de la suppression : ' + err);
    }
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: t('Supprimer'), onClick: handleOpenDelete }
  ];
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    try {
      await dispatch(ImportEmployesExcel(file)).unwrap();
      toast.success('Import terminé avec succès !');
    } catch (err) {
      toast.error('Erreur lors de l’import : ' + err);
    } finally {
      event.target.value = ""; // reset pour permettre un nouvel import
    }
  };
  
  const totalPages = Math.ceil((rows?.length || 0) / itemsPerPage);
  const paginatedRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);

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
              <ButtonComponent
                      text={t('Import')}
                      icon={<FileUpload />}
                      onClick={handleImportClick}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".xlsx, .xls"
                      onChange={handleImportFile}
                    />

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

          <TableComponent columns={columns} rows={paginatedRows} actions={actions} />

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
        }}
      />

{openDelete && selectedEmploye && (
        <DeleteEmploye
          open={true}
          handleClose={handleCloseDelete}
          handleConfirm={handleConfirmDelete}
          employeName={selectedEmploye.fullName || ""}
          cancelText={t('Annuler')}
          confirmText={t('Supprimer')}
        />
      )}




      <ExportModal
        open={openExport}
        onClose={() => setOpenExport(false)}
        entity="employes"
      />
    </>
  );
};

export default Employe;
