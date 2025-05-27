import * as React from 'react';
import {
  
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
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
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AddCircleOutline,
  CloudDownload,
  FileUpload
} from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ButtonComponent from '../components/Global/ButtonComponent';
import PublishIcon from '@mui/icons-material/Publish';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModelComponent from '../components/Global/ModelComponent';

const Employe = () => {
  const rows = [
    {
      id: 1,
      name: 'Ahmed Bennani',
      email: 'ahmed.bennani@gmail.com',
      phone: '+212 6 12 34 56 78',
      domain: 'Développement Web',
      status: 'Actif',
      avatar: 'AB'
    },
    {
      id: 2,
      name: 'Fatima Alaoui',
      email: 'fatima.alaoui@gmail.com',
      phone: '+212 6 87 65 43 21',
      domain: 'Design UI/UX',
      status: 'Actif',
      avatar: 'FA'
    },
    {
      id: 3,
      name: 'Youssef Tazi',
      email: 'youssef.tazi@gmail.com',
      phone: '+212 6 55 44 33 22',
      domain: 'DevOps',
      status: 'Inactif',
      avatar: 'YT'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Actif' ? 'success' : 'error';
  };
// fonction Aleatoir khir
  const getDomainColor = (domain) => {
    const colors = {
      'Développement Web': 'primary',
      'Design UI/UX': 'secondary',
      'DevOps': 'warning'
    };
    return colors[domain] || 'default';
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }


  return (
    <>
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card 
        sx={{ 
          padding: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: '#1976d2',
                mb: 1
              }}
            >
              Gestion des Employés
            </Typography>
       
          </Box>
          
          <ButtonComponent onClick={handleOpen} text={'Ajouter'} icon={<AddCircleOutline /> } ></ButtonComponent>
          <ButtonComponent onClick={handleOpen} text={'Export'} icon={<CloudDownload />} ></ButtonComponent>
          <ButtonComponent onClick={handleOpen} text={'Import'} icon={<FileUpload/> } ></ButtonComponent>
         
        </Box>
        

        <Divider sx={{ mb: 3 }} />
        <TextField
        label="Rechercher "
            variant="outlined"
            sx={{ mb: 3 }}
            
            InputProps={{
              startAdornment: (
                <InputAdornment>
                <IconButton>
                  <SearchIcon />
                </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: "20px",
              }
               
            }}>
            
            
        </TextField>

        {/* Table Section */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 2,
           
            border: '1px solid #e0e0e0'
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Employé
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Domaine
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Statut
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow 
                  key={row.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f5f5f5',
                      transform: 'scale(1.001)',
                      transition: 'all 0.2s ease-in-out'
                    },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  {/* Employee Info */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#1976d2',
                          width: 40,
                          height: 40,
                          fontSize: '0.9rem'
                        }}
                      >
                        {row.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {row.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Contact Info */}
                  <TableCell>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {row.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {row.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Domain */}
                  <TableCell>
                    <Chip
                      icon={<WorkIcon />}
                      label={row.domain}
                      color={getDomainColor(row.domain)}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        fontWeight: 'medium',
                        minWidth: 70
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                     
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small"
                          sx={{ 
                            color: '#d32f2f',
                            '&:hover': { 
                              backgroundColor: 'rgba(211, 47, 47, 0.1)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
       
        </Box>
      </Card>
    </Box>
    <ModelComponent open={open} handleClose={handleClose} title={"Ajouter un Employé"} icon={<AddCircleOutline />}>

    </ModelComponent>
    </>
  );
};

export default Employe;