import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllLeaveTypes } from "../../redux/actions/LeaveAction";
import { EventNote } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Validation schema
const validationSchema = Yup.object({
  leaveType: Yup.string().required("Le type de congé est requis"),
  startDate: Yup.date()
    .typeError("Date invalide")
    .required("La date de début est requise"),
  endDate: Yup.date()
    .typeError("Date invalide")
    .required("La date de fin est requise")
    .min(Yup.ref("startDate"), "Date de fin après la date de début"),
  reason: Yup.string().required("Le motif est requis"),
  reasonfile: Yup.mixed()
    .test(
      "fileFormat",
      "Formats acceptés : pdf, jpg, png, jpeg",
      (file) =>
        !file ||
        ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)
    )
    .nullable(),
});

export default function DemandeCongeFormModal({
  open,
  handleClose,
  onSubmit,
  userId,
  leaveBalance,
}) {
  const dispatch = useDispatch();
  const { leaveTypes, loading } = useSelector((state) => state.leaveType);

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    duration: "", // restera calculé, mais pas modifiable
    reason: "",
    reasonfile: null,
  });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState(null);

  // -- GET le type sélectionné & sa limite --
  const selectedType = leaveTypes.find((t) => t._id === form.leaveType);
  const limitDuration = selectedType?.limitDuration
    ? parseInt(selectedType.limitDuration)
    : null;

  // Récupérer les types au chargement modal
  useEffect(() => {
    if (open) {
      dispatch(fetchAllLeaveTypes());
    }
  }, [open, dispatch]);

  // Si on change de type ou de date de début ET qu'il y a une limite, calcule la date de fin auto
  useEffect(() => {
    if (form.startDate && limitDuration) {
      const start = dayjs(form.startDate);
      const end = start.add(limitDuration - 1, "day"); // Limite en jours, jour inclus
      setForm((prev) => ({
        ...prev,
        endDate: end.format("YYYY-MM-DD"),
        duration: limitDuration,
      }));
    } else if (!limitDuration) {
      // Si pas de limite, ne rien toucher
      setForm((prev) => ({
        ...prev,
        // endDate reste libre
        duration:
          prev.startDate && prev.endDate
            ? dayjs(prev.endDate).diff(dayjs(prev.startDate), "day") + 1
            : "",
      }));
    }
  }, [form.startDate, form.leaveType, leaveTypes, limitDuration, form.endDate]);

  // Reset form
  const resetForm = () => {
    setForm({
      leaveType: "",
      startDate: "",
      endDate: "",
      duration: "",
      reason: "",
      reasonfile: null,
    });
    setErrors({});
    setFileName(null);
  };

  // Handle changement input
  const handleChange = (field) => (e) => {
    let value =
      field === "reasonfile"
        ? e.target.files[0]
        : e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (field === "reasonfile" && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
    // Si l'utilisateur change de type ou de date, reset la date de fin si type sans limite
    if ((field === "leaveType" || field === "startDate") && !limitDuration) {
      setForm((prev) => ({
        ...prev,
        endDate: "",
        duration: "",
      }));
    }
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(form, { abortEarly: false });

      if (!form.duration || Number(form.duration) < 1) {
        setErrors((prev) => ({
          ...prev,
          duration: "La durée doit être supérieure ou égale à 1 jour.",
        }));
        toast.error("La durée doit être supérieure ou égale à 1 jour.");
        return;
      }

      const typeObj = leaveTypes.find((lt) => lt._id === form.leaveType);
      if (!typeObj?.limitDuration && leaveBalance) {
        if (Number(form.duration) > Number(leaveBalance.soldeRestant)) {
          setErrors((prev) => ({
            ...prev,
            duration: `Votre solde restant est insuffisant (${leaveBalance.soldeRestant} jours) pour cette demande.`,
          }));
          toast.error(
            `Votre solde restant (${leaveBalance.soldeRestant} jours) est insuffisant pour une demande de ${form.duration} jours !`
          );
          return;
        }
      }
      
      const formData = new FormData();
      formData.append("title", typeObj?.name || "");
      formData.append("leaveType", form.leaveType);
      formData.append("duration", form.duration);
      formData.append("status", "pending");
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("reason", form.reason);
      formData.append("user", userId);
      if (form.reasonfile) formData.append("reasonFile", form.reasonfile);

      if (onSubmit) await onSubmit(formData);

      resetForm();
      handleClose();
      toast.success("Demande de congé envoyée avec succès !");
    } catch (validationErr) {
      if (validationErr.inner) {
        const newErrors = {};
        validationErr.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        toast.error(validationErr.errors[0]);
      } else {
        toast.error("Erreur lors de la validation ou de la soumission !");
      }
    }
  };

  // Fermeture + reset
  const handleCloseAndReset = () => {
    resetForm();
    handleClose();
  };
  

  // Render
  return (
    <ModelComponent
      open={open}
      handleClose={handleCloseAndReset}
      title="Demande de Congé"
      icon={<EventNote />}
      maxWidth="sm"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        autoComplete="off"
      >
        <TextField
          select
          label="Type de congé *"
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange("leaveType")}
          error={!!errors.leaveType}
          helperText={errors.leaveType}
          disabled={loading}
        >
          <MenuItem value="" disabled>
            Sélectionner un type
          </MenuItem>
          {(leaveTypes || []).map((t) => (
            <MenuItem key={t._id} value={t._id}>
              {t.name}
              {t.limitDuration ? ` (limite: ${t.limitDuration}j)` : ""}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DatePicker
                label="Date de début *"
                value={form.startDate ? dayjs(form.startDate) : null}
                onChange={(value) => {
                  const date = value ? value.format("YYYY-MM-DD") : "";
                  handleChange("startDate")({ target: { value: date } });
                }}
                slotProps={{
                  textField: {
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    fullWidth: true,
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Date de fin *"
                value={form.endDate ? dayjs(form.endDate) : null}
                onChange={(value) => {
                  if (!limitDuration) {
                    const date = value ? value.format("YYYY-MM-DD") : "";
                    handleChange("endDate")({ target: { value: date } });
                  }
                }}
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                    fullWidth: true,
                    InputLabelProps: { shrink: true },
                    disabled: !!limitDuration, // désactive si limité
                    readOnly: !!limitDuration,
                  },
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <TextField
          label="Durée (en jours)"
          name="duration"
          type="number"
          value={form.duration}
          InputProps={{
            readOnly: true,
          }}
          error={!!errors.duration}
          helperText={errors.duration}
        />

        <TextField
          label="Motif *"
          name="reason"
          multiline
          minRows={2}
          value={form.reason}
          onChange={handleChange("reason")}
          error={!!errors.reason}
          helperText={errors.reason}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 1 }}
        >
          Joindre un justificatif (pdf, jpg, png, jpeg)
          <input
            type="file"
            hidden
            accept=".pdf,.jpg,.png,.jpeg"
            onChange={handleChange("reasonfile")}
          />
        </Button>
        {errors.reasonfile && (
          <Typography color="error" fontSize="0.75rem">
            {errors.reasonfile}
          </Typography>
        )}
        {fileName && (
          <Typography variant="caption" color="text.secondary">
            Fichier sélectionné : {fileName}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <ButtonComponent
            type="button"
            text="Annuler"
            color="secondary"
            onClick={handleCloseAndReset}
          />
          <ButtonComponent
            type="submit"
            text="Envoyer"
          />
        </Box>
      </Box>
    </ModelComponent>
  );
}
