import React, { useEffect } from "react";
import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
    Typography,
    Stack,
    Link,
    Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { LoginAction, GithubLoginAction, GithubCallbackAction } from "../redux/actions/userAction";
import { toast } from "react-toastify";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Email invalide").required("Email requis"),
        password: Yup.string().required("Le mot de passe est requis"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // Gestion du callback GitHub
    useEffect(() => {
        if (location.pathname === "/github-callback") {
            const queryParams = location.search;
            dispatch(GithubCallbackAction(queryParams))
                .unwrap()
                .then((result) => {
                    toast.success("Connexion GitHub réussie !");
                    // Assurez-vous que les données de l'utilisateur sont stockées ici aussi
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

                // --- MODIFICATION IMPORTANTE ---
                // On stocke les informations de l'utilisateur (le payload de la réponse)
                // dans le localStorage pour qu'elles persistent entre les pages.
                localStorage.setItem('user', JSON.stringify(resultAction.payload));
                // -----------------------------

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
    
    const handleGithubLogin = async () => {
        try {
            await dispatch(GithubLoginAction()).unwrap();
        } catch (error) {
            toast.error("Erreur lors de la connexion GitHub");
        }
    };

    return (
        <Grid container
            sx={{
                backgroundColor: "#1A9BC3",
                display: "flex",
                justifyContent: "space-between",
                height: "100vh",
            }}
        >
            <Grid item component={Paper} elevation={6} sx={{ display: "flex", flexDirection: "column", width: "50%", padding: 4, justifyContent: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" fontWeight={600}>
                        Connexion
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2} mt={2}>
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Se souvenir de moi"
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5, fontWeight: 600 }}>
                            Se connecter
                        </Button>
                        <Typography align="center" variant="body2" color="text.secondary">
                            ou se connecter avec
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="outlined" startIcon={<GitHubIcon />} onClick={handleGithubLogin}>
                                GitHub
                            </Button>
                            <Button variant="outlined" startIcon={<GoogleIcon />}>
                                Google
                            </Button>
                        </Stack>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/resetPassword" variant="body2">
                                    Mot de passe oublié ?
                                </Link>
                            </Grid>
                        </Grid>
                    </Stack>
                </form>
            </Grid>
        </Grid>
    );
}