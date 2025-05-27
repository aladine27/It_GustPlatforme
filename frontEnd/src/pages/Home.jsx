import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUs'; // ✅ IMPORT

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Navbar */}
      <Box sx={{ flexShrink: 0 }}>
        <Navbar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Box maxWidth="lg">
          <h1>Bienvenue sur la page d'accueil</h1>
          <p>Contenu principal ici.</p>
        </Box>

        {/* Contact Us */}
        <ContactUs /> {/* ✅ AJOUT */}
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Home;
