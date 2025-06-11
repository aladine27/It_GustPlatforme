import { useState } from "react";
import {Avatar,Button,TextField,Box,Typography,Container,CssBaseline,Stack,Paper} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ForgotPasswordAction } from "../redux/actions/userAction";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Veuillez entrer une adresse e-mail.");
      return;
    }

    try {
      const result = await dispatch(ForgotPasswordAction(email));
      if (ForgotPasswordAction.fulfilled.match(result)) {
        toast.success("E-mail de réinitialisation envoyé !");
        navigate("/login");
      } else {
        toast.error(result.payload || "Utilisateur introuvable.");
      }
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation.");
      console.error("Reset error:", error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, width: "100%", maxWidth: 400 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
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
