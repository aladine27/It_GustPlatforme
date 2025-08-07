import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, TextField, MenuItem, Stack, Button
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import { ArrowBack, ArrowForward, SaveOutlined, WorkOutline } from "@mui/icons-material";
import { ButtonComponent } from "../Global/ButtonComponent";
import ModelComponent from "../Global/ModelComponent";
import StepperComponent from "../Global/StepperComponent";

// Steps titles
const stepsKeys = [
  "Informations principales",
  "Détails de l'offre",
  "Catégorie"
];

// Select options
const locations = [
  { value: "Tunis", label: "Tunis" },
  { value: "Sfax", label: "Sfax" },
  { value: "Sousse", label: "Sousse" }
];
const statusList = [
  { value: "open", label: "Ouverte" },
  { value: "closed", label: "Fermée" }
];
const typeList = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" }
];

// Validation schemas
const jobOfferSchemas = [
  Yup.object().shape({
    title: Yup.string().required("Titre requis"),
    description: Yup.string().required("Description requise"),
    requirements: Yup.string().required("Compétences requises"),
  }),
  Yup.object().shape({
    closingDate: Yup.date().typeError("Date de clôture requise").required("Date de clôture requise").min(new Date(), "Date dans le futur"),
    salaryRange: Yup.number()
      .typeError("Le salaire est requis")
      .required("Le salaire est requis")
      .positive("Le salaire doit être positif"),
    location: Yup.string().required("Lieu requis"),
    status: Yup.string().required("Statut requis"),
    process: Yup.string().required("Processus de recrutement requis"),
    type: Yup.string().required("Type requis"),
  }),
  Yup.object().shape({
    jobCategory: Yup.string().required("Catégorie requise"),
  }),
];

export default function CreateJobOfferModal({
  open,
  handleClose,
  jobCategories,
  userId,
  onSubmit // à connecter à ton redux ou API
}) {
  const [activeStep, setActiveStep] = useState(0);

  const resolver = useMemo(
    () => yupResolver(jobOfferSchemas[activeStep]),
    [activeStep]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    trigger,
    watch,
  } = useForm({
    resolver,
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      closingDate: null,
      salaryRange: "",
      location: "",
      status: "open",
      process: "",
      type: "full-time",
      jobCategory: jobCategories?.[0]?._id || "",
    }
  });

  // Reset form on modal open/close
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      reset({
        title: "",
        description: "",
        requirements: "",
        closingDate: null,
        salaryRange: "",
        location: "",
        status: "open",
        process: "",
        type: "full-time",
        jobCategory: jobCategories?.[0]?._id || "",
      });
    }
  }, [open, reset, jobCategories]);

  // Correction du select value pour éviter warning
  useEffect(() => {
    if (!watch("jobCategory") && jobCategories?.length > 0) {
      setValue("jobCategory", jobCategories[0]._id);
    }
  }, [jobCategories, watch, setValue]);

  // Étape suivante/précédente
  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) setActiveStep((s) => Math.min(s + 1, stepsKeys.length - 1));
  };
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  // Soumission finale
  const onFinalSubmit = async (data) => {
    if (!userId) {
      toast.error("Utilisateur non authentifié !");
      return;
    }
    try {
      const payload = {
        ...data,
        salaryRange: Number(data.salaryRange),
        postedDate: new Date().toISOString(),
        user: userId,
      };
      await (onSubmit ? onSubmit(payload) : Promise.resolve());
      handleClose();
      toast.success("Offre créée !");
    } catch (err) {
      toast.error("Erreur lors de la création");
    }
  };

  // UI pour chaque étape
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Titre"
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={2}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Compétences requises"
                fullWidth
                multiline
                minRows={2}
                {...register("requirements")}
                error={!!errors.requirements}
                helperText={errors.requirements?.message}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="closingDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <DatePicker
                      label="Date de clôture"
                      value={field.value}
                      onChange={field.onChange}
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.closingDate,
                          helperText: errors.closingDate?.message,
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salaire"
                type="number"
                fullWidth
                {...register("salaryRange", { valueAsNumber: true })}
                error={!!errors.salaryRange}
                helperText={errors.salaryRange?.message}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Lieu"
                fullWidth
                {...register("location")}
                error={!!errors.location}
                helperText={errors.location?.message}
              >
                {locations.map(loc => (
                  <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Statut"
                fullWidth
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                {statusList.map(item => (
                  <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Processus de recrutement"
                fullWidth
                {...register("process")}
                error={!!errors.process}
                helperText={errors.process?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Type"
                fullWidth
                {...register("type")}
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {typeList.map(item => (
                  <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Catégorie"
                fullWidth
                {...register("jobCategory")}
                error={!!errors.jobCategory}
                helperText={errors.jobCategory?.message}
                value={watch("jobCategory") || ""}
                onChange={e => setValue("jobCategory", e.target.value)}
              >
                {jobCategories?.length
                  ? jobCategories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))
                  : <MenuItem value="">Aucune catégorie</MenuItem>
                }
              </TextField>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <ToastContainer position="top-right" autoClose={3000} />
      <ModelComponent open={open} handleClose={handleClose}
        title="Créer une offre d'emploi"
        icon={<WorkOutline />}
      >
        <Box sx={{ my: 2 }}>
          <StepperComponent steps={stepsKeys} activeStep={activeStep} />
        </Box>
        <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
          <Grid container spacing={2} direction="column">
            <Grid item>{getStepContent(activeStep)}</Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
            {activeStep > 0 && (
              <ButtonComponent
                onClick={e => { e.preventDefault(); handleBack(); }}
                text="Retour"
                icon={<ArrowBack />}
                color="inherit"
                type="button"
              />
            )}
            {activeStep < stepsKeys.length - 1 ? (
              <ButtonComponent
                onClick={e => { e.preventDefault(); handleNext(); }}
                text="Suivant"
                icon={<ArrowForward />}
                color="primary"
                type="button"
              />
            ) : (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<SaveOutlined />}
              >
                Créer
              </Button>
            )}
          </Stack>
        </form>
      </ModelComponent>
    </LocalizationProvider>
  );
}
