import React, { useState, useEffect, useRef } from "react";
import {
  Box, Button, MenuItem, Select, InputLabel, FormControl,
  TextField, Typography, Avatar
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  CreateUserAction,
  UpdateEmployeAction,
  FetchEmployesAction
} from "../../redux/actions/employeAction";
import ModelComponent from "../Global/ModelComponent";
import { ArrowBack, ArrowForward, PersonAddAlt1, SaveOutlined } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepperComponent from "../Global/StepperComponent";
import { ButtonComponent } from "../Global/ButtonComponent";

const steps = ["Identité & Contact", "Profession & Email", "Image"];

const sanitizeValue = (v) => v === undefined || v === "undefined" ? "" : v;

const AddEmployeModal = ({
  open,
  handleClose,
  isEdit = false,
  employeToEdit = null,
}) => {
  const dispatch = useDispatch();
  const employes = useSelector((state) => state.employe.list || []);
  const fileInputRef = useRef();

  const [activeStep, setActiveStep] = useState(0);
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
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!open) {
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
      return;
    }
    if (isEdit && employeToEdit) {
      setForm({
        fullName: sanitizeValue(employeToEdit.fullName),
        address: sanitizeValue(employeToEdit.address),
        phone: sanitizeValue(employeToEdit.phone),
        email: sanitizeValue(employeToEdit.email),
        role: sanitizeValue(employeToEdit.role),
        domain: sanitizeValue(employeToEdit.domain),
        image: null,
        password: "", // Jamais modifié en édition
      });
      if (employeToEdit.image) {
        const baseUrl = employeToEdit.image.startsWith("http")
          ? employeToEdit.image
          : `http://localhost:3000/uploads/users/${encodeURIComponent(employeToEdit.image)}`;
        setPreviewUrl(`${baseUrl}?t=${Date.now()}`);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [open]);

  // ------------------ Yup Validation ------------------
  const validationSchemas = [
    Yup.object({
      fullName: Yup.string()
        .required("Le nom complet est requis")
        .test("unique-fullname", "Ce nom complet existe déjà", (value) =>
          isEdit && value === employeToEdit?.fullName
            ? true
            : !employes.some(
                (emp) =>
                  emp.fullName?.toLowerCase() === value?.toLowerCase() &&
                  (!isEdit || emp._id !== employeToEdit?._id)
              )
        ),
      address: Yup.string().required("L'adresse est requise"),
      phone: Yup.string()
        .required("Le numéro de téléphone est requis")
        .matches(/^\d{8}$/, "Le numéro doit contenir exactement 8 chiffres")
        .test("unique-phone", "Ce numéro existe déjà", (value) =>
          isEdit && value === employeToEdit?.phone
            ? true
            : !employes.some(
                (emp) =>
                  emp.phone === value &&
                  (!isEdit || emp._id !== employeToEdit?._id)
              )
        ),
    }),
    Yup.object({
      email: Yup.string()
        .email("Email invalide")
        .required("L'email est requis")
        .test("unique-email", "Cet email existe déjà", (value) =>
          isEdit && value === employeToEdit?.email
            ? true
            : !employes.some(
                (emp) =>
                  emp.email?.toLowerCase() === value?.toLowerCase() &&
                  (!isEdit || emp._id !== employeToEdit?._id)
              )
        ),
      role: Yup.string()
        .oneOf(["Admin", "Employe", "Rh", "Manager"])
        .required("Le rôle est requis"),
      domain: Yup.string().required("Le domaine est requis"),
    }),
    Yup.object({}), // Step 2
  ];

  const validateStep = async (index = activeStep) => {
    try {
      let options = { abortEarly: false };
      if (index === 2) {
        options.context = {
          previewUrl,
          dbImage: employeToEdit?.image,
        };
      }
      await validationSchemas[index].validate(form, options);
      return true;
    } catch (validationErr) {
      const newErrors = {};
      if (validationErr.inner && Array.isArray(validationErr.inner)) {
        validationErr.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      } else if (validationErr.path && validationErr.message) {
        newErrors[validationErr.path] = validationErr.message;
      }
      setErrors(newErrors);
      return false;
    }
  };

  // ------------------ Handle change & preview ------------------
  const handleChange = (field) => (e) => {
    // Interdire modification du password, email et role en édition :
    if (isEdit && (field === "email" || field === "password" || field === "role")) {
      return;
    }
    const value = field === "image" ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "image" && e.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // ------------------ Navigation steps ------------------
  const handleNext = async () => {
    if (await validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // ------------------ Submit ------------------
const handleSubmit = async () => {
  if (!(await validateStep(2))) return;

  try {
    let payload = { ...form };

    if (isEdit && employeToEdit) {
      // Remplir les champs vides avec les valeurs existantes
      Object.keys(payload).forEach((key) => {
        if (key !== "image" && (payload[key] === "" || payload[key] == null)) {
          payload[key] = employeToEdit[key];
        }
      });
      // Forcer ces champs en édition
      payload.email = employeToEdit.email;
      payload.password = employeToEdit.password;
      payload.role = employeToEdit.role;
      if (!payload.image) payload.image = employeToEdit.image;
    }

    // === Construire UNE SEULE promesse selon le mode ===
    const actionPromise = isEdit
      ? dispatch(UpdateEmployeAction({ id: employeToEdit._id, userData: payload })).unwrap()
      : dispatch(CreateUserAction(payload)).unwrap();

    // === Afficher le toast pour les deux cas ===
    await toast.promise(actionPromise, {
      pending: "Enregistrement en cours...",
      success: isEdit ? "Employé modifié avec succès !" : "Employé créé avec succès !",
      error: "Erreur lors de la sauvegarde.",
    });

    // Rafraîchir la liste puis fermer
    dispatch(FetchEmployesAction());
    handleClose();

    // Reset state local
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
  } catch (e) {
    // En cas d'exception hors du flux toast.promise
    toast.error(e?.message || "Erreur lors de la sauvegarde.");
  }
};


  // ------------------ Stepper content ------------------
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
              disabled={isEdit}
            />
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={form.role}
                onChange={handleChange("role")}
                label="Rôle"
                name="role"
                disabled={isEdit} // Désactive en édition
              >
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
              <Select
                value={form.domain}
                onChange={handleChange("domain")}
                label="Domaine"
                name="domain"
              >
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
            <Button
              variant="outlined"
              component="label"
            >
              {form.image || previewUrl ? "Changer l'image" : "Importer une image"}
              <input
                ref={fileInputRef}
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
            {(previewUrl || employeToEdit?.image) && (
              <Avatar
                src={
                  previewUrl ||
                  (employeToEdit?.image
                    ? (employeToEdit.image.startsWith("http")
                        ? employeToEdit.image
                        : `http://localhost:3000/uploads/users/${encodeURIComponent(
                            employeToEdit.image
                          )}?t=${Date.now()}`)
                    : undefined)
                }
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

  // ------------------ Render ------------------
  return (
    <>
   
      <ModelComponent
        open={open}
        handleClose={handleClose}
        title={isEdit ? "Modifier l'Employé" : "Ajouter un Employé"}
        icon={<PersonAddAlt1 />}
      >
        <Box sx={{ mt: 2 }}>
          <StepperComponent steps={steps} activeStep={activeStep} />
          <Box sx={{ mt: 2 }}>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              {activeStep !== 0 && (
                <ButtonComponent
                  onClick={handleBack}
                  text="Retour"
                  icon={<ArrowBack />}
                />
              )}
              {activeStep < steps.length - 1 ? (
                <ButtonComponent
                  onClick={handleNext}
                  text="Suivant"
                  icon={<ArrowForward />}
                  color="primary"
                />
              ) : (
                <ButtonComponent
                  onClick={handleSubmit}
                  text={isEdit ? "Modifier" : "Créer"}
                  icon={<SaveOutlined />}
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
