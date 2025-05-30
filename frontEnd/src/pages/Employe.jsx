import * as React from 'react';
import { useState } from 'react'; // Add this import
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Card,Typography,Box,Avatar,Chip,IconButton,Divider,TextField,InputAdornment,Grid} from '@mui/material';
import {Delete as DeleteIcon,Email as EmailIcon,Phone as PhoneIcon,Work as WorkIcon,Search as SearchIcon,AddCircleOutline,CloudDownload,FileUpload} from '@mui/icons-material';
import ButtonComponent from '../components/Global/ButtonComponent';
import ModelComponent from '../components/Global/ModelComponent';
import AddEmploye from '../components/Employe/AddEmploye';
import DeleteEmploye from '../components/Employe/DeleteEmploye';
import ExportModal from '../components/ExportModal'; 
import PaginationComponent from '../components/Global/PaginationComponent';
import { useTranslation } from 'react-i18next';
import TableComponent from '../components/Global/TableComponent';




const Employe = () => {
  const domainColorMap = {};
  const availableColors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
  let colorIndex = 0;
// Function to get or assign color for a domain
  const getDomainColor = (domain) => {
       if (!domainColorMap[domain]) {
        // Assign next color in round-robin
        domainColorMap[domain] = availableColors[colorIndex % availableColors.length];
        colorIndex += 1;
      }
      return domainColorMap[domain];
  };
  
  // État pour la liste des employés
  const [rows, setRows] = useState([
    { id: 1, name: 'Ahmed Bennani', email: 'ahmed.bennani@gmail.com', phone: '+212 6 12 34 56 78', domain: 'Développement Web', status: 'Actif', avatar: 'AB' },
    { id: 2, name: 'Fatima Alaoui', email: 'fatima.alaoui@gmail.com', phone: '+212 6 87 65 43 21', domain: 'Design UI/UX', status: 'Actif', avatar: 'FA' },
    { id: 3, name: 'Youssef Tazi', email: 'youssef.tazi@gmail.com', phone: '+212 6 55 44 33 22', domain: 'DevOps', status: 'Inactif', avatar: 'YT' },
    { id: 4, name: 'Youssef ', email: 'youssef.tazi@hotmail.com', phone: '+212 6 55 44 33 22', domain: 'Développement mobile', status: 'Inactif', avatar: 'YT' },
    { id: 5, name: 'Youssef ', email: 'youssef.tazi@hotmail.com', phone: '+212 6 55 44 33 22', domain: 'DevOps', status: 'Inactif', avatar: 'YT' }
  ]);
  const columns = [
    { id: 'name', label: 'Nom', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    {
      id: 'domain',
      label: 'Domaine',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.domain}
          color={getDomainColor(row.domain)} // appel ici
          variant="outlined"
          size="small"
        />
      )
    },
    {
      id: 'status',
      label: 'Statut',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.status}
          color={getStatusColor(row.status)} // facultatif si déjà défini
          variant="outlined"
          size="small"
        />
      )
    }
  ];
  const handleOpenDelete = (employe) => {
    setSelectedEmploye(employe);
    setOpenDelete(true);
  };
  
  const handleCloseDelete = () => {
    setSelectedEmploye(null);
    setOpenDelete(false);
  }; 
  const actions = [
    {
      icon: <DeleteIcon />,
      tooltip: 'Supprimer',
      onClick: handleOpenDelete 
    }
  ];

  
  const [openAddEmploye, setOpenAddEmploye] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [openExport, setOpenExport] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const handleOpenAddEmploye = () => setOpenAddEmploye(true);
  const handleCloseAddEmploye = () => setOpenAddEmploye(false);
  


  const handleConfirmDelete = () => {
    setRows((prev) => prev.filter((emp) => emp.id !== selectedEmploye.id));
    handleCloseDelete();
  };

  const handleOpenExport = () => setOpenExport(true);
  const handleCloseExport = () => setOpenExport(false);
  const {t, i18n }= useTranslation();
  const getStatusColor = (status) => (status === 'Actif' ? 'success' : 'error');
  const totalPages = Math.ceil(rows.length / itemsPerPage);

// Calcule les lignes à afficher pour la page courante
const paginatedRows = rows.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
const handlePageChange = (_event, value) => {
  setCurrentPage(value);
};


  return (
    <>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="#1976d2">{t("Gestion des Comptes Utilisateurs")} </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
              <Grid>
                <ButtonComponent onClick={handleOpenAddEmploye} text="Ajouter" icon={<AddCircleOutline />} />
              </Grid>
              <Grid>
                <ButtonComponent onClick={handleOpenExport} text="Export" icon={<CloudDownload />} />
              </Grid>
              <Grid>
                <ButtonComponent text="Import" icon={<FileUpload />} />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TextField
            label="Rechercher"
            variant="outlined"
            sx={{ mb: 3, borderRadius: '50px', width: '50%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small"><SearchIcon /></IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: '20px', width: "100%" }
            }}
          />

          {/* Table Section */}

          <TableComponent columns={columns} rows={paginatedRows} actions={actions}/>
        
          <Box mt={4} display="flex" justifyContent="center">
  <PaginationComponent
    count={totalPages}
    page={currentPage}
    onChange={handlePageChange}
  />
</Box>

        </Card>
      </Box>

      <ModelComponent open={openAddEmploye} handleClose={handleCloseAddEmploye} title="Ajouter un Employé" icon={<AddCircleOutline />}>
        <Box>
          <AddEmploye />
        </Box>
      </ModelComponent>

      <DeleteEmploye
        open={openDelete}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
        employeName={selectedEmploye?.name}
      />

      <ExportModal
        open={openExport}
        onClose={handleCloseExport}
        entity="employes"
      />
    </>
  );
};

export default Employe;