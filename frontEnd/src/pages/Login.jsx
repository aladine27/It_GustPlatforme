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
  Link ,
  Paper,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

import { Link as RouterLink } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight={600}>
            Connexion
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Entrez vos identifiants pour accéder à votre espace
          </Typography>
        </Box>

        <Box component="form" noValidate>
          <Stack spacing={2}>
            <TextField
              required fullWidth
              id="email" label="Adresse e-mail"
              name="email" autoComplete="email" autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              required fullWidth
              name="password" label="Mot de passe"
              type="password" id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de moi"
            />
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              fullWidth
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Se connecter
            </Button>

            <Typography align="center" variant="body2" color="text.secondary">
              ou se connecter avec
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" startIcon={<GitHubIcon />}>
                GitHub
              </Button>
              <Button variant="outlined" startIcon={<GoogleIcon />}>
                Google
              </Button>
            </Stack>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/resetPassword"
                  variant="body2"
                >
                  Mot de passe oublié ?
                </Link>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
