import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Stack,
  Link,
  Paper,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { LoginAction, GithubLoginAction, GithubCallbackAction } from "../redux/actions/userAction";
import { toast } from "react-toastify";
import logo from '../assets/logo.jpeg';
import loginImage from '../assets/login.jpg';   // <<< AJOUT ICI
import { useTranslation } from 'react-i18next';
import Flag from "react-world-flags";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Language menu
  const [langMenu, setLangMenu] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const handleFlagClick = (e) => setLangMenu(e.currentTarget);
  const handleFlagClose = () => setLangMenu(null);
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    handleFlagClose();
  };

  // Auth actions
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  const handleGithubLogin = async () => {
    try {
      await dispatch(GithubLoginAction()).unwrap();
    } catch (error) {
      toast.error("Erreur lors de la connexion GitHub");
    }
  };

  // Validation
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().required("Le mot de passe est requis"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (location.pathname === "/github-callback") {
      const queryParams = location.search;
      dispatch(GithubCallbackAction(queryParams))
        .unwrap()
        .then((result) => {
          toast.success("Connexion GitHub réussie !");
          localStorage.setItem("user", JSON.stringify(result.data));
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error || "Échec de la connexion GitHub");
          navigate("/login");
        });
    }
  }, [dispatch, location, navigate]);

  const onSubmit = async (formData) => {
    try {
      const resultAction = await dispatch(LoginAction(formData));
      if (LoginAction.fulfilled.match(resultAction)) {
        toast.success("Connexion réussie !");
        localStorage.setItem('user', JSON.stringify(resultAction.payload));
        reset();
        navigate("/dashboard");
      } else {
        toast.error(
          resultAction.payload?.message || "Email ou mot de passe incorrect"
        );
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue.");
    }
  };

  // SVGs for OAuth buttons
  const GithubSvg = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path fill="#181717" fillRule="evenodd" clipRule="evenodd"
        d="M12.026 2c-5.504 0-9.972 4.468-9.972 9.972 0 4.408 2.867 8.141 6.839 9.461.5.091.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.339-2.22-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.983 1.029-2.682-.103-.254-.446-1.272.099-2.653 0 0 .84-.27 2.75 1.025a9.564 9.564 0 0 1 2.504-.336 9.53 9.53 0 0 1 2.504.336c1.91-1.295 2.749-1.025 2.749-1.025.546 1.381.203 2.399.1 2.653.64.699 1.029 1.591 1.029 2.682 0 3.842-2.338 4.687-4.566 4.936.359.31.678.922.678 1.86 0 1.342-.012 2.426-.012 2.756 0 .267.18.577.688.48C19.108 20.109 22 16.377 22 11.972 22 6.468 17.532 2 12.026 2z" />
    </svg>
  );
  const GoogleSvg = (
    <svg width="22" height="22" viewBox="0 0 48 48">
      <g>
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.93 33.57 30.2 37 24 37c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.02 0 5.77 1.06 7.93 2.8l6.3-6.3C34.44 4.71 29.47 2.5 24 2.5 12.42 2.5 3 11.92 3 23.5S12.42 44.5 24 44.5c11.04 0 21-8.5 21-21 0-1.39-.14-2.74-.38-4z" />
        <path fill="#34A853" d="M6.09 14.68l6.99 5.13C14.64 16.12 19 13 24 13c3.02 0 5.77 1.06 7.93 2.8l6.3-6.3C34.44 4.71 29.47 2.5 24 2.5c-7.24 0-13.6 4.07-16.9 10.18z" />
        <path fill="#FBBC05" d="M24 44.5c5.34 0 10.16-1.83 13.94-4.99l-6.49-5.33c-2.11 1.42-4.8 2.27-7.45 2.27-6.15 0-11.36-4.16-13.25-9.78l-7.02 5.41C5.9 40.18 14.25 44.5 24 44.5z" />
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.8C34.22 33.18 29.66 36.5 24 36.5c-5.36 0-9.86-3.6-11.49-8.47l-7.02 5.41C8.65 40.82 15.74 44.5 24 44.5c10.01 0 18.5-8.49 18.5-18.5 0-1.27-.14-2.5-.38-3.68z" />
      </g>
    </svg>
  );

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Colonne Gauche - IMAGE FULL COVER */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          width: "100%",

        }}
      />

      {/* Colonne Droite */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f6f8fb",
          minHeight: "100vh",
        }}
      >
        {/* CARD agrandie et centrée */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 2.5,
            width: "90%",
            height: "90%",
            maxWidth: 680,
            maxHeight: 720,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 6px 48px #0002",
            position: "relative",
           
          }}
        >
          {/* Logo + Flag sur la même ligne */}
          <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, md: 4 },
            pt: { xs: 2, md: 3 },
            pb: 0
          }}>
            <img src={logo} alt="Logo" style={{ width: 95, height: 52, objectFit: "contain" }} />
            <Box>
              <IconButton onClick={handleFlagClick}
                sx={{
                  p: 0.7,
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  "&:hover": { background: "#f5faff" }
                }}>
                <Flag code={selectedLanguage === 'fr' ? 'FR' : 'GB'} style={{ width: 28, height: 18, borderRadius: 3 }} />
              </IconButton>
              <Menu
                anchorEl={langMenu}
                open={Boolean(langMenu)}
                onClose={handleFlagClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => handleLanguageChange('fr')}>
                  <Flag code="FR" style={{ width: 26, marginRight: 10 }} />
                  Français
                </MenuItem>
                <MenuItem onClick={() => handleLanguageChange('en')}>
                  <Flag code="GB" style={{ width: 26, marginRight: 10 }} />
                  English
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Formulaire centré verticalement */}
          <Box sx={{
            flex: 1,
            width: "100%",
            maxWidth: 410,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 2, md: 0 }
          }}>
            <Avatar sx={{ m: 1, bgcolor: "#1890ff" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={600} mb={2} sx={{ textAlign: "center" }}>
              Connexion
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Stack spacing={2} mt={1}>
                <TextField
                  fullWidth
                  label="Adresse e-mail"
                  {...register("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  {...register("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />
                <Button type="submit" variant="contained"
                  fullWidth sx={{
                    py: 1.3,
                    fontWeight: 600,
                    background: "#1890ff",
                    "&:hover": { background: "#1763b7" }
                  }}>
                  Se connecter
                </Button>
              </Stack>
              <Typography align="center" variant="body2" color="text.secondary" mt={2} mb={1}>
                ou se connecter avec
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
                <Button
                  variant="outlined"
                  startIcon={GithubSvg}
                  onClick={handleGithubLogin}
                  sx={{ borderRadius: 7, fontWeight: 600, minWidth: 120 }}
                >
                  GitHub
                </Button>
                <Button
                  variant="outlined"
                  startIcon={GoogleSvg}
                  onClick={handleGoogleLogin}
                  sx={{ borderRadius: 7, fontWeight: 600, minWidth: 120 }}
                >
                  Google
                </Button>
              </Stack>
              <Box sx={{ textAlign: "right" }}>
                <Link component={RouterLink} to="/resetPassword" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Box>
            </form>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
