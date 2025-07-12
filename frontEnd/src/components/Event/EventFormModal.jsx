import React, { useEffect, useState } from "react";
import {
  Box, Grid, TextField, Stack, MenuItem, Button
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import ModelComponent from "../Global/ModelComponent";
import StepperComponent from "../Global/StepperComponent";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import { ArrowBack, ArrowForward, SaveOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ButtonComponent } from "../Global/ButtonComponent";


const stepsKeys = [
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
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  // IMPORTANT: employer la bonne façon pour le resolver RHF
  const resolver = React.useMemo(
    () => yupResolver(eventStepSchemas[activeStep]),
    [activeStep]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    trigger
  } = useForm({
    resolver,
    context: { currentUserId },
    defaultValues: {
      title: "", description: "", startDate: new Date(),
      duration: "", location: "", types: [], invited: []
    }
  });

  // Liste filtrée (employés sauf utilisateur courant)
  const employesList = React.useMemo(
    () => Array.isArray(employes) ? employes.filter(e => e._id !== currentUserId) : [],
    [employes, currentUserId]
  );

  // LOG Render + Employés + event.invited
  useEffect(() => {
    console.log("[EventFormModal] Rendered. Props:", { open, event, isEditMode, activeStep });
    if (event && event.invited) {
      console.log("[EventFormModal] event.invited fourni :", event.invited);
    }
    console.log("[EventFormModal] employesList (filtered):", employesList);
  }, [open, event, isEditMode, activeStep, employesList]);

  // RHF : watcher de toutes les valeurs pour debug
  const watchedValues = watch();
  useEffect(() => {
    console.log("[EventFormModal] Watched form values:", watchedValues);
  }, [watchedValues]);

  // Reset du formulaire à l'ouverture du modal
// Reset du formulaire à l'ouverture du modal
useEffect(() => {
  if (open) {
    let initialInvited = [];
    if (Array.isArray(event?.invited)) {
      initialInvited = event.invited
        .map(inv => {
          const id = typeof inv === "object" && inv._id ? String(inv._id) : String(inv);
          const found = employesList.find(e => String(e._id) === id);
          console.log("[DEBUG MATCH] inv:", inv, "id:", id, "matched employe:", found);
          return found || null;
        })
        .filter(Boolean);
    }

    let initialTypes = [];
    if (Array.isArray(event?.types)) {
      initialTypes = event.types
        .map(t => typeof t === "string" ? eventTypes.find(et => et._id === t) : t)
        .filter(Boolean);
    }

    reset({
      title: event?.title || "",
      description: event?.description || "",
      startDate: event?.startDate ? new Date(event.startDate) : new Date(),
      duration: event?.duration || "",
      location: event?.location || "",
      types: initialTypes,
      invited: initialInvited,
    });
    setActiveStep(0);
  }
}, [open, reset, event, eventTypes, employesList]);


  useEffect(() => {
    console.log("[EventFormModal] Active step:", activeStep);
  }, [activeStep]);

  // Stepper: suivant
  const handleNext = async () => {
    console.log("[handleNext] Clicked on Next (step:", activeStep, ")");
    const isValid = await trigger();
    if (isValid) {
      setActiveStep(s => {
        const nextStep = Math.min(s + 1, stepsKeys.length - 1);
        console.log("[handleNext] Go to next step:", nextStep);
        return nextStep;
      });
    }
  };

  // Stepper: retour
  const handleBack = () => {
    console.log("[handleBack] Clicked on Back (step:", activeStep, ")");
    setActiveStep(s => {
      const prevStep = Math.max(s - 1, 0);
      console.log("[handleBack] Go to prev step:", prevStep);
      return prevStep;
    });
  };

  // Soumission finale
  const onFinalSubmit = async (data) => {
    console.log("[onFinalSubmit] Submitting form for", isEditMode ? "modification" : "création");
    try {
      const status = computeStatus(data.startDate, data.duration);
      const payload = { ...data, status };
      if (isEditMode && event && (event._id || event.id)) {
        payload._id = event._id || event.id;
        payload.id = event._id || event.id;
      }
      console.log("[onFinalSubmit] Payload envoyé à onSave():", payload);
      await onSave(payload);
      toast.success(isEditMode ? "Événement modifié avec succès" : "Événement ajouté avec succès");
    } catch (err) {
      console.error("[onFinalSubmit] Erreur lors de l'enregistrement:", err);
      toast.error("Erreur lors de l'enregistrement de l'événement !");
    } finally {
      onClose();
    }
  };

  // Contenu dynamique selon l'étape
  const getStepContent = (step) => {
    console.log("[getStepContent] Rendering content for step:", step, "current errors:", errors);
    switch (step) {
      case 0: return (
        <>
          <TextField
            label={t('Titre') + " *"}
            fullWidth
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message && t(errors.title?.message)}
            sx={{ mb: 2 }}
            placeholder={t("Ex: Réunion trimestrielle, Conférence...")}
          />
          <TextField
            label={t('Description') + " *"}
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message && t(errors.description?.message)}
            placeholder={t("Ex: Réunion de suivi trimestriel, sujets à aborder...")}
          />
        </>
      );
      case 1: return (
        <>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DateTimePicker
                  label={t('Date de début') + " *"}
                  value={field.value}
                  onChange={val => field.onChange(val)}
                  disabled={isEditMode}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                  locale={fr}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: isEditMode
                        ? t("Modification de la date impossible lors de l'édition")
                        : (errors.startDate?.message && t(errors.startDate?.message)),
                      sx: { mb: 2 },
                      placeholder: t("Choisissez la date et l'heure de début"),
                      InputLabelProps: { shrink: true },
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          />
          <TextField
            label={t('Durée') + " *"}
            fullWidth
            {...register("duration")}
            error={!!errors.duration}
            helperText={isEditMode
              ? t("Modification de la durée impossible lors de l'édition")
              : (errors.duration?.message && t(errors.duration?.message))}
            sx={{ mb: 2 }}
            disabled={isEditMode}
            placeholder={t("Ex: 1h, 90min, 2h30min")}
          />
          <TextField
            label={t('Emplacement') + " *"}
            fullWidth
            {...register("location")}
            error={!!errors.location}
            helperText={isEditMode
              ? t("Modification de la salle impossible lors de l'édition")
              : (errors.location?.message && t(errors.location?.message))}
            sx={{ mb: 2 }}
            disabled={isEditMode}
            placeholder={t("Ex: Salle 1, Auditorium...")}
          />
          <Controller
            name="types"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label={t("Type d'événement") + " *"}
                fullWidth
                value={field.value[0]?._id || ""}
                onChange={e => {
                  const selected = (eventTypes || []).find(t => t._id === e.target.value);
                  field.onChange(selected ? [selected] : []);
                }}
                error={!!errors.types}
                helperText={errors.types?.message && t(errors.types?.message)}
                required
                placeholder={t("Sélectionner un type")}
              >
                <MenuItem value="" disabled>{t('Sélectionner')}</MenuItem>
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
      case 2: {
        const fieldValue = watch("invited");
        const selectedInvited = Array.isArray(fieldValue)
          ? fieldValue.map(inv =>
              employesList.find(emp => emp._id === (inv?._id || inv)) || inv
            ).filter(Boolean)
          : [];
        console.log("[Step 2] fieldValue (invited):", fieldValue);
        console.log("[Step 2] selectedInvited (mapped for Autocomplete):", selectedInvited);
        console.log("[Step 2] Available employees:", employesList);

        return (
          <Controller
            name="invited"
            control={control}
            render={({ field }) => {
              const selectedForAuto = Array.isArray(field.value)
                ? field.value.map(inv =>
                    employesList.find(emp => emp._id === (inv?._id || inv)) || inv
                  ).filter(Boolean)
                : [];
              return (
                <Autocomplete
                  multiple
                  options={employesList}
                  getOptionLabel={o => o.fullName}
                  value={selectedForAuto}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(_, v) => {
                    field.onChange(v);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('Invités') + " *"}
                      fullWidth
                      error={!!errors.invited}
                      helperText={errors.invited?.message && t(errors.invited?.message)}
                      placeholder={t("Sélectionner les invités")}
                    />
                  )}
                  filterSelectedOptions
                />
              );
            }}
          />
        );
      }
      default: return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ToastContainer position="top-right" autoClose={3000} />
      <ModelComponent open={open} handleClose={onClose}
        title={event?._id ? t("Modifier un événement") : t("Ajouter un événement")}
        icon={<SaveOutlined />}
      >
        <Box sx={{ my: 2 }}>
          <StepperComponent steps={stepsKeys.map(label => t(label))} activeStep={activeStep} />
        </Box>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (activeStep === stepsKeys.length - 1) {
              handleSubmit(onFinalSubmit)(e);
            }
          }}
          noValidate
        >
          <Grid container spacing={2} direction="column">
            <Grid item>{getStepContent(activeStep)}</Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            {activeStep > 0 && (
              <ButtonComponent
                onClick={e => {
                  e.preventDefault();
                  handleBack();
                }}
                text={t("Retour")}
                icon={<ArrowBack />}
                type="button"
              />
            )}
            {activeStep < stepsKeys.length - 1 ? (
              <ButtonComponent
                onClick={e => {
                  e.preventDefault();
                  handleNext();
                }}
                text={t("next")}
                icon={<ArrowForward />}
                color="primary"
                type="button"
              />
            ) : (
              <Button variant="contained" color="primary" type="submit">
                {t("Enregistrer")}
              </Button>
            )}
          </Stack>
        </form>
      </ModelComponent>
    </LocalizationProvider>
  );
}
