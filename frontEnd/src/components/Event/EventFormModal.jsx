import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Grid, TextField, Chip, Checkbox, Typography, Stack, Avatar
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CloseOutlined, DeleteOutline, SaveOutlined } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";
import TableComponent from "../Global/TableComponent";
import PaginationComponent from "../Global/PaginationComponent";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===== Utilitaires =====
function parseDurationToMinutes(durationStr) {
  let min = 0;
  const h = durationStr.match(/(\d+)h/);
  const m = durationStr.match(/(\d+)min/);
  if (h) min += parseInt(h[1], 10) * 60;
  if (m) min += parseInt(m[1], 10);
  return min;
}
function computeStatus(startDate, duration) {
  const now = new Date();
  const debut = new Date(startDate);
  const minutes = parseDurationToMinutes(duration);
  const fin = new Date(debut.getTime() + minutes * 60000);

  if (now < debut) return "Planifié";
  if (now >= debut && now <= fin) return "En cours";
  if (now > fin) return "Terminé";
  return "Planifié";
}

// ===== Yup Schema =====
const eventSchema = Yup.object().shape({
  title: Yup.string()
    .required("Le titre est requis")
    .min(3, "Minimum 3 caractères")
    .max(100, "Maximum 100 caractères")
    .matches(/^[^<>/]+$/, "Caractères spéciaux non autorisés"),
  description: Yup.string()
    .required("La description est requise")
    .max(500, "Maximum 500 caractères"),
  startDate: Yup.date()
    .typeError("Date invalide")
    .required("La date de début est requise")
    .min(new Date(), "La date de début doit être dans le futur"),
  duration: Yup.string()
    .required("La durée est requise")
    .matches(/^\d+h$|^\d+min$|^\d+h\d+min$/, "Format : 1h, 90min, 2h30min")
    .test("is-positive", "Durée positive requise", value => {
      if (!value) return false;
      let min = 0;
      const h = value.match(/(\d+)h/);
      const m = value.match(/(\d+)min/);
      if (h) min += parseInt(h[1], 10) * 60;
      if (m) min += parseInt(m[1], 10);
      return min > 0 && min <= 1440;
    }),
  location: Yup.string()
    .required("L'emplacement est requis")
    .max(100, "Maximum 100 caractères"),
  types: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().required(),
        name: Yup.string().required()
      })
    )
    .min(1, "Le type d'événement est requis"),
  invited: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().required(),
        fullName: Yup.string().required()
      })
    )
    .required("Au moins un invité est requis")
    .min(1, "Au moins un invité est requis")
    .test("no-duplicates", "Un même employé ne peut être invité plusieurs fois", (arr) => {
      if (!arr) return true;
      const ids = arr.map(e => e._id);
      return ids.length === new Set(ids).size;
    })
    .test("no-self-invite", "Vous ne pouvez pas vous inviter vous-même", function(arr) {
      const { currentUserId } = this.options.context || {};
      if (!arr || !currentUserId) return true;
      return !arr.some(e => e._id === currentUserId);
    })
    .test("max-length", "Pas plus de 100 invités", (arr) => !arr || arr.length <= 100)
});

const PAGE_SIZE = 10; // employés/page

