import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { CreateUserAction } from "../../redux/actions/employeAction";
import ModelComponent from "../Global/ModelComponent";
import { PersonAddAlt1 } from "@mui/icons-material";

const AddEmployeModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    role: "",
    domain: "",
    image: null,
    password: "admin123",
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Le nom complet est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    address: Yup.string().required("L'adresse est requise"),
    phone: Yup.string().required("Le numéro de téléphone est requis"),
    role: Yup.string()
      .oneOf(["Admin", "Employe", "Rh", "Manager"])
      .required("Le rôle est requis"),
    domain: Yup.string().required("Le domaine est requis"),
    image: Yup.mixed().required("L'image est requise"),
  });

  const handleChange = (field) => (e) => {
    const value = field === "image" ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (field === "image" && e.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(form, { abortEarly: false });

      await dispatch(CreateUserAction(form)).unwrap();
      handleClose();
      setForm({
        fullName: "",
        email: "",
        address: "",
        phone: "",
        role: "",
        domain: "",
        image: null,
        password: "admin123",
      });
      setPreviewUrl(null);
      setErrors({});
    } catch (validationErr) {
      if (validationErr.inner) {
        const newErrors = {};
        validationErr.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Ajouter un Employé"
      icon={<PersonAddAlt1 />}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <TextField
          label="Nom complet"
          name="fullName"
          value={form.fullName}
          onChange={handleChange("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={errors.email}
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

        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained">
            Créer
          </Button>
        </Box>
      </Box>
    </ModelComponent>
  );
};

export default AddEmployeModal;
