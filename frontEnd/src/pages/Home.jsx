import React from 'react';
import { Box, Container, Divider } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUs';
import AboutUs from '../components/AboutUs';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
        backgroundColor: '#fff',
      
      }}
    >
      {/* Navbar */}
      <Box sx={{ flexShrink: 0 }}>
        <Navbar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ mb: 6 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
              Bienvenue sur la page d'accueil
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>Contenu principal ici.</p>
          </Box>
        </Container>

      
    
      </Box>
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <AboutUs/>
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <ContactUs />
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <Footer />
    </Box>
  );
};

export default Home;