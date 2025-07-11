import { useState, useEffect } from "react";
import {
  TextField,
  Stack,
  IconButton,
  Box,
  Typography,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  Paper,
  Fade,
  Tooltip,
} from "@mui/material";
import ModelComponent from "../Global/ModelComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TypeCongeFormModal({
  open,
  onClose,
  typesConge = [],
  onCreate,
  onDeleteType,
  onEditType,
}) {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({ name: "", limitDuration: "" });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Le nom du type est requis")
      .max(40)
      .test("unique", "Ce nom existe déjà", (value) => {
        if (!value) return true;
        return !typesConge.some(
          (type) => type.name.trim().toLowerCase() === value.trim().toLowerCase()
        );
      }),
    limitDuration: Yup.string().trim().max(20).nullable(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { typeName: "", limitDuration: "" },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({ typeName: "", limitDuration: "" });
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      await onCreate({ name: data.name, limitDuration: data.limitDuration });
      reset();
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const startEdit = (type) => {
    setEditId(type._id);
    setEditValue({ name: type.name, limitDuration: type.limitDuration || "" });
  };

  const saveEdit = () => {
    onEditType(editId, { name: editValue.name, limitDuration: editValue.limitDuration });
    setEditId(null);
    setEditValue({ name: "", limitDuration: "" });
    toast.success("Type modifié !");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue({ name: "", limitDuration: "" });
  };

  const handleDeleteClick = (type) => {
    setTypeToDelete(type);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (typeToDelete) {
      onDeleteType(typeToDelete._id);
      setDeleteConfirmOpen(false);
      setTypeToDelete(null);
      toast.success("Type supprimé !");
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTypeToDelete(null);
  };

  return (
    <>
      <ModelComponent open={open} handleClose={onClose} title="Gestion des types de congé" icon={<EventIcon />} maxWidth="md">
        <Box sx={{ minHeight: 400 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Créer un type de congé
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Nom" size="small" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                  )}
                />
                <Controller
                  name="limitDuration"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Limite (jours)" size="small" fullWidth error={!!errors.limitDuration} helperText={errors.limitDuration?.message} type="number" />
                  )}
                />
                <Button type="submit" variant="contained" startIcon={<AddCircleOutlineIcon />} disabled={isSubmitting}>
                  Créer
                </Button>
              </Stack>
            </form>
          </Paper>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventIcon color="primary" /> Types existants <Chip label={typesConge.length} size="small" color="primary" variant="outlined" />
            </Typography>
            {typesConge.length === 0 ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                <Typography variant="body1" color="text.secondary">Aucun type de congé créé</Typography>
              </Paper>
            ) : (
              <List sx={{ bgcolor: "background.paper", borderRadius: 1, maxHeight: 250, overflowY: "auto" }}>
                {typesConge.map((type, index) => (
                  <Fade in={true} timeout={300 + index * 100} key={type._id}>
                    <ListItem divider={index < typesConge.length - 1}>
                      {editId === type._id ? (
                        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                          <TextField value={editValue.name} onChange={(e) => setEditValue({ ...editValue, name: e.target.value })} size="small" fullWidth placeholder="Nom" />
                          <TextField value={editValue.limitDuration} onChange={(e) => setEditValue({ ...editValue, limitDuration: e.target.value })} size="small" type="number" placeholder="Limite" />
                        </Stack>
                      ) : (
                        <Typography sx={{ flex: 1 }}>
                          {type.name} {type.limitDuration && <Chip label={`Limite: ${type.limitDuration}j`} size="small" sx={{ ml: 1 }} />}
                        </Typography>
                      )}
                      <ListItemSecondaryAction>
                        {editId === type._id ? (
                          <>
                            <IconButton onClick={saveEdit} color="success"><SaveIcon /></IconButton>
                            <IconButton onClick={cancelEdit} color="inherit"><CancelIcon /></IconButton>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Modifier"><IconButton onClick={() => startEdit(type)} color="primary"><EditIcon /></IconButton></Tooltip>
                            <Tooltip title="Supprimer"><IconButton onClick={() => handleDeleteClick(type)} color="error"><DeleteIcon /></IconButton></Tooltip>
                          </>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Fade>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </ModelComponent>

      <Dialog open={deleteConfirmOpen} onClose={cancelDelete} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="warning" /> Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Cette action est irréversible</Alert>
          <Typography>Êtes-vous sûr de vouloir supprimer le type de congé <strong>"{typeToDelete?.name}"</strong> ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>Supprimer</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
