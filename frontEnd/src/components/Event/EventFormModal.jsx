// src/components/Event/EventFormModal.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid, TextField, Stack, MenuItem, Button } from "@mui/material";
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

const stepsKeys = ["Détails de l'événement", "Informations avancées", "Invités"];

function parseDurationToMinutes(str){
  let m=0; const h=str?.match(/(\d+)h/); const mi=str?.match(/(\d+)min/);
  if(h) m += +h[1]*60; if(mi) m += +mi[1]; return m;
}
function computeStatus(startDate, duration){
  const now=new Date(), d=new Date(startDate), fin=new Date(d.getTime()+parseDurationToMinutes(duration)*60000);
  if(now<d) return "Planifié";
  if(now>=d && now<=fin) return "En cours";
  return "Terminé";
}

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
      .test("is-positive","Durée positive requise",v=>{
        if(!v) return false; const total=parseDurationToMinutes(v); return total>0 && total<=1440;
      }),
    location: Yup.string().required("L'emplacement est requis").max(100),
    types: Yup.array().of(Yup.object({ _id:Yup.string().required(), name:Yup.string().required() }))
      .min(1, "Le type d'événement est requis"),
  }),
  Yup.object().shape({
    invited: Yup.array().of(Yup.object({ _id:Yup.string().required(), fullName:Yup.string().required() }))
      .required("Au moins un invité est requis")
      .min(1, "Au moins un invité est requis")
      .test("no-duplicates","Un même employé ne peut être invité plusieurs fois", arr=>{
        if(!arr) return true; const ids=arr.map(e=>e._id); return ids.length===new Set(ids).size;
      }),
  }),
];

export default function EventFormModal({
  open, onClose, onSave, event, eventTypes, employes, currentUserId, isEditMode
}) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const resolver = React.useMemo(() => yupResolver(eventStepSchemas[activeStep]), [activeStep]);

  const {
    register, control, handleSubmit, reset, watch, formState:{ errors }, trigger
  } = useForm({
    resolver,
    context: { currentUserId },
    defaultValues: {
      title:"", description:"", startDate:new Date(),
      duration:"", location:"", types:[], invited:[]
    }
  });

  const employesList = React.useMemo(
    () => Array.isArray(employes) ? employes.filter(e => e._id !== currentUserId) : [],
    [employes, currentUserId]
  );

  // reset à l’ouverture (inchangé)
  useEffect(() => {
    if (open) {
      let initialInvited = [];
      if (Array.isArray(event?.invited)) {
        initialInvited = event.invited
          .map(inv => {
            const id = typeof inv === "object" && inv._id ? String(inv._id) : String(inv);
            return employesList.find(e => String(e._id) === id) || inv || null;
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

  const handleNext = async () => { if (await trigger()) setActiveStep(s => Math.min(s+1, stepsKeys.length-1)); };
  const handleBack = () => setActiveStep(s => Math.max(s-1, 0));

  const onFinalSubmit = async (data) => {
    try{
      const status = computeStatus(data.startDate, data.duration);
      const payload = { ...data, status };
      if (isEditMode && event && (event._id || event.id)) {
        payload._id = event._id || event.id;
        payload.id  = event._id || event.id;
      }
      await onSave(payload);
      toast.success(isEditMode ? "Événement modifié avec succès" : "Événement ajouté avec succès");
    }catch(err){
      toast.error("Erreur lors de l'enregistrement de l'événement !");
    }finally{ onClose(); }
  };

  /* =========
   * FIX: calculs liés aux invités sortis de getStepContent
   * — toujours appelés au même ordre -> plus d’erreur de hooks
   * ========= */
  const invitedField = watch("invited");
  const selectedForAuto = React.useMemo(() => {
    if (!Array.isArray(invitedField)) return [];
    return invitedField
      .map(inv => employesList.find(emp => emp._id === (inv?._id || inv)) || inv)
      .filter(Boolean);
  }, [invitedField, employesList]);

  const optionsMerged = React.useMemo(() => {
    const ids = new Set((employesList || []).map(o => o._id));
    const extras = selectedForAuto.filter(v => v && v._id && !ids.has(v._id));
    return [...(employesList || []), ...extras];
  }, [employesList, selectedForAuto]);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
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

      case 1:
        return (
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
                    ampm={false}
                    format="dd/MM/yyyy HH:mm"
                    locale={fr}
                    views={['year','month','day','hours','minutes']}
                    timeSteps={{ hours:1, minutes:5 }}
                    minTime={new Date(0,0,0,0,0)}
                    maxTime={new Date(0,0,0,23,59)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message && t(errors.startDate?.message),
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
              helperText={errors.duration?.message && t(errors.duration?.message)}
              sx={{ mb: 2 }}
              placeholder={t("Ex: 1h, 90min, 2h30min")}
            />
            <TextField
              label={t('Emplacement') + " *"}
              fullWidth
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message && t(errors.location?.message)}
              sx={{ mb: 2 }}
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

      case 2:
        return (
          <Controller
            name="invited"
            control={control}
            render={({ field }) => (
              <Autocomplete
                key={event?._id || 'new'}
                multiple
                options={optionsMerged}
                getOptionLabel={o => o?.fullName || o?.name || ""}
                value={selectedForAuto}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(_, v) => field.onChange(v)}
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
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ToastContainer position="bottom-right" autoClose={3000} />
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
                onClick={e => { e.preventDefault(); handleBack(); }}
                text={t("Retour")}
                icon={<ArrowBack />}
                type="button"
              />
            )}
            {activeStep < stepsKeys.length - 1 ? (
              <ButtonComponent
                onClick={e => { e.preventDefault(); handleNext(); }}
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
