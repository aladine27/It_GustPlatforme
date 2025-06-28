import React, { useState } from "react";
import {
  Box, Button, MenuItem, Select, InputLabel, FormControl,
  TextField, Typography, Avatar
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { CreateUserAction } from "../../redux/actions/employeAction";
import ModelComponent from "../Global/ModelComponent";
import { ArrowBack, ArrowForward, PersonAddAlt1, SaveOutlined } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// === Import du Stepper Global ===
import StepperComponent from "../Global/StepperComponent";
import { ButtonComponent } from "../Global/ButtonComponent";

// Définition des étapes pour le stepper
const steps = ["Identité & Contact", "Profession & Email", "Image"];

// Composant modal d'ajout d'employé
const AddEmployeModal = ({ open, handleClose }) => {
  // ------------- Initialisation Redux et State -----------------
  const dispatch = useDispatch();
  const employes = useSelector((state) => state.employe.list || []);

  // Etape active
  const [activeStep, setActiveStep] = useState(0);
  // Données du formulaire
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    role: "",
    domain: "",
    image: null,
    password: "admin123",
  });
  // Gestion erreurs
  const [errors, setErrors] = useState({});
  // Image preview
  const [previewUrl, setPreviewUrl] = useState(null);

  // --------- Validation d'unicité d'un champ --------
  const isFieldUnique = (field, value) => {
    if (!value) return true;
    return !employes.some(
      (emp) =>
        emp[field] && emp[field].toLowerCase() === value.toLowerCase()
    );
  };

  // ---------- Schéma de validation par étape -------
  const validationSchemas = [
    // Étape 1 : Identité & Contact
    Yup.object({
      fullName: Yup.string()
        .required("Le nom complet est requis")
        .test(
          "is-unique-fullname",
          "Ce nom complet existe déjà",
          (value) => isFieldUnique("fullName", value)
        ),
      address: Yup.string().required("L'adresse est requise"),
      phone: Yup.string()
        .required("Le numéro de téléphone est requis")
        .matches(/^\d{8}$/, "Le numéro doit contenir exactement 8 chiffres")
        .test(
          "is-unique-phone",
          "Ce numéro existe déjà",
          (value) => isFieldUnique("phone", value)
        ),
    }),
    // Étape 2 : Profession & Email
    Yup.object({
      email: Yup.string()
        .email("Email invalide")
        .required("L'email est requis")
        .test(
          "is-unique-email",
          "Cet email existe déjà",
          (value) => isFieldUnique("email", value)
        ),
      role: Yup.string()
        .oneOf(["Admin", "Employe", "Rh", "Manager"])
        .required("Le rôle est requis"),
      domain: Yup.string().required("Le domaine est requis"),
    }),
    // Étape 3 : Juste vérif image (manuellement)
  ];

  // ------------- Gestion des champs du formulaire ----------
  const handleChange = (field) => (e) => {
    const value = field === "image" ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "image" && e.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // ---------- Suivant ----------
  const handleNext = async () => {
    try {
      await validationSchemas[activeStep].validate(form, { abortEarly: false });
      setActiveStep((prev) => prev + 1);
    } catch (validationErr) {
      // Gère les erreurs et affiche le toast
      const newErrors = {};
      if (validationErr.inner && Array.isArray(validationErr.inner)) {
        validationErr.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      } else if (validationErr.path && validationErr.message) {
        newErrors[validationErr.path] = validationErr.message;
      }
      setErrors(newErrors);
      const firstErrMsg =
        Object.values(newErrors).length > 0
          ? Object.values(newErrors)[0]
          : "Erreur de validation.";
      
    }
  };

  // ---------- Retour ----------
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // ---------- Créer ----------
  const handleSubmit = async () => {
    try {
      if (!form.image) {
        setErrors({ image: "L'image est requise" });
        toast.error("L'image est requise.");
        return;
      }
      setErrors({});
      // Appel backend (Redux thunk)
      const actionResult = dispatch(CreateUserAction(form));
      if (actionResult?.error) {
        const msg =
          actionResult?.payload ||
          actionResult?.error?.message ||
          "Erreur lors de la création.";
        toast.error(msg);
        return;
      }
      toast.success("Employé créé avec succès !");
      handleClose();
      // Reset
      setForm({
        fullName: "",
        address: "",
        phone: "",
        email: "",
        role: "",
        domain: "",
        image: null,
        password: "admin123",
      });
      setPreviewUrl(null);
      setActiveStep(0);
      setErrors({});
    } catch (validationErr) {
      let newErrors = {};
      if (validationErr.inner && Array.isArray(validationErr.inner)) {
        validationErr.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      } else if (validationErr.path && validationErr.message) {
        newErrors[validationErr.path] = validationErr.message;
      }
      setErrors(newErrors);
      const firstErrMsg =
        Object.values(newErrors).length > 0
          ? Object.values(newErrors)[0]
          : "Erreur lors de la création";
      toast.error(firstErrMsg);
    }
  };

  // -------------- Affichage des champs selon l'étape -----------------
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nom complet"
              name="fullName"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            <TextField
              label="Adresse"
              name="address"
              value={form.address}
              onChange={handleChange("address")}
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              label="Téléphone"
              name="phone"
              value={form.phone}
              onChange={handleChange("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange("email")}
              error={!!errors.email}
              helperText={errors.email}
            />
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Rôle</InputLabel>
              <Select value={form.role} onChange={handleChange("role")} label="Rôle">
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Employe">Employe</MenuItem>
                <MenuItem value="Rh">Rh</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
              {errors.role && (
                <Typography color="error" fontSize="0.75rem">
                  {errors.role}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.domain}>
              <InputLabel>Domaine</InputLabel>
              <Select value={form.domain} onChange={handleChange("domain")} label="Domaine">
                <MenuItem value="Développement Web">Développement Web</MenuItem>
                <MenuItem value="Design UI/UX">Design UI/UX</MenuItem>
                <MenuItem value="DevOps">DevOps</MenuItem>
                <MenuItem value="Mobile">Mobile</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </Select>
              {errors.domain && (
                <Typography color="error" fontSize="0.75rem">
                  {errors.domain}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="outlined" component="label">
              {form.image ? "Changer l'image" : "Importer une image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleChange("image")}
              />
            </Button>
            {errors.image && (
              <Typography color="error" fontSize="0.75rem">
                {errors.image}
              </Typography>
            )}
            {previewUrl && (
              <Avatar
                src={previewUrl}
                alt="Preview"
                sx={{ width: 64, height: 64, mx: "auto" }}
              />
            )}
          </Box>
        );
      default:
        return "Étape inconnue";
    }
  };

  // ------------------ Rendu du composant -----------------
  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <ModelComponent
        open={open}
        handleClose={handleClose}
        title="Ajouter un Employé"
        icon={<PersonAddAlt1 />}
      >
        <Box sx={{ mt: 2 }}>
          {/* --- Utilisation du Stepper global ici --- */}
          <StepperComponent steps={steps} activeStep={activeStep} />
          <Box sx={{ mt: 2 }}>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
  {activeStep !== 0 && (
    <ButtonComponent
      onClick={handleBack}
      text="Retour"
      icon={<ArrowBack />} // ou une icône, ex: 
      
    />
  )}
  {activeStep < steps.length - 1 ? (
    <ButtonComponent
      onClick={handleNext}
      text="Suivant"
      icon={ <ArrowForward />} // ou une icône, ex: <ArrowForward />
      color="primary"
    />
  ) : (
    <ButtonComponent
      onClick={handleSubmit}
      text="Créer"
      icon={<SaveOutlined />} // ou <SaveOutlined />
      color="primary"
    />
  )}
</Box>
          </Box>
        </Box>
      </ModelComponent>
    </>
  );
};

export default AddEmployeModal;
