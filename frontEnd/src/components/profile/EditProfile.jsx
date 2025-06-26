import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Avatar,
  Button,
} from "@mui/material";
import { PhotoCamera, Edit as EditIcon } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { ButtonComponent } from "../Global/ButtonComponent";

export default function EditProfileModal({
  open,
  handleClose,
  userData,
  setUserData,
  onSave,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (open) {
      if (userData.image instanceof File) {
        setPreviewUrl(URL.createObjectURL(userData.image));
      } else {
        setPreviewUrl(userData.image || "");
      }
    }
    return () => {
      if (previewUrl && userData.image instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [open, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Modifier Profil"
      icon={<EditIcon />}
    >
      <Box sx={{ mt: 2, p: 1 }}>
        {/* Partie Avatar et nom */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 3 }}>
          <Avatar
            src={previewUrl}
            alt={userData.fullName || "Avatar"}
            sx={{
              width: 80,
              height: 80,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          />
          <TextField
            label="Nom Complet"
            name="fullName"
            value={userData.fullName || ""}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            size="small"
            sx={{
              textTransform: "none",
              fontSize: 13,
              borderRadius: 2,
              bgcolor: "#6b48ff",
              color: "#fff",
              "&:hover": {
                bgcolor: "#5a3dd3",
              },
              ml: 2,
              px: 2,
              py: 1,
            }}
          >
            Changer la photo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
        </Box>
        {/* Champs un par un */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            variant="outlined"
            type="email"
          />
          <TextField
            fullWidth
            size="small"
            label="Téléphone"
            name="phone"
            value={userData.phone || ""}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            size="small"
            label="Adresse"
            name="address"
            value={userData.address || ""}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            size="small"
            label="Domaine"
            name="domain"
            value={userData.domain || ""}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>

        {/* Bouton aligné à droite */}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <ButtonComponent
            text="Enregistrer"
            icon={<EditIcon />}
            onClick={onSave}
          />
        </Box>
      </Box>
    </ModelComponent>
  );
}
