import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, Stack, Button, Divider, List, ListItem,
  ListItemSecondaryAction, IconButton, Tooltip, Chip, Fade
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CategoryIcon from "@mui/icons-material/Category";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ModelComponent from "../../components/Global/ModelComponent";
import CustomDeleteForm from "../../components/Global/CustomDeleteForm"; // Ajoute cet import

export default function CategoryFormModal({
  open,
  onClose,
  jobCategories,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [createError, setCreateError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  const schema = Yup.object().shape({
    category: Yup.string().trim().required("Le nom de la catégorie est requis")
    .max(40, "40 caractères max")
    .test(
        "unique",
        "Cette catégorie existe déjà",
        function (value) {
          if (!value) return true;
          const norm = value.trim().toLowerCase();
          return !jobCategories.some(
            (cat) => cat.name.trim().toLowerCase() === norm
          );
        }
      ),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { category: "" },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({ category: "" });
    setCreateError("");
  }, [open, reset]);

  const onSubmit = async (data) => {
    if (!data.category) return;
    try {
      await onCreateCategory(data.category); // attend string côté parent
      reset({ category: "" });
    } catch (e) {
      setCreateError("Erreur lors de la création.");
    }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditValue(cat.name);
    setCreateError("");
  };

  const saveEdit = () => {
    const value = editValue.trim();
    if (!value) {
      setCreateError("Le nom de la catégorie est requis");
      return;
    }
    if (value.length > 40) {
      setCreateError("40 caractères max");
      return;
    }
    // vérifier unicité si besoin
    onEditCategory(editId, value);
    setEditId(null);
    setEditValue("");
    setCreateError("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue("");
    setCreateError("");
  };
  const handleDeleteClick = (cat) => {
    setCatToDelete(cat);
    setDeleteConfirmOpen(true);
  };
  const confirmDelete = () => {
    if (catToDelete) {
      onDeleteCategory(catToDelete._id);
      setDeleteConfirmOpen(false);
      setCatToDelete(null);
    }
  };
  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCatToDelete(null);
  };

  return (
    <>
      <ModelComponent
        open={open}
        handleClose={onClose}
        title={"Gestion des catégories d'emploi"}
        icon={<CategoryIcon />}
      >
        <Box sx={{ minHeight: 320 }}>
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AddCircleOutlineIcon color="primary" />
              {"Créer une nouvelle catégorie"}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={"Nom de la catégorie"}
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    sx={{ mb: 2 }}
                    placeholder={"Ex: IT, RH, Comptabilité..."}
                  />
                )}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                >
                  {"Créer la catégorie"}
                </Button>
              </Stack>
              {!!createError && <Typography color="error">{createError}</Typography>}
            </form>
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, color: "#222" }}
            >
              <CategoryIcon color="primary" />
              {"Liste des catégories"}
              <Chip label={jobCategories.length} size="small" color="primary" variant="outlined" />
            </Typography>
            <List
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                maxHeight: 250,
                overflowY: "auto",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {jobCategories.map((cat, index) => (
                <Fade in={true} timeout={300 + index * 100} key={cat._id}>
                  <ListItem divider={index < jobCategories.length - 1} sx={{ "&:hover": { bgcolor: "action.hover" }, transition: "background-color 0.2s" }}>
                    {editId === cat._id ? (
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
                        <Tooltip title={"Sauvegarder"}>
                          <IconButton color="primary" onClick={saveEdit} disabled={!editValue.trim()}>
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Annuler"}>
                          <IconButton color="error" onClick={cancelEdit}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <>
                        <Typography sx={{ flex: 1, color: "#222", fontWeight: 500, fontSize: "1.1rem", textTransform: "capitalize" }}>
                          {cat.name}
                        </Typography>
                        <ListItemSecondaryAction>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title={"Modifier"}>
                              <IconButton edge="end" color="primary" onClick={() => startEdit(cat)} size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={"Supprimer"}>
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleDeleteClick(cat)}
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
          </Box>
        </Box>
      </ModelComponent>
      {/* Dialog de confirmation de suppression (remplacé par CustomDeleteForm) */}
      <CustomDeleteForm
        open={deleteConfirmOpen}
        handleClose={cancelDelete}
        title={
          <>
            Confirmer la suppression de la catégorie <b>{catToDelete?.name}</b> ?
          </>
        }
        icon={<DeleteIcon sx={{ fontSize: 40, color: "red" }} />}
      >
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={confirmDelete}
          >
            Supprimer
          </Button>
          <Button
            color="inherit"
            onClick={cancelDelete}
          >
            Annuler
          </Button>
        </Box>
      </CustomDeleteForm>
    </>
  );
}
