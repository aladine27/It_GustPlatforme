import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, InputAdornment,
  IconButton, Grid, CircularProgress, Chip, Avatar, useTheme
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
import { FetchEmployesBySearchAction, deleteEmployeAction, ImportEmployesExcel } from '../redux/actions/employeAction';
import TableComponent from '../components/Global/TableComponent';
import PaginationComponent from '../components/Global/PaginationComponent';
import { ButtonComponent } from '../components/Global/ButtonComponent';
import AddEmployeModal from '../components/Employe/AddEmploye';
import VisibilityIcon from '@mui/icons-material/Visibility';

import ExportModal from '../components/ExportModal';
import { toast, ToastContainer } from 'react-toastify';
import { StyledPaper } from '../style/style';
import axios from 'axios';
import CustomDeleteForm from '../components/Global/CustomDeleteForm';
import EmployeeDetailsModal from '../components/Employe/EmployDetailModal';
import { EditIcon } from 'lucide-react';

const Employe = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { list: allRows, loading, error: loadError } = useSelector(state => state.employe);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fileInputRef = useRef();
  const [openDetail, setOpenDetail] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const handleCloseAdd = () => {
  setOpenAdd(false);
  setIsEdit(false); 
  setSelectedEmploye(null); 
};
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    dispatch(FetchEmployesBySearchAction(''));
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(FetchEmployesBySearchAction(search));
      setCurrentPage(1);
    }, 900);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  // For deterministic color assignment
  const domainColorMap = {};
  const availableColors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
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
          sx={{
            width: 44, height: 44, margin: '0 auto',
            boxShadow: theme.shadows[1],
            border: `2px solid ${theme.palette.primary.light}`
          }}
        />
      )
    },
    { id: 'fullName', label: t('Nom Complet'), align: 'left' },
    { id: 'email', label: t('Email'), align: 'left' },
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
          sx={{ fontWeight: 700, fontSize: '0.98rem', borderRadius: 2 }}
        />
      )
    },
    { id: 'role', label: t('Rôle'), align: 'center' },
  ];

  const [openAdd, setOpenAdd] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState(null);

  const handleOpenDelete = emp => { setSelectedEmploye(emp); setOpenDelete(true); };
  const handleCloseDelete = () => { setSelectedEmploye(null); setOpenDelete(false); };
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
    { icon: <DeleteIcon />, tooltip: t('Supprimer'), onClick: handleOpenDelete },
  
    {
  icon: <EditIcon sx={{ color: "#2e7d32" }} />,
  tooltip: t('Editer'),
  onClick: (emp) => {
    console.log("🟢 [Edit Click] Employé à éditer :", emp); // 👈 LOG AJOUTÉ
    setSelectedEmploye(emp);
    setIsEdit(true);
    setOpenAdd(true);
  }
}

  ];
  const handleImportClick = () => fileInputRef.current.click();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await dispatch(ImportEmployesExcel(file)).unwrap();
      toast.success('Import terminé avec succès !');
    } catch (err) {
      toast.error('Erreur lors de l’import : ' + err);
    } finally {
      event.target.value = "";
    }
  };

  const totalPages = Math.ceil((allRows?.length || 0) / itemsPerPage);
  const paginatedRows = allRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (_e, value) => setCurrentPage(value);

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" fontWeight={600}>{loadError}</Typography>
      </Box>
    );
  }

  return (
    <>
     <ToastContainer position="top-right" autoClose={3500} />
      <StyledPaper sx={{ p: { xs: 2, md: 4 }, mt: 2 }}>
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
            <Grid item>
              <ButtonComponent
                onClick={() => setOpenAdd(true)}
                text={t('Ajouter')}
                icon={<AddCircleOutline />}
                
              />
            </Grid>
            <Grid item>
              <ButtonComponent
                onClick={() => setOpenExport(true)}
                text={t('Export')}
                icon={<CloudDownload />}
              
              />
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('Nom, Email, Domaine...')}
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
        </Box>

        <TableComponent columns={columns} rows={paginatedRows} actions={actions} />

        <Box mt={4} display="flex" justifyContent="center">
          <PaginationComponent count={totalPages} page={currentPage} onChange={handlePageChange} />
        </Box>
      </StyledPaper>

      <AddEmployeModal
        open={openAdd}
        handleClose={handleCloseAdd}
        isEdit={isEdit}
        employeToEdit={selectedEmploye}
/>
      {openDelete && selectedEmploye && (
        <CustomDeleteForm
          open={openDelete}
          handleClose={handleCloseDelete}
          icon={<DeleteIcon />}
          title={t('supprimer')}
          
      > 
      <Typography sx={{marginTop:"20px"}}>
      {t("Êtes-vous sûr de vouloir supprimer" ) }+{selectedEmploye.fullName }
      <Box sx={{marginTop:"25px",display:"flex",justifyContent:"center"}}>
      <ButtonComponent  onClick={handleConfirmDelete} text={t('supprimer')} icon={<DeleteIcon />  } color="#E1000F"/>
</Box>
      </Typography>
      </CustomDeleteForm>
      )}

      <ExportModal
        open={openExport}
        onClose={() => setOpenExport(false)}
        entity="employes"
      />
      <EmployeeDetailsModal
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        employe={selectedEmploye}
      />

    </>
  );
};

export default Employe;
