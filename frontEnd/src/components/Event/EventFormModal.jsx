import React, { useEffect, useState } from "react";
import {
  Box, Grid, TextField, Stack, MenuItem, Button
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ModelComponent from "../Global/ModelComponent";
import StepperComponent from "../Global/StepperComponent";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import { SaveOutlined } from "@mui/icons-material";

const steps = [
  "Détails de l'événement",
  "Informations avancées",
  "Invités"
];

const eventStepSchemas = [
  Yup.object().shape({
    title: Yup.string().required("Le titre est requis").min(3).max(100)
      .matches(/^[^<>/]+$/, "Caractères spéciaux non autorisés"),
    description: Yup.string().required("La description est requise").max(500),
  }),
  Yup.object().shape({
    startDate: Yup.date().typeError("Date invalide").required("La date de début est requise")
      .min(new Date(), "La date de début doit être dans le futur"),
    duration: Yup.string().required("La durée est requise")
      .matches(/^\d+h$|^\d+min$|^\d+h\d+min$/, "Format : 1h, 90min, 2h30min")
      .test("is-positive", "Durée positive requise", value => {
        if (!value) return false;
        let min = 0;
        const h = value.match(/(\d+)h/);
        const m = value.match(/(\d+)min/);
        if (h) min += parseInt(h[1], 10) * 60;
        if (m) min += parseInt(m[1], 10);
        return min > 0 && min <= 1440;
      }),
    location: Yup.string().required("L'emplacement est requis").max(100),
    types: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required(),
        name: Yup.string().required()
      })
    ).min(1, "Le type d'événement est requis"),
  }),
  Yup.object().shape({
    invited: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required(),
        fullName: Yup.string().required()
      })
    ).required("Au moins un invité est requis")
     .min(1, "Au moins un invité est requis")
     .test("no-duplicates", "Un même employé ne peut être invité plusieurs fois", arr => {
        if (!arr) return true;
        const ids = arr.map(e => e._id);
        return ids.length === new Set(ids).size;
      }),
  }),
];

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
  return "Terminé";
}

