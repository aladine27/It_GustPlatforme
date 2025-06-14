import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { ButtonComponent } from '../components/Global/ButtonComponent';
import TableComponent from "../components/Global/TableComponent";

const Conge = () => {
  // Etats principaux
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: "Jean Dupont",
      avatar: "J",
      type: "Congé payé",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      days: 5,
      status: "approved",
      reason: "Vacances familiales",
    },
    {
      id: 2,
      name: "Marie Martin",
      avatar: "M",
      type: "Congé maladie",
      startDate: "2024-01-22",
      endDate: "2024-01-24",
      days: 3,
      status: "pending",
      reason: "Consultation médicale",
    },
    {
      id: 3,
      name: "Pierre Durand",
      avatar: "P",
      type: "RTT",
      startDate: "2024-01-25",
      endDate: "2024-01-25",
      days: 1,
      status: "rejected",
      reason: "Rendez-vous personnel",
    },
    {
      id: 4,
      name: "Sophie Bernard",
      avatar: "S",
      type: "Congé sans solde",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      days: 14,
      status: "pending",
      reason: "Projet personnel",
    },
  ]);
  const [newLeave, setNewLeave] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Statistiques
  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  // Outils d'affichage
  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return <Typography sx={{ color: "green", fontWeight: 600 }}>Approuvé</Typography>;
      case "pending":
        return <Typography sx={{ color: "orange", fontWeight: 600 }}>En attente</Typography>;
      case "rejected":
        return <Typography sx={{ color: "red", fontWeight: 600 }}>Rejeté</Typography>;
      default:
        return <Typography>{status}</Typography>;
    }
  };

  // Table columns
  const columns = [
    { id: "name", label: "Employé" },
    { id: "type", label: "Type" },
    {
      id: "startDate",
      label: "Début",
      render: (row) => new Date(row.startDate).toLocaleDateString("fr-FR"),
    },
    {
      id: "endDate",
      label: "Fin",
      render: (row) => new Date(row.endDate).toLocaleDateString("fr-FR"),
    },
    { id: "days", label: "Jours" },
    {
      id: "status",
      label: "Statut",
      render: (row) => getStatusChip(row.status),
    },
  ];

  // Actions table
  const actions = [
    {
      icon: <ViewIcon color="info" />,
      tooltip: "Voir détails",
      onClick: (row) => alert(JSON.stringify(row, null, 2)),
    },
    {
      icon: <EditIcon color="primary" />,
      tooltip: "Modifier",
      onClick: (row) => handleOpenDialog(row),
    },
    {
      icon: <DeleteIcon color="error" />,
      tooltip: "Supprimer",
      onClick: (row) => handleDeleteLeave(row.id),
    },
  ];

  // Dialog
  const handleOpenDialog = (leave = null) => {
    if (leave) {
      setSelectedLeave(leave);
      setNewLeave({
        name: leave.name,
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
      });
    } else {
      setSelectedLeave(null);
      setNewLeave({
        name: "",
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    }
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLeave(null);
  };
  const handleSaveLeave = () => {
    if (selectedLeave) {
      setLeaves(
        leaves.map((leave) =>
          leave.id === selectedLeave.id
            ? {
                ...leave,
                ...newLeave,
                days:
                  Math.ceil(
                    (new Date(newLeave.endDate) - new Date(newLeave.startDate)) /
                      (1000 * 60 * 60 * 24)
                  ) + 1,
              }
            : leave
        )
      );
    } else {
      const newId = Math.max(...leaves.map((l) => l.id)) + 1;
      setLeaves([
        ...leaves,
        {
          id: newId,
          ...newLeave,
          avatar: newLeave.name[0] || "?",
          days:
            Math.ceil(
              (new Date(newLeave.endDate) - new Date(newLeave.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1,
          status: "pending",
        },
      ]);
    }
    handleCloseDialog();
  };
  const handleDeleteLeave = (leaveId) => setLeaves(leaves.filter((leave) => leave.id !== leaveId));

  // Filtres
  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // RENDER
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Gestion des Congés
        </Typography>
        
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#e3f2fd", borderLeft: "6px solid #1976d2" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <CalendarIcon sx={{ fontSize: 36, color: "#1976d2", mr: 2 }} />
              <Box>
                <Typography variant="h5" color="primary">{stats.total}</Typography>
                <Typography variant="body2">Total des demandes</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#fff3e0", borderLeft: "6px solid #ffa726" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <ClockIcon sx={{ fontSize: 36, color: "#ffa726", mr: 2 }} />
              <Box>
                <Typography variant="h5" color="warning.main">{stats.pending}</Typography>
                <Typography variant="body2">En attente</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#e8f5e9", borderLeft: "6px solid #66bb6a" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle sx={{ fontSize: 36, color: "#43a047", mr: 2 }} />
              <Box>
                <Typography variant="h5" color="success.main">{stats.approved}</Typography>
                <Typography variant="body2">Approuvées</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#ffebee", borderLeft: "6px solid #ef5350" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Cancel sx={{ fontSize: 36, color: "#ef5350", mr: 2 }} />
              <Box>
                <Typography variant="h5" color="error.main">{stats.rejected}</Typography>
                <Typography variant="body2">Rejetées</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Rechercher par employé ou type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  label="Statut"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous les statuts</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="approved">Approuvé</MenuItem>
                  <MenuItem value="rejected">Rejeté</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type de congé</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type de congé"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous les types</MenuItem>
                  <MenuItem value="Congé payé">Congé payé</MenuItem>
                  <MenuItem value="Congé maladie">Congé maladie</MenuItem>
                  <MenuItem value="RTT">RTT</MenuItem>
                  <MenuItem value="Congé sans solde">Congé sans solde</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <ButtonComponent
                text="Réinitialiser"
                icon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tableau */}
      <TableComponent
        rows={filteredLeaves}
        columns={columns}
        actions={actions}
      />

      {/* Dialog pour créer/modifier une demande */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedLeave ? "Modifier la demande de congé" : "Nouvelle demande de congé"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Employé"
                fullWidth
                value={newLeave.name}
                onChange={(e) => setNewLeave({ ...newLeave, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Type de congé"
                fullWidth
                value={newLeave.type}
                onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
              >
                <MenuItem value="Congé payé">Congé payé</MenuItem>
                <MenuItem value="Congé maladie">Congé maladie</MenuItem>
                <MenuItem value="RTT">RTT</MenuItem>
                <MenuItem value="Congé sans solde">Congé sans solde</MenuItem>
                <MenuItem value="Congé maternité">Congé maternité</MenuItem>
                <MenuItem value="Congé paternité">Congé paternité</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de début"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de fin"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Motif"
                fullWidth
                multiline
                minRows={3}
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ButtonComponent text="Annuler" onClick={handleCloseDialog} />
          <ButtonComponent
            text={selectedLeave ? "Modifier" : "Créer"}
            onClick={handleSaveLeave}
            icon={<AddIcon />}
            disabled={
              !newLeave.name ||
              !newLeave.type ||
              !newLeave.startDate ||
              !newLeave.endDate
            }
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Conge;
