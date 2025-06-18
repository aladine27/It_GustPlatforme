import React, { useEffect } from "react";
import {
  Box, Grid, TextField, Chip, Autocomplete, Stack
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CloseOutlined, DeleteOutline, SaveOutlined } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  return "Planifié"; // fallback
}

export default function EventFormModal({
  open, onClose, onSave, onDelete, event, eventTypes, employes, loadingEmployes, currentUserId
}) {
  // --- SCHEMA YUP ---
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
        return min > 0 && min <= 1440; // 24h max
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
      .test("no-self-invite", "Vous ne pouvez pas vous inviter vous-même", (arr) => {
        if (!arr || !currentUserId) return true;
        return !arr.some(e => e._id === currentUserId);
      })
      .test("max-length", "Pas plus de 100 invités", (arr) => !arr || arr.length <= 100)
      .test("valid-employees", "Un invité n'existe pas", function(arr) {
        if (!arr) return true;
        const ids = (employes || []).map(e => e._id);
        return arr.every(u => ids.includes(u._id));
      })
  });

  // --- HOOK FORM ---
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(eventSchema),
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

  useEffect(() => {
    if (open) {
      // Synchronisation du type sélectionné avec la liste complète des types
      let selectedType = [];
      if (event?.types && eventTypes && event.types.length > 0) {
        // si event.types contient déjà un objet complet, parfait
        if (event.types[0].name) {
          selectedType = [event.types[0]];
        } else {
          // sinon, c'est un id : retrouve l'objet complet dans eventTypes
          const found = eventTypes.find(et => et._id === (event.types[0]._id || event.types[0]));
          if (found) selectedType = [found];
        }
      } else if (event?.eventType && eventTypes) {
        // compatibilité : eventType peut être utilisé dans certains cas
        const found = eventTypes.find(et => et._id === (event.eventType._id || event.eventType));
        if (found) selectedType = [found];
      }
      reset({
        title: event?.title || "",
        description: event?.description || "",
        startDate: event?.startDate ? new Date(event?.startDate) : new Date(),
        duration: event?.duration || "",
        location: event?.location || "",
        types: event?.types || (event?.eventType ? [event.eventType] : []), 
        invited: event?.invited || [],
      });
    }
  }, [open, event, eventTypes, reset]);
  

  // --- SUBMIT ---
  const onSubmit = (data) => {
    const statutAuto = computeStatus(data.startDate, data.duration);

    onSave({
      id: event?.id || event?._id || undefined,
      ...data,
      status: statutAuto,
    });
    toast.success("Événement enregistré avec succès !");
  };

  const onInvalid = (errs) => {
    const first = Object.values(errs)[0];
    if (first?.message) toast.error(first.message);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer />
      <ModelComponent
        open={open}
        handleClose={onClose}
        title={event?.id || event?._id ? 'Modifier un événement' : 'Ajouter un événement'}
        icon={<SaveOutlined />}
      >
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
      <Autocomplete
        options={eventTypes || []}
        getOptionLabel={(option) => option.name}
        value={field.value[0] || null}
        isOptionEqualToValue={(opt, val) => opt._id === val._id}
        onChange={(_, newValue) => field.onChange(newValue ? [newValue] : [])}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Type d'événement *"
            placeholder="Sélectionner"
            error={!!errors.types}
            helperText={errors.types?.message}
            required
          />
        )}
      />
    )}
  />
</Grid>

            <Grid item xs={12}>
              <Controller
                name="invited"
                control={control}
                render={({ field }) => {
                  const filteredEmployes = (employes || []).filter(
                    emp =>
                      !field.value.some(inv => inv._id === emp._id) &&
                      emp._id !== currentUserId
                  );
                  return (
                    <Autocomplete
                      multiple
                      options={filteredEmployes}
                      getOptionLabel={(option) => option.fullName}
                      value={field.value}
                      isOptionEqualToValue={(opt, val) => opt._id === val._id}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      loading={loadingEmployes}
                      renderTags={(value, getTagProps) =>
                        value.map((user, index) => (
                          <Chip key={user._id} label={user.fullName} color="secondary" {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Inviter des employés *"
                          placeholder="Rechercher un employé"
                          error={!!errors.invited}
                          helperText={errors.invited?.message}
                          required
                        />
                      )}
                    />
                  );
                }}
              />
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