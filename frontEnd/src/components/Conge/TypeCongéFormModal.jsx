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
  // --- STATES locaux
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [createError, setCreateError] = useState("");

  // ----- VALIDATION (Yup + RHF) -----
  const schema = Yup.object().shape({
    typeName: Yup.string()
      .trim()
      .required("Le nom du type est requis")
      .max(40, "40 caractères max")
      .test("unique", "Ce nom existe déjà", (value) => {
        if (!value) return true;
        return !typesConge.some((type) => type.name.trim().toLowerCase() === value.trim().toLowerCase());
      }),
  });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { typeName: "" },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({ typeName: "" });
    setCreateError("");
  }, [open, reset]);

  // ---- Création ----
  const onSubmit = async (data) => {
    try {
      await onCreate(data.typeName);
      toast.success("Type créé !");
      reset({ typeName: "" });
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  // ---- Edition inline ----
  const startEdit = (type) => {
    setEditId(type._id);
    setEditValue(type.name);
    setCreateError("");
  };

  const saveEdit = () => {
    const value = editValue.trim();
    if (!value) {
      setCreateError("Le nom du type est requis");
      toast.error("Le nom du type est requis");
      return;
    }
    if (value.length > 40) {
      setCreateError("40 caractères max");
      toast.error("40 caractères max");
      return;
    }
    const nameExists = typesConge.some(
      (type) => type.name.toLowerCase() === value.toLowerCase() && type._id !== editId
    );
    if (nameExists) {
      setCreateError("Ce nom existe déjà");
      toast.error("Ce nom existe déjà");
      return;
    }
    onEditType(editId, value);
    setEditId(null);
    setEditValue("");
    setCreateError("");
    toast.success("Type modifié !");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue("");
    setCreateError("");
  };

  // ---- Suppression avec toast
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
      <ModelComponent
        open={open}
        handleClose={onClose}
        title="Gestion des types de congé"
        icon={<EventIcon />}
        maxWidth="md"
      >
        <Box sx={{ minHeight: 400 }}>
          {/* Section Création */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AddCircleOutlineIcon color="primary" />
              Créer un type de congé
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="typeName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom du type de congé"
                    fullWidth
                    error={!!errors.typeName}
                    helperText={errors.typeName?.message}
                    sx={{ mb: 2 }}
                    placeholder="Ex: Congé payé, Maladie, RTT…"
                    disabled={isSubmitting}
                  />
                )}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={isSubmitting}
                >
                  Créer le type
                </Button>
              </Stack>
            </form>
          </Paper>
          <Divider sx={{ my: 2 }} />

          {/* Section Types existants */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventIcon color="primary" />
              Types existants
              <Chip label={typesConge.length} size="small" color="primary" variant="outlined" />
            </Typography>
            {typesConge.length === 0 ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                <EventIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Aucun type de congé créé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Créez votre premier type ci-dessus
                </Typography>
              </Paper>
            ) : (
              <List
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  maxHeight: 250,
                  overflowY: "auto",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                {typesConge.map((type, index) => (
                  <Fade in={true} timeout={300 + index * 100} key={type._id}>
                    <ListItem
                      divider={index < typesConge.length - 1}
                      sx={{
                        "&:hover": { bgcolor: "action.hover" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      {editId === type._id ? (
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
                          <TextField
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            size="small"
                            fullWidth
                            error={!!createError}
                            helperText={createError}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <Tooltip title="Sauvegarder">
                            <IconButton color="primary" onClick={saveEdit} disabled={!editValue.trim()}>
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Annuler">
                            <IconButton color="error" onClick={cancelEdit}>
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <>
                          <Typography sx={{ flex: 1, color: "#222", fontWeight: 500, fontSize: "1.1rem", textTransform: "capitalize" }}>
                            {type.name}
                          </Typography>
                          <ListItemSecondaryAction>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Modifier">
                                <IconButton edge="end" color="primary" onClick={() => startEdit(type)} size="small">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() => handleDeleteClick(type)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </ListItemSecondaryAction>
                        </>
                      )}
                    </ListItem>
                  </Fade>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </ModelComponent>
      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="warning" />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cette action est irréversible
          </Alert>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le type de congé <strong>"{typeToDelete?.name}"</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
