import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import BusinessIcon from '@mui/icons-material/Business';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log('Form submitted:', formData); };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: 'auto',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'blue', mb: 1 }}>
              Contactez-Nous
            </Typography>
            <Typography variant="body1" sx={{ color: '#616161', maxWidth: '400px', mx: 'auto' }}>
              Remplissez le formulaire ou trouvez nos coordonnées ci-dessous.
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} justifyContent="center" alignItems="flex-start" wrap="nowrap">
          <Grid item sx={{ flex: '0 0 350px' }}>
            <Zoom in timeout={800}>
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: '350px',
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                  p: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MessageIcon sx={{ color: '#2e7d32', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                    Contact Us
                  </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField name="name" label="Name" value={formData.name} onChange={handleChange} variant="outlined" required fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField name="email" type="email" label="Email" value={formData.email} onChange={handleChange} variant="outlined" required fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField name="message" label="Message" value={formData.message} onChange={handleChange} variant="outlined" required fullWidth multiline rows={4} size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" fullWidth endIcon={<SendIcon />} sx={{ py: 1, borderRadius: '6px' }}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item sx={{ flex: '0 0 350px', ml: 4 }}>
            <Zoom in timeout={1000}>
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: '350px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                  p: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
                }}
              >
                <Box
                  component="iframe"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3123.3108992763366!2d10.181821815364256!3d36.86036497993505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302c92aa9a3195d%3A0xbff9b0eb2ed81df2!2sESPRIT!5e0!3m2!1sfr!2stn!4v1686393067496!5m2!1sfr!2stn"
                  sx={{ width: '100%', height: 220, border: 0, borderRadius: '8px 8px 0 0' }}
                  allowFullScreen loading="lazy" title="IT-Gust Location"
                />
                <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '0 0 8px 8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon sx={{ color: '#2e7d32', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                      ESPRIT
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#212121' }}>
                    <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Rue de la Nouvelle Médina, Tunis, Tunisie
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#212121', mt: 0.5 }}>
                    <PhoneIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />+216 53 232 323
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#212121', mt: 0.5 }}>
                    <EmailIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />contact@IT_GUST.tn
                  </Typography>
                </Box>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;
