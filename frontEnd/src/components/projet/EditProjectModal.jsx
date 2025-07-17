import React, { useState, useEffect, useMemo } from "react";
import {
  Box, TextField, Typography, Button, Grid, Stack
} from "@mui/material";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { ArrowBack, ArrowForward, SaveOutlined, EditOutlined } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { updateProject } from "../../redux/actions/projectActions";
import ModelComponent from "../Global/ModelComponent";
import StepperComponent from "../Global/StepperComponent";
import { ButtonComponent } from "../Global/ButtonComponent";
import { useTranslation } from "react-i18next";

const stepsKeys = [
  "Infos générales",
  "Dates",
  "Fichier"
];

const projectStepSchemas = [
  Yup.object({
    title: Yup.string().required("Le titre est requis").min(3).max(100),
    description: Yup.string().required("La description est requise").max(500),
  }),
  Yup.object({
    startDate: Yup.date()
      .typeError("Date de début invalide")
      .required("Date de début requise"),
    endDate: Yup.date()
      .typeError("Date de fin invalide")
      .required("Date de fin requise")
      .min(Yup.ref("startDate"), "La date de fin doit être après la date de début"),
  }),
  Yup.object({
    file: Yup.mixed().nullable()
  })
];

function toDateOrNull(d) {
  if (!d) return null;
  return typeof d === "string" ? new Date(d) : d;
}

export default function EditProjectModal({ open, handleClose, project }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);


  const resolver = useMemo(() => yupResolver(projectStepSchemas[activeStep]), [activeStep]);

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
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      startDate: toDateOrNull(project?.startDate) || null,
      endDate: toDateOrNull(project?.endDate) || null,
      file: null,
    }
  });

  // Reset à chaque ouverture ou changement projet
  useEffect(() => {
    if (project && open) {
      reset({
        title: project.title || "",
        description: project.description || "",
        startDate: toDateOrNull(project.startDate) || null,
        endDate: toDateOrNull(project.endDate) || null,
        file: null,
      });
      setActiveStep(0);
    }
  }, [project, open, reset]);

  // Navigation Next (validation step)
  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) {
      toast.error("Erreur de validation !");
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, stepsKeys.length - 1));
  };


  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Soumission finale
  const onFinalSubmit = async (data) => {
    try {
      let duration = "";
      if (data.startDate && data.endDate) {
        const diff = differenceInCalendarDays(new Date(data.endDate), new Date(data.startDate)) + 1;
        duration = diff > 1 ? `${diff} jours` : "1 jour";
      }
      let status = "Ongoing";
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (data.endDate && new Date(data.endDate) < now) status = "Completed";
      else if (data.startDate && new Date(data.startDate) > now) status = "Planned";

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate?.toISOString());
      formData.append("endDate", data.endDate?.toISOString());
      formData.append("duration", duration);
      formData.append("status", status);
      if (data.file) formData.append("file", data.file);

      const actionResult = await dispatch(updateProject({ id: project._id, updateData: formData }));
      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de la modification.");
        return;
      }
      toast.success(t("Projet modifié avec succès"));
      handleClose();
    } catch (e) {
      toast.error("Erreur interne !");
    }
  };

  // Contenu dynamique par étape
  const getStepContent = (step) => {
    switch (step) {
      case 0: return (
        <>
          <TextField
            label={t("Titre") + " *"}
            fullWidth
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message && t(errors.title?.message)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t("Description") + " *"}
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message && t(errors.description?.message)}
          />
        </>
      );
      case 1: return (
        <>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("Date de début") + " *"}
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message && t(errors.startDate?.message),
                      sx: { mb: 2 }
                    }
                  }}
                  format="dd/MM/yyyy"
                  onChange={val => field.onChange(val)}
                />
              </LocalizationProvider>
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("Date de fin") + " *"}
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message && t(errors.endDate?.message),
                      sx: { mb: 2 }
                    }
                  }}
                  format="dd/MM/yyyy"
                  onChange={val => field.onChange(val)}
                />
              </LocalizationProvider>
            )}
          />
          {watch("startDate") && watch("endDate") && (
            <Typography variant="body2" color="primary" mt={1}>
              {t("Durée calculée")}:{" "}
              <strong>
                {differenceInCalendarDays(new Date(watch("endDate")), new Date(watch("startDate"))) + 1}{" "}
                {(differenceInCalendarDays(new Date(watch("endDate")), new Date(watch("startDate"))) + 1) > 1 ? t("jours") : t("jour")}
              </strong>
            </Typography>
          )}
        </>
      );
      case 2: return (
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <>
              <Button
                variant="outlined"
                component="label"
                color={!!errors.file ? "error" : "primary"}
                fullWidth
                sx={{ mb: 2 }}
              >
                {watch("file") ? t("Changer le fichier") : t("Importer un fichier")}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  hidden
                  onChange={e => field.onChange(e.target.files[0])}
                />
              </Button>
              {errors.file && (
                <Typography color="error" fontSize="0.75rem" sx={{ mb: 1 }}>
                  {errors.file.message}
                </Typography>
              )}
              {watch("file") && (
                <Typography variant="body2" color="text.secondary">
                  {t("Fichier sélectionné")}: <strong>{watch("file")?.name}</strong>
                </Typography>
              )}
            </>
          )}
        />
      );
      default: return null;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <ModelComponent
        open={open}
        handleClose={handleClose}
        title={t("Modifier le projet")}
        icon={<EditOutlined />}
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
                text={t("Suivant")}
                icon={<ArrowForward />}
                color="primary"
                type="button"
              />
            ) : (
              <Button variant="contained" color="primary" type="submit">
                <SaveOutlined sx={{ mr: 1 }} />
                {t("Enregistrer")}
              </Button>
            )}
          </Stack>
        </form>
      </ModelComponent>
    </>
  );
}
