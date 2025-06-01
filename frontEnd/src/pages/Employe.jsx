import * as React from 'react';
import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Card, Typography, Box, Avatar, Chip, IconButton, Divider,
  TextField, InputAdornment, Grid
} from '@mui/material';
import {
  Delete as DeleteIcon, Search as SearchIcon,
  AddCircleOutline, CloudDownload, FileUpload
} from '@mui/icons-material';

import ModelComponent from '../components/Global/ModelComponent';
import AddEmploye from '../components/Employe/AddEmploye';
import DeleteEmploye from '../components/Employe/DeleteEmploye';
import ExportModal from '../components/ExportModal';
import PaginationComponent from '../components/Global/PaginationComponent';
import { useTranslation } from 'react-i18next';
import TableComponent from '../components/Global/TableComponent';
import { ButtonComponent } from '../components/Global/ButtonComponent';

const Employe = () => {
  const { t } = useTranslation();

  // pour les chips de domaine
  const domainColorMap = {};
  const availableColors = ['primary','secondary','success','warning','info','error'];
  let colorIndex = 0;
  const getDomainColor = (domain) => {
    if (!domainColorMap[domain]) {
      domainColorMap[domain] = availableColors[colorIndex % availableColors.length];
      colorIndex++;
    }
    return domainColorMap[domain];
  };

  // données initiales
  // nouveaux attributs selon UML : fullName, Email, password, adress, phoneNumbre, domain, image, role
  const [rows, setRows] = useState([
    {
      id: 1,
      fullName: 'Ahmed Bennani',
      Email: 'ahmed.bennani@gmail.com',
      password: '••••••••',
      adress: '10 rue A, Casablanca',
      phoneNumbre: '+212612345678',
      domain: 'Développement Web',
      image: '/avatars/ab.png',
      role: 'Admin'
    },
    {
      id: 2,
      fullName: 'Fatima Alaoui',
      Email: 'fatima.alaoui@gmail.com',
      password: '••••••••',
      adress: '5 av. B, Rabat',
      phoneNumbre: '+212687654321',
      domain: 'UI/UX Design',
      image: '/avatars/fa.png',
      role: 'Designer'
    },
    // …
  ]);

  // colonnes pour le tableau, plus seulement fullName, Email, domain, role
  const columns = [
    { id: 'fullName',    label: 'Nom Complet', align: 'left' },
    { id: 'Email',       label: 'Email',        align: 'left' },
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
    { id: 'role',label: 'Rôle',align: 'center' },
  ];

  // actions
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const handleOpenDelete = emp => { setSelectedEmploye(emp); setOpenDelete(true); };
  const handleCloseDelete = () => { setSelectedEmploye(null); setOpenDelete(false); };
  const handleConfirmDelete = () => {
    setRows(prev => prev.filter(e => e.id !== selectedEmploye.id));
    handleCloseDelete();
  };
  const actions = [
    {
      icon: <DeleteIcon />,
      tooltip: t('Supprimer'),
      onClick: handleOpenDelete
    }
  ];

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const paginatedRows = rows.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);

  // modals add / export
  const [openAdd, setOpenAdd] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  return (
    <>
      <Box sx={{ p:3, bgcolor:'#f5f5f5', minHeight:'100vh' }}>
        <Card sx={{ p:4, borderRadius:3, boxShadow:'0 8px 32px rgba(0,0,0,0.1)', bgcolor:'white' }}>
          <Box sx={{ mb:2 }}>
            <Typography variant="h4" fontWeight="bold" color="#1976d2">
             {t('Gestion des Comptes Utilisateurs')}
            </Typography>
          </Box>
          <Divider sx={{ mb:3 }} />

          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
            <TextField
              label={t('Rechercher')}
              variant="outlined"
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

            <Grid container spacing={2} justifyContent="flex-end" alignItems="center" sx={{ width:'fit-content' }}>
              <Grid item>
                <ButtonComponent onClick={()=>setOpenAdd(true)} text={t('Ajouter')} icon={<AddCircleOutline/>}/>
              </Grid>
              <Grid item>
                <ButtonComponent onClick={()=>setOpenExport(true)} text={t('Export')} icon={<CloudDownload/>}/>
              </Grid>
              <Grid item>
                <ButtonComponent text={t('Import')} icon={<FileUpload/>}/>
              </Grid>
            </Grid>
          </Box>

          <TableComponent columns={columns} rows={paginatedRows} actions={actions}/>

          <Box mt={4} display="flex" justifyContent="center">
            <PaginationComponent count={totalPages} page={currentPage} onChange={handlePageChange}/>
          </Box>
        </Card>
      </Box>

      <ModelComponent
        open={openAdd}
        handleClose={()=>setOpenAdd(false)}
        title={t('Ajouter un Employé')}
        icon={<AddCircleOutline/>}
      >
        <AddEmploye/>
      </ModelComponent>

      <DeleteEmploye
        open={openDelete}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
        employeName={selectedEmploye?.name}
        cancelText={t('Annuler')}
        confirmText={t('Supprimer')}
      />

      <ExportModal
        open={openExport}
        onClose={()=>setOpenExport(false)}
        entity="employes"
      />
    </>
  );
};

export default Employe;
