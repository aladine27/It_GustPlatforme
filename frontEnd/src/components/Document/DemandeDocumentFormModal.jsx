import React, { useState } from "react";
import {
  Box, TextField, MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { EventNote } from "@mui/icons-material";

// 5 Types de documents les plus demandés
const documentTypes = [
  { value: "Attestation de travail", label: "Attestation de travail" },
  { value: "Bulletin de paie", label: "Bulletin de paie" },
  { value: "Attestation de salaire", label: "Attestation de salaire" },
  { value: "Attestation de présence", label: "Attestation de présence" },
  { value: "certificat d'emploi et de fonction", label: "certificat d'emploi et de fonction" },
];

export default function DemandeDocumentFormModal({
  open,
  handleClose,
  onSubmit,
  userId,
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: "",
    traitementDateLimite: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState(null);
  

  React.useEffect(() => {
    if (open) setForm({ title: "", traitementDateLimite: "", reason: "" });
  }, [open]);

  
  const validationSchema = Yup.object({
    title: Yup.string().required(t("Type de document requis")),
    traitementDateLimite: Yup.date()
      .required(t("Date limite requise"))
      .min(dayjs().startOf("day").toDate(), t("Impossible de choisir une date passée")),
    reason: Yup.string().required(t("Le motif est requis")),
  });
  const resetForm = () => {
    setForm({
      title: "",
      traitementDateLimite: "",
      reason: "",
    });
    setErrors({});
    setFileName(null);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(form, { abortEarly: false });

      // Prépare le FormData
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("traitementDateLimite", form.traitementDateLimite);
      formData.append("reason", form.reason);
      formData.append("status", "En cours de traitement");
      formData.append("user", userId);
      formData.append("file", ""); // pas de fichier ici

      if (onSubmit) {
        await onSubmit(formData);
      }

      setForm({ title: "", traitementDateLimite: "", reason: "" });
      resetForm();
      handleClose();
      toast.success(t("Demande de document envoyée avec succès !"));
    } catch (validationErr) {
      if (validationErr.inner) {
        const newErrors = {};
        validationErr.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        toast.error(validationErr.errors[0]);
      } else {
        toast.error(t("Erreur lors de la validation ou de la soumission !"));
      }
    }
  };

  const handleCloseAndReset = () => {
    resetForm();
    handleClose();
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleCloseAndReset}
      title={t("Demande de document employé")}
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
          label={t("Type de document") + " *"}
          name="title"
          value={form.title}
          onChange={handleChange("title")}
          error={!!errors.title}
          helperText={errors.title}
        >
          <MenuItem value="" disabled>
            {t("Sélectionner un type")}
          </MenuItem>
          {documentTypes.map((doc) => (
            <MenuItem key={doc.value} value={doc.value}>
              {doc.label}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t("Date limite de traitement") + " *"}
            value={form.traitementDateLimite ? dayjs(form.traitementDateLimite) : null}
            minDate={dayjs().startOf("day")}
            onChange={(value) => {
              const date = value ? value.format("YYYY-MM-DD") : "";
              handleChange("traitementDateLimite")({ target: { value: date } });
            }}
            slotProps={{
              textField: {
                error: !!errors.traitementDateLimite,
                helperText: errors.traitementDateLimite,
                fullWidth: true,
                InputLabelProps: { shrink: true },
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          label={t("Motif") + " *"}
          name="reason"
          multiline
          minRows={2}
          value={form.reason}
          onChange={handleChange("reason")}
          error={!!errors.reason}
          helperText={errors.reason}
        />

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <ButtonComponent type="submit" text={t("Envoyer")} />
        </Box>
      </Box>
    </ModelComponent>
  );
}
