import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  AddCircleOutline,
  CloudDownload,
  FileUpload
} from '@mui/icons-material';
import ButtonComponent from '../components/Global/ButtonComponent';
import ModelComponent from '../components/Global/ModelComponent';

// Map to hold assigned colors for each domain
const domainColorMap = {};
// Array of available color names
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

const Employe = () => {
  const rows = [
    { id: 1, name: 'Ahmed Bennani', email: 'ahmed.bennani@gmail.com', phone: '+212 6 12 34 56 78', domain: 'Développement Web', status: 'Actif', avatar: 'AB' },
    { id: 2, name: 'Fatima Alaoui', email: 'fatima.alaoui@gmail.com', phone: '+212 6 87 65 43 21', domain: 'Design UI/UX', status: 'Actif', avatar: 'FA' },
    { id: 3, name: 'Youssef Tazi', email: 'youssef.tazi@gmail.com', phone: '+212 6 55 44 33 22', domain: 'DevOps', status: 'Inactif', avatar: 'YT' },
    { id: 4, name: 'Youssef ', email: 'youssef.tazi@hotmail.com', phone: '+212 6 55 44 33 22', domain: 'Développement mobile', status: 'Inactif', avatar: 'YT' },
    { id: 5, name: 'Youssef ', email: 'youssef.tazi@hotmail.com', phone: '+212 6 55 44 33 22', domain: 'DevOps', status: 'Inactif', avatar: 'YT' }
  ];

  const getStatusColor = (status) => (status === 'Actif' ? 'success' : 'error');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="#1976d2">Gestion des Employés</Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
              <Grid item>
                <ButtonComponent onClick={handleOpen} text="Ajouter" icon={<AddCircleOutline />} />
              </Grid>
              <Grid item>
                <ButtonComponent onClick={handleOpen} text="Export" icon={<CloudDownload />} />
              </Grid>
              <Grid item>
                <ButtonComponent onClick={handleOpen} text="Import" icon={<FileUpload />} />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TextField
            label="Rechercher"
            variant="outlined"
            fullWidth
            sx={{ mb: 3, borderRadius: '20px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small"><SearchIcon /></IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Table Section */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table aria-label="employee table">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Employé</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Domaine</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Statut</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40, fontSize: '0.9rem' }}>{row.avatar}</Avatar>
                        <Typography variant="body1" fontWeight="medium">{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" color="text.secondary">{row.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2" color="text.secondary">{row.phone}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<WorkIcon />}
                        label={row.domain}
                        color={getDomainColor(row.domain)}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={row.status} color={getStatusColor(row.status)} size="small" sx={{ borderRadius: 2, fontWeight: 'medium', minWidth: 70 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Supprimer">
                        <IconButton size="small" sx={{ color: '#d32f2f' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Card>
      </Box>
      <ModelComponent open={open} handleClose={handleClose} title="Ajouter un Employé" icon={<AddCircleOutline />} />
    </>
  );
};

export default Employe;
