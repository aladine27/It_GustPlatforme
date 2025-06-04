import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { PersonAddAlt1 } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ModelComponent from "../Global/ModelComponent";

const AddEmployeModal = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    domain: "",
    status: "Actif",
  });

  const [errors, setErrors] = useState({});

  const domainOptions = [
    "Développement Web",
    "Design UI/UX",
    "DevOps",
    "Développement mobile",
    "Data Science",
    "Cybersécurité",
    "Marketing Digital",
  ];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = t("Le prénom est requis");
    if (!form.lastName.trim()) newErrors.lastName = t("Le nom est requis");
    if (!form.username.trim()) newErrors.username = t("Le nom d'utilisateur est requis");
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = t("Le numéro de téléphone est requis");
    if (!form.email.trim()) newErrors.email = t("L'email est requis");
    if (!form.domain.trim()) newErrors.domain = t("Le domaine est requis");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = t("Format d'email invalide");
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (form.phoneNumber && !phoneRegex.test(form.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = t("Format de téléphone invalide");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newEmployee = {
      id: Date.now(),
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phoneNumber,
      domain: form.domain,
      status: form.status,
      avatar: `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase(),
      username: form.username,
    };

    onSubmit?.(newEmployee);
    handleClose?.();

    setForm({
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      domain: "",
      status: "Actif",
    });
    setErrors({});
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title={t("Ajouter un Employé")}
      icon={<PersonAddAlt1 />}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        onSubmit={handleSubmit}
      >
        <TextField
          label={t("Prénom") + "*"}
          fullWidth
          value={form.firstName}
          onChange={handleChange("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label={t("Nom") + "*"}
          fullWidth
          value={form.lastName}
          onChange={handleChange("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          label={t("Nom d'utilisateur") + "*"}
          fullWidth
          value={form.username}
          onChange={handleChange("username")}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label={t("Numéro de téléphone") + "*"}
          fullWidth
          value={form.phoneNumber}
          onChange={handleChange("phoneNumber")}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
        <TextField
          label={t("Email") + "*"}
          fullWidth
          value={form.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={errors.email}
        />
        <FormControl fullWidth error={!!errors.domain}>
          <InputLabel>{t("Domaine") + "*"}</InputLabel>
          <Select
            value={form.domain}
            label={t("Domaine") + "*"}
            onChange={handleChange("domain")}
          >
            {domainOptions.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
          {errors.domain && (
            <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 1.5 }}>
              {errors.domain}
            </Box>
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>{t("Statut")}</InputLabel>
          <Select
            value={form.status}
            label={t("Statut")}
            onChange={handleChange("status")}
          >
            <MenuItem value="Actif">{t("Actif")}</MenuItem>
            <MenuItem value="Inactif">{t("Inactif")}</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button type="submit" variant="contained" sx={{ fontWeight: "bold" }}>
            {t("Créer utilisateur")}
          </Button>
        </Box>
      </Box>
    </ModelComponent>
  );
};

export default AddEmployeModal;
