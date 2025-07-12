import React, { useState } from "react";
import {
  Box, TextField, Typography, Button, Grid, Stack
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { ArrowBack, ArrowForward, SaveOutlined, AddCircleOutline } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { createProject } from "../../redux/actions/projectActions";
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
    file: Yup.mixed().nullable() // OPTIONNEL
  })
];

function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CreateProjectModal({ open, handleClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.CurrentUser?.user || state.user.CurrentUser) || {};
  const userId = user?._id;

  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    trigger
  } = useForm({
    resolver: yupResolver(projectStepSchemas[activeStep]),
    defaultValues: {
      title: "",
      description: "",
      startDate: todayDate(),
      endDate: null,
      file: null,
    }
  });

  // RESET seulement à la fermeture
  const closeAndReset = () => {
    reset({
      title: "",
      description: "",
      startDate: todayDate(),
      endDate: null,
      file: null,
    });
    setActiveStep(0);
    handleClose();
  };

  // Étapes
  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Erreur de validation !");
      return;
    }
    setActiveStep((s) => Math.min(s + 1, stepsKeys.length - 1));
  };

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  // Soumission finale
  const onFinalSubmit = async (data) => {
    try {
      if (!userId) {
        toast.error("Utilisateur non détecté !");
        return;
      }

      let duration = "";
      if (data.startDate && data.endDate) {
        const diff = differenceInCalendarDays(new Date(data.endDate), new Date(data.startDate)) + 1;
        duration = diff > 1 ? `${diff} jours` : "1 jour";
      }
      let status = "Ongoing";
      const now = todayDate();
      if (data.endDate && new Date(data.endDate) < now) status = "Completed";
      else if (data.startDate && new Date(data.startDate) > now) status = "Planned";

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate?.toISOString());
      formData.append("endDate", data.endDate?.toISOString());
      formData.append("duration", duration);
      formData.append("status", status);
      formData.append("user", userId);
      if (data.file) formData.append("file", data.file);

      const actionResult = await dispatch(createProject(formData));
      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de la création.");
        return; // Ne ferme PAS en cas d’erreur
      }
      toast.success(t("Projet créé avec succès"));
      closeAndReset(); // Ferme et reset seulement en cas de succès
    } catch (e) {
      toast.error("Erreur interne !");
      // Ne ferme pas la modale
    }
  };

  // Formulaire par étape
  const getStepContent = step => {
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
            placeholder={t("Ex: Développement application mobile")}
          />
          <TextField
            label={t("Description") + " *"}
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message && t(errors.description?.message)}
            placeholder={t("Description détaillée du projet...")}
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
                      sx: { mb: 2 },
                      placeholder: t("Choisissez la date de début")
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
                      sx: { mb: 2 },
                      placeholder: t("Choisissez la date de fin")
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
        handleClose={closeAndReset}
        title={t("Créer un nouveau projet")}
        icon={<AddCircleOutline />}
      >
        <Box sx={{ my: 2 }}>
          <StepperComponent steps={stepsKeys.map(label => t(label))} activeStep={activeStep} />
        </Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeStep === stepsKeys.length - 1) {
              handleSubmit(onFinalSubmit)(e);
            } else {
              handleNext();
            }
          }}
          noValidate
        >
          <Grid container spacing={2} direction="column">
            <Grid item>{getStepContent(activeStep)}</Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            {activeStep > 0 &&
              <ButtonComponent
                onClick={handleBack}
                text={t("Retour")}
                icon={<ArrowBack />}
              />
            }
            {activeStep < stepsKeys.length - 1
              ? <ButtonComponent
                text={t("Suivant")}
                icon={<ArrowForward />}
                color="primary"
              />
              : <Button variant="contained" color="primary" type="submit">
                <SaveOutlined sx={{ mr: 1 }} />
                {t("Créer")}
              </Button>
            }
          </Stack>
        </form>
      </ModelComponent>
    </>
  );
}
