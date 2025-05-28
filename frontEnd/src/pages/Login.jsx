import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
  Stack,
  Link,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GitHubIcon from '@mui/icons-material/GitHub';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, password });
    navigate("/dashboard");
  };

  return (
    <Container component="main" maxWidth="sm" style={{ height: '100vh' }}>
      <CssBaseline />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, mt: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight={500} mb={1}>
            Connexion
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Entrez vos identifiants pour accéder à votre espace
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
        
            <TextField
              required
              fullWidth
              id="email"
           variant="standard"
           label="Adresse e-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              variant="standard"
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
              sx={{ alignSelf: 'flex-start' }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                fontWeight: 500,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Se connecter
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Se connecter avec GitHub
            </Button>
          </Stack>

          <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
            <Grid item>
              <Link href="#" variant="body2" underline="hover">
                Mot de passe oublié ?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" underline="hover">
                Pas de compte ? Inscrivez-vous
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
