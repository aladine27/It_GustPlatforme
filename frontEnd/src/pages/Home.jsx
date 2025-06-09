import React from 'react';
import { Box, Container, Divider } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactUs from '../components/ContactUs';
import AboutUs from '../components/AboutUs';
import OurService from '../components/OurService';
import HeroSection from '../components/HeroSection';

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
      <HeroSection />
      </Box>
     
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <AboutUs/>
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <OurService/>
      
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <ContactUs />
      <Divider sx={{ backgroundColor: '#f5f5f5', height: '1px', opacity: 0.5 }} />
      <Footer />
    </Box>
  );
};

export default Home;