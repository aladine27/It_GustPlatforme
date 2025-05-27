import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

const ContactUs = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'grey.50',
        borderTop: 1,
        borderColor: 'grey.200',
        mt: 6,
        mb: 6,
      }}
      component="section"
    >
      <Container maxWidth="lg">
        <Box py={6}>
          <Grid container spacing={4}>
            {/* En-tête */}
            <Grid item xs={12}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                Contact Us
              </Typography>
            </Grid>

            {/* Formulaire */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Name" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email Address" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={12} sm={8} display="flex" alignItems="center">
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    +216 53 222 332
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Carte */}
            <Grid item xs={12} md={5}>
              <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3123.3108992763366!2d10.181821815364256!3d36.86036497993505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302c92aa9a3195d%3A0xbff9b0eb2ed81df2!2sESPRIT!5e0!3m2!1sfr!2stn!4v1686393067496!5m2!1sfr!2stn"
                width="100%"
                height="250"
                sx={{ border: 0, borderRadius: 1 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Paper>
  );
};

export default ContactUs;