export default function EventFormModal({
  open, onClose, onSave, event, eventTypes, employes, currentUserId, isEditMode
}) {
  const [activeStep, setActiveStep] = useState(0);

  const {
    register, control, handleSubmit, reset, watch, formState: { errors }
  } = useForm({
    resolver: yupResolver(eventStepSchemas[activeStep], { context: { currentUserId } }),
    defaultValues: {
      title: "", description: "", startDate: new Date(),
      duration: "", location: "", types: [], invited: []
    }
  });

  // FIX ICI : reset uniquement à l'ouverture
  useEffect(() => {
    if (open) {
      let initialTypes = [];
      if (Array.isArray(event?.types)) {
        initialTypes = event.types
          .map(t => typeof t === "string" ? eventTypes.find(et => et._id === t) : t)
          .filter(Boolean);
      }
      let initialInvited = Array.isArray(event?.invited) ? event.invited : [];
      reset({
        title:       event?.title       || "",
        description: event?.description || "",
        startDate:   event?.startDate   ? new Date(event.startDate) : new Date(),
        duration:    event?.duration    || "",
        location:    event?.location    || "",
        types:       initialTypes,
        invited:     initialInvited,
      });
      setActiveStep(0);
      console.log("[Modal] RESET & OPEN - isEditMode:", isEditMode, "event:", event);
    }
  }, [open, reset]); // PAS de event ni eventTypes ici

  const handleNext = async () => {
    console.log("[handleNext] Etape actuelle:", activeStep, "isEditMode:", isEditMode);
    try {
      await eventStepSchemas[activeStep].validate(watch(), { abortEarly: false });
      setActiveStep(s => {
        console.log("[handleNext] Passe à l'étape:", s + 1);
        return Math.min(s + 1, steps.length - 1);
      });
    } catch (e) {
      if (e.inner) {
        e.inner.forEach(err => {
          console.warn("[handleNext] Validation error:", err.path, err.message);
        });
      }
    }
  };

  const handleBack = () => {
    setActiveStep(s => {
      console.log("[handleBack] Retour étape:", s - 1);
      return Math.max(s - 1, 0);
    });
  };

  const onFinalSubmit = data => {
    const status = computeStatus(data.startDate, data.duration);
    const payload = { ...data, status };
    if (isEditMode && event && (event._id || event.id)) {
      payload._id = event._id || event.id;
      payload.id = event._id || event.id;
    }
    console.log("[onFinalSubmit] SUBMIT! data:", data, "payload:", payload, "activeStep:", activeStep);
    onSave(payload);
    onClose();
  };

  const getStepContent = step => {
    switch (step) {
      case 0: return (
        <>
          <TextField
            label="Titre *" fullWidth {...register("title")}
            error={!!errors.title} helperText={errors.title?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description *" fullWidth multiline minRows={3}
            {...register("description")}
            error={!!errors.description} helperText={errors.description?.message}
          />
        </>
      );
      case 1: return (
        <>
          <Controller name="startDate" control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Date de début *" {...field}
                disabled={isEditMode}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: isEditMode
                      ? "Modification de la date impossible lors de l'édition"
                      : errors.startDate?.message,
                    sx: { mb: 2 }
                  }
                }}
              />
            )}
          />
          <TextField
            label="Durée *" fullWidth {...register("duration")}
            error={!!errors.duration} helperText={isEditMode
              ? "Modification de la durée impossible lors de l'édition"
              : errors.duration?.message}
            sx={{ mb: 2 }}
            disabled={isEditMode}
          />
          <TextField
            label="Emplacement *" fullWidth {...register("location")}
            error={!!errors.location} helperText={isEditMode
              ? "Modification de la salle impossible lors de l'édition"
              : errors.location?.message}
            sx={{ mb: 2 }}
            disabled={isEditMode}
          />
          <Controller
            name="types"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Type d'événement *"
                fullWidth
                value={field.value[0]?._id || ""}
                onChange={e => {
                  const selected = eventTypes.find(t => t._id === e.target.value);
                  field.onChange(selected ? [selected] : []);
                }}
                error={!!errors.types}
                helperText={errors.types?.message || ""}
                required
              >
                <MenuItem value="" disabled />
                {(eventTypes || []).map(t => (
                  <MenuItem key={t._id} value={t._id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </>
      );
      case 2: return (
        <Controller name="invited" control={control}
          render={({ field }) => (
            <Autocomplete multiple
              options={employes.filter(e => e._id !== currentUserId)}
              getOptionLabel={o => o.fullName}
              value={field.value}
              onChange={(_, v) => field.onChange(v)}
              renderInput={params => (
                <TextField {...params} label="Invités *" fullWidth
                  error={!!errors.invited} helperText={errors.invited?.message}
                />
              )}
              filterSelectedOptions
            />
          )}
        />
      );
      default: return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer position="top-right" autoClose={3000} />
      <ModelComponent open={open} handleClose={onClose}
        title={event?._id ? "Modifier un événement" : "Ajouter un événement"}
        icon={<SaveOutlined />}
      >
        <Box sx={{ my: 2 }}>
          <StepperComponent steps={steps} activeStep={activeStep} />
        </Box>
        <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
          <Grid container spacing={2} direction="column">
            <Grid item>{getStepContent(activeStep)}</Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
  {activeStep > 0 &&
    <Button variant="outlined" color="primary" onClick={handleBack}>
      Retour
    </Button>
  }
  {activeStep < steps.length - 1
    ? <Button variant="contained" color="primary" type="button" onClick={handleNext}>
        Suivant
      </Button>
    : <Button variant="contained" color="primary" type="button" onClick={handleSubmit(onFinalSubmit)}>
        Enregistrer
      </Button>
  }
</Stack>

        </form>
      </ModelComponent>
    </LocalizationProvider>
  );
}
