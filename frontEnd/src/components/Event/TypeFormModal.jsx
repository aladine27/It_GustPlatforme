import { useState, useEffect } from "react"
import {
  TextField,
  Stack,
  IconButton,
  Box,
  Typography,
  Divider,
  Chip,
  Alert,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  Paper,
  Fade,
  Tooltip,
} from "@mui/material"
import ModelComponent from "../Global/ModelComponent"
import CustomDeleteForm from "../Global/CustomDeleteForm"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import DeleteIcon from "@mui/icons-material/Delete"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import EventIcon from "@mui/icons-material/Event"

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';

export default function TypeFormModal({
  open,
  onClose,
  value,
  onChange,
  onCreate,
  eventTypes = [],
  onDeleteType,
  onEditType,
}) {
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState(null)
  const [createError, setCreateError] = useState("")

  const { t } = useTranslation();

  const schema = Yup.object().shape({
    eventType: Yup.string()
      .trim()
      .required(t("Le nom du type est requis"))
      .max(40, t("40 caractères max"))
      .test("unique", t("Ce nom de type existe déjà"), (value) => {
        if (!value) return true;
        return !eventTypes.some((type) => type.name.trim().toLowerCase() === value.trim().toLowerCase());
      }),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { eventType: "" },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({ eventType: value || "" });
    setCreateError("");
  }, [open, value, reset]);

  const onSubmit = async (data) => {
    try {
      await onCreate(data.eventType);
      toast.success(t("Type créé avec succès !"));
      reset({ eventType: "" });
    } catch (e) {
      toast.error(t("Erreur lors de la création du type"));
    }
  };

  const startEdit = (type) => {
    setEditId(type._id)
    setEditValue(type.name)
    setCreateError("")
  }

  const saveEdit = () => {
    const value = editValue.trim();
    if (!value) {
      setCreateError(t("Le nom du type est requis"));
      toast.error(t("Le nom du type est requis"));
      return;
    }
    if (value.length > 40) {
      setCreateError(t("40 caractères max"));
      toast.error(t("40 caractères max"));
      return;
    }
    const nameExists = eventTypes.some(
      (type) => type.name.toLowerCase() === value.toLowerCase() && type._id !== editId
    );
    if (nameExists) {
      setCreateError(t("Ce nom de type existe déjà"));
      toast.error(t("Ce nom de type existe déjà"));
      return;
    }
    onEditType(editId, value);
    setEditId(null);
    setEditValue("");
    setCreateError("");
    toast.success(t("Type modifié !"));
  };

  const cancelEdit = () => {
    setEditId(null)
    setEditValue("")
    setCreateError("")
  }

  const handleDeleteClick = (type) => {
    setTypeToDelete(type)
    setDeleteConfirmOpen(true)
  }
  const confirmDelete = () => {
    if (typeToDelete) {
      onDeleteType(typeToDelete._id)
      setDeleteConfirmOpen(false)
      setTypeToDelete(null)
      toast.success(t("Type supprimé !"));
    }
  }
  const cancelDelete = () => {
    setDeleteConfirmOpen(false)
    setTypeToDelete(null)
  }

  return (
    <>
      <ModelComponent
        open={open}
        handleClose={onClose}
        title={t("Gestion des types d'événements")}
        icon={<EventIcon />}
        maxWidth="md"
      >
        <Box sx={{ minHeight: 400 }}>
          {/* Section Création */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AddCircleOutlineIcon color="primary" />
              {t("Créer un nouveau type")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("Nom du type d'événement")}
                    fullWidth
                    error={!!errors.eventType}
                    helperText={errors.eventType?.message}
                    sx={{ mb: 2 }}
                    placeholder={t("Ex: Conférence, Atelier, Séminaire...")}
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
                  {t("Créer le type")}
                </Button>
              </Stack>
            </form>
          </Paper>
          <Divider sx={{ my: 2 }} />

          {/* Section Types existants */}
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#222",
              }}
            >
              <EventIcon color="primary" />
              {t("Liste des types d'événements")}
              <Chip label={eventTypes.length} size="small" color="primary" variant="outlined" />
            </Typography>

            {eventTypes.length === 0 ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                <EventIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  {t("Aucun type d'événement créé")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Créez votre premier type ci-dessus")}
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
                {eventTypes.map((type, index) => (
                  <Fade in={true} timeout={300 + index * 100} key={type._id}>
                    <ListItem
                      divider={index < eventTypes.length - 1}
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
                          <Tooltip title={t("Sauvegarder")}>
                            <IconButton color="primary" onClick={saveEdit} disabled={!editValue.trim()}>
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("Annuler")}>
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
                              <Tooltip title={t("Modifier")}>
                                <IconButton edge="end" color="primary" onClick={() => startEdit(type)} size="small">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t("Supprimer")}>
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
      <CustomDeleteForm
        open={deleteConfirmOpen}
        handleClose={cancelDelete}
        title={t("Confirmer la suppression")}
        icon={<DeleteOutline sx={{ color: "red", fontSize: 38 }} />}
      >
        <Typography sx={{ mb: 1 }}>
          {t("Êtes-vous sûr de vouloir supprimer le type d'événement")} <strong>"{typeToDelete?.name}"</strong> ?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={cancelDelete} color="inherit">
            {t("Annuler")}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>
            {t("Supprimer")}
          </Button>
        </Box>
      </CustomDeleteForm>
    </>
  )
}
