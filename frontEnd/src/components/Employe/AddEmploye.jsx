"use client"

import { useState } from "react"
import {
  Grid,
  TextField,
  Button,
  Stack,
  Box,
  InputAdornment,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

export default function AddEmploye({ onSubmit, onClose }) {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    domain: "",
    status: "Actif",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Options pour les domaines
  const domainOptions = [
    "Développement Web",
    "Design UI/UX",
    "DevOps",
    "Développement mobile",
    "Data Science",
    "Cybersécurité",
    "Marketing Digital",
  ]

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.firstName.trim()) newErrors.firstName = t("Le prénom est requis")
    if (!form.lastName.trim()) newErrors.lastName = t("Le nom est requis")
    if (!form.username.trim()) newErrors.username = t("Le nom d'utilisateur est requis")
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = t("Le numéro de téléphone est requis")
    if (!form.email.trim()) newErrors.email = t("L'email est requis")
    if (!form.password.trim()) newErrors.password = t("Le mot de passe est requis")
    if (!form.domain.trim()) newErrors.domain = t("Le domaine est requis")

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = t("Format d'email invalide")
    }

    // Validation téléphone
    const phoneRegex = /^\+?[0-9]{10,15}$/
    if (form.phoneNumber && !phoneRegex.test(form.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = t("Format de téléphone invalide")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Créer l'objet employé avec la structure attendue
    const newEmployee = {
      id: Date.now(), // ID temporaire
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phoneNumber,
      domain: form.domain,
      status: form.status,
      avatar: `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase(),
      username: form.username,
    }

    // Appeler la fonction onSubmit si elle existe
    if (onSubmit) {
      onSubmit(newEmployee)
    }

    // Fermer le modal si la fonction existe
    if (onClose) {
      onClose()
    }

    // Réinitialiser le formulaire
    setForm({
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      domain: "",
      status: "Actif",
    })
    setErrors({})
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Prénom") + "*"}
              placeholder={t("Entrez le prénom")}
              fullWidth
              value={form.firstName}
              onChange={handleChange("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Nom") + "*"}
              placeholder={t("Entrez le nom")}
              fullWidth
              value={form.lastName}
              onChange={handleChange("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Nom d'utilisateur") + "*"}
              placeholder={t("Entrez le nom d'utilisateur")}
              fullWidth
              value={form.username}
              onChange={handleChange("username")}
              error={!!errors.username}
              helperText={errors.username}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("Numéro de téléphone") + "*"}
              placeholder={t("Entrez le numéro de téléphone")}
              fullWidth
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("Email") + "*"}
              placeholder={t("Entrez l'email")}
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.domain}>
              <InputLabel>{t("Domaine") + "*"}</InputLabel>
              <Select value={form.domain} onChange={handleChange("domain")} label={t("Domaine") + "*"}>
                {domainOptions.map((domain) => (
                  <MenuItem key={domain} value={domain}>
                    {domain}
                  </MenuItem>
                ))}
              </Select>
              {errors.domain && (
                <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 1.5 }}>{errors.domain}</Box>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t("Statut")}</InputLabel>
              <Select value={form.status} onChange={handleChange("status")} label={t("Statut")}>
                <MenuItem value="Actif">{t("Actif")}</MenuItem>
                <MenuItem value="Inactif">{t("Inactif")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("Mot de passe") + "*"}
              placeholder={t("Entrez le mot de passe")}
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {t("Annuler")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            {t("Créer utilisateur")}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
