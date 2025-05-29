// src/pages/ResetPassword.js
import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu appelleras ton API d’envoi de mail...
    console.log("Demande reset pour", email);
    // Puis tu rediriges vers une page de confirmation ou vers login
    navigate("/reset-password/sent");
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar sx={{ m: 'auto', bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={600} mt={1}>
            Réinitialiser le mot de passe
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Saisissez votre e-mail pour recevoir un lien
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Envoyer le lien
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
