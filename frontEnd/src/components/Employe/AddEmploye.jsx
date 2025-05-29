import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Stack,
  Box
} from '@mui/material';

export default function AddEmployeForm({ onSubmit }) {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
    domaine: '',
    role: ''
  });

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: 500, px: 3, py: 2 }}>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nom"
              fullWidth
              variant="outlined"
              value={form.nom}
              onChange={handleChange('nom')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={form.email}
              onChange={handleChange('email')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Adresse"
              fullWidth
              variant="outlined"
              value={form.adresse}
              onChange={handleChange('adresse')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Téléphone"
              fullWidth
              variant="outlined"
              value={form.telephone}
              onChange={handleChange('telephone')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Domaine"
              fullWidth
              variant="outlined"
              value={form.domaine}
              onChange={handleChange('domaine')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Rôle"
              fullWidth
              variant="outlined"
              value={form.role}
              onChange={handleChange('role')}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button type="submit" variant="contained" sx={{ px: 4, py: 1.5, borderRadius: 2 }}>
            Valider
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}