export default function EventFormModal({
  open, onClose, onSave, onDelete, event, eventTypes, employes, loadingEmployes, currentUserId
}) {
  // -- RHF
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(eventSchema, { context: { currentUserId } }),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      duration: "",
      location: "",
      types: [],
      invited: [],
    }
  });

  // -- Pagination & search state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // -- Remise à zéro au changement d'event/modal
  useEffect(() => {
    if (open) {
      let selectedType = [];
      if (event?.types && eventTypes && event.types.length > 0) {
        if (event.types[0].name) {
          selectedType = [event.types[0]];
        } else {
          const found = eventTypes.find(et => et._id === (event.types[0]._id || event.types[0]));
          if (found) selectedType = [found];
        }
      } else if (event?.eventType && eventTypes) {
        const found = eventTypes.find(et => et._id === (event.eventType._id || event.eventType));
        if (found) selectedType = [found];
      }
      reset({
        title: event?.title || "",
        description: event?.description || "",
        startDate: event?.startDate ? new Date(event?.startDate) : new Date(),
        duration: event?.duration || "",
        location: event?.location || "",
        types: selectedType,
        invited: event?.invited || [],
      });
      setPage(1);
      setSearch("");
    }
  }, [open, event, eventTypes, reset]);

  // -- Selection d'invités
  const invited = watch("invited");

  // -- Recherche/filtrage employés
  const filteredEmployes = useMemo(() => {
    if (!employes) return [];
    let arr = employes;
    if (search) {
      arr = arr.filter((emp) =>
        emp.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Ne pas afficher l'utilisateur courant
    return arr.filter(emp => emp._id !== currentUserId);
  }, [employes, search, currentUserId]);

  // -- Pagination employés
  const paginatedEmployes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEmployes.slice(start, start + PAGE_SIZE);
  }, [filteredEmployes, page]);

  const pageCount = Math.ceil(filteredEmployes.length / PAGE_SIZE);

  // -- Fonction pour cocher/décocher
  const toggleInvite = (emp) => {
    if (invited.some(i => i._id === emp._id)) {
      setValue("invited", invited.filter(i => i._id !== emp._id));
    } else {
      setValue("invited", [...invited, emp]);
    }
  };

  // -- Submit custom pour calculer le statut
  const handleValidSubmit = (data) => {
    const statutAuto = computeStatus(data.startDate, data.duration);
    onSave({
      id: event?.id || event?._id || undefined,
      ...data,
      status: statutAuto,
    });
    toast.success("Événement enregistré avec succès !");
  };

  const handleInvalidSubmit = (errs) => {
    const first = Object.values(errs)[0];
    if (first?.message) toast.error(first.message);
  };

  // -- Rendu principal
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer />
      <ModelComponent
        open={open}
        handleClose={onClose}
        // ⬇️ Augmente la largeur max ici
        maxWidth="md"
        title={event?.id || event?._id ? 'Modifier un événement' : 'Ajouter un événement'}
        icon={<SaveOutlined />}
      >
        <form onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Titre *"
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description *"
                fullWidth
                multiline
                minRows={3}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    label="Date de début *"
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message}
                        required
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Durée (ex: 1h, 90min, 2h30min) *"
                fullWidth
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Emplacement *"
                fullWidth
                {...register("location")}
                error={!!errors.location}
                helperText={errors.location?.message}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="types"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Type d'événement *"
                    SelectProps={{
                      native: true,
                    }}
                    fullWidth
                    value={field.value[0]?._id || ""}
                    onChange={e => {
                      const selected = eventTypes.find(t => t._id === e.target.value);
                      field.onChange(selected ? [selected] : []);
                    }}
                    error={!!errors.types}
                    helperText={errors.types?.message}
                    required
                  >
                    <option value="" disabled>Choisir un type</option>
                    {(eventTypes || []).map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* ==== Zone sélection employés ==== */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Inviter des employés *</Typography>
              <TextField
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher par nom"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TableComponent
                columns={[
                  {
                    id: 'select',
                    label: '',
                    render: (row) => (
                      <Checkbox
                        checked={!!invited.find(i => i._id === row._id)}
                        onChange={() => toggleInvite(row)}
                        color="primary"
                      />
                    )
                  },
                  {
                    id: 'fullName',
                    label: 'Nom',
                    render: (row) => (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                          {row.fullName?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography>{row.fullName}</Typography>
                      </Box>
                    )
                  },
                  {
                    id: 'email',
                    label: 'Email'
                  }
                ]}
                rows={paginatedEmployes}
              />
              <PaginationComponent
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                size="small"
              />
              {errors.invited && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.invited.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            {(event?.id || event?._id) && (
              <ButtonComponent
                onClick={() => onDelete(event.id || event._id)}
                text="Supprimer"
                icon={<DeleteOutline />}
                color="error"
              />
            )}
            <ButtonComponent
              onClick={onClose}
              text="Annuler"
              icon={<CloseOutlined />}
              color="secondary"
            />
            <ButtonComponent
              type="submit"
              text="Enregistrer"
              icon={<SaveOutlined />}
            />
          </Stack>
        </form>
      </ModelComponent>
    </LocalizationProvider>
  );
}
