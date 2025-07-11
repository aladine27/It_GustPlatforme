import React, { useEffect, useState } from "react";
import {
  Box, TextField, Typography, Button, Grid
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

// Step titles
const steps = [
  "Infos générales",
  "Dates",
  "Fichier"
];

// Validation schemas par étape
const projectStepSchemas = [
  Yup.object({
    title: Yup.string().required("Le titre est requis"),
    description: Yup.string().required("La description est requise"),
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
 
];

function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CreateProjectModal({ open, handleClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Utilisateur connecté (adapter selon ton state redux)
  const user = useSelector(state => state.user.CurrentUser?.user || state.user.CurrentUser) || {};
  const userId = user?._id;

  const [activeStep, setActiveStep] = useState(0);

  // react-hook-form setup
  const {
    control, register, handleSubmit, reset, trigger, watch, setValue, formState: { errors }
  } = useForm({
    resolver: yupResolver(projectStepSchemas[activeStep]),
    defaultValues: {
      title: "",
      description: "",
      startDate: todayDate(),
      endDate: null,
   
    }
  });

  // Reset form à chaque ouverture modale
  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
        startDate: todayDate(),
        endDate: null,
        file: null,
      });
      setActiveStep(0);
    }
  }, [open, reset]);

  // Logs pour debug
  useEffect(() => {
    console.log("[CreateProjectModal] Watched values:", watch());
  });

  // Étape suivante
  const handleNext = async () => {
    const isValid = await trigger();
    console.log("[CreateProjectModal] Step:", activeStep, "Valid?", isValid, "Errors:", errors);
    if (isValid) setActiveStep(s => Math.min(s + 1, steps.length - 1));
    else toast.error("Erreur de validation !");
  };

  // Étape précédente
  const handleBack = () => setActiveStep(s => Math.max(s - 1, 0));

  // Soumission finale
  const onFinalSubmit = async (data) => {
    try {
      if (!userId) {
        toast.error("Utilisateur non détecté !");
        return;
      }
      // Calcul duration + status
      let duration = "";
      if (data.startDate && data.endDate) {
        const diff = differenceInCalendarDays(new Date(data.endDate), new Date(data.startDate)) + 1;
        duration = diff > 1 ? `${diff} jours` : "1 jour";
      }
      let status = "Ongoing";
      const now = todayDate();
      if (data.endDate && new Date(data.endDate) < now) status = "Completed";
      else if (data.startDate && new Date(data.startDate) > now) status = "Planned";

      // FormData pour envoi fichier
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate?.toISOString());
      formData.append("endDate", data.endDate?.toISOString());
      formData.append("duration", duration);
      formData.append("status", status);
      formData.append("user", userId); // Ajout du user obligatoire
      formData.append("file", data.file);

      console.log("==[CREATE PROJECT]== FormData envoyé", { ...data, user: userId, duration, status });

      const actionResult = await dispatch(createProject(formData));
      console.log("==[CREATE PROJECT]== Résultat action", actionResult);

      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de la création.");
        return;
      }
      toast.success(t("Projet créé avec succès"));
      handleClose();
      reset();
      setActiveStep(0);
    } catch (e) {
      toast.error("Erreur interne ! Voir console.");
      console.log("==[CREATE PROJECT]== Erreur catch:", e);
    }
  };

  // Step content
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={t("Titre") + " *"}
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />
            <TextField
              label={t("Description") + " *"}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              multiline
              minRows={2}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t("Date de début") + " *"}
                    value={field.value}
                    onChange={val => field.onChange(val)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message
                      }
                    }}
                    format="dd/MM/yyyy"
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
                    value={field.value}
                    onChange={val => field.onChange(val)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message
                      }
                    }}
                    format="dd/MM/yyyy"
                  />
                </LocalizationProvider>
              )}
            />
            {/* Affichage preview durée */}
            {watch("startDate") && watch("endDate") && (
              <Typography variant="body2" color="primary" mt={1}>
                {t("Durée calculée")}:{" "}
                <strong>
                  {differenceInCalendarDays(new Date(watch("endDate")), new Date(watch("startDate"))) + 1}{" "}
                  {(differenceInCalendarDays(new Date(watch("endDate")), new Date(watch("startDate"))) + 1) > 1 ? t("jours") : t("jour")}
                </strong>
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <>
                  <Button
                    variant="outlined"
                    component="label"
                    color={!!errors.file ? "error" : "primary"}
                  >
                    {watch("file") ? t("Changer le fichier") : t("Importer un fichier")}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      hidden
                      onChange={e => {
                        field.onChange(e.target.files[0]);
                      }}
                    />
                  </Button>
                  {errors.file && (
                    <Typography color="error" fontSize="0.75rem">{errors.file.message}</Typography>
                  )}
                  {watch("file") && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t("Fichier sélectionné")}: <strong>{watch("file")?.name}</strong>
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
        );
      default:
        return "Étape inconnue";
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <ModelComponent
        open={open}
        handleClose={handleClose}
        title={t("Créer un nouveau projet")}
        icon={<AddCircleOutline />}
      >
        <Box sx={{ mt: 2 }}>
          <StepperComponent steps={steps.map(s => t(s))} activeStep={activeStep} />
          <form
            onSubmit={handleSubmit(onFinalSubmit)}
            noValidate
            style={{ marginTop: 16 }}
          >
            <Grid container spacing={2} direction="column">
              <Grid item>{getStepContent(activeStep)}</Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              {activeStep > 0 && (
                <ButtonComponent
                  onClick={handleBack}
                  text={t("Retour")}
                  icon={<ArrowBack />}
                />
              )}
              {activeStep < steps.length - 1 ? (
                <ButtonComponent
                  onClick={handleNext}
                  text={t("Suivant")}
                  icon={<ArrowForward />}
                  color="primary"
                />
              ) : (
                <ButtonComponent
                  type="submit"
                  text={t("Créer")}
                  icon={<SaveOutlined />}
                  color="primary"
                />
              )}
            </Box>
          </form>
        </Box>
      </ModelComponent>
    </>
  );
}
