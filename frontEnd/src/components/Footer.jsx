import React from 'react';
import {Box,Container,Grid,Typography,Link,TextField,Button,IconButton,Divider,Paper
} from '@mui/material';
import {LinkedIn,Facebook,Twitter,GitHub,Send,Business} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Données statiques pour le moment
  const footerData = {
    companyName: "IT-GUST",
    description: "Solutions technologiques innovantes pour votre entreprise",
    email: "contact@IT_GUST.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    socialLinks: {
      linkedin: "https://linkedin.com/company/gustIT",
      facebook: "https://facebook.com/IT",
      twitter: "https://twitter.com/gustIT",
      github: "https://github.com/gustIT"
    }
  };

  const products = [
    { name: "Web Studio", href: "#" },
    { name: "DynamicBox Flex", href: "#" },
    { name: "Programming Forms", href: "#" },
    { name: "Integrations", href: "#" },
    { name: "Command-line", href: "#" }
  ];

  const resources = [
    { name: "Documentation", href: "#" },
    { name: "Tutorials & Guides", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Support Center", href: "#" },
    { name: "Partners", href: "#" }
  ];

  const company = [
    { name: "Accueil", href: "#" },
    { name: "À propos", href: "#" },
    { name: "Nos valeurs", href: "#" },
    { name: "Tarifs", href: "#" },
    { name: "Politique de confidentialité", href: "#" }
  ];

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    // Logique d'inscription à la newsletter
    console.log("Newsletter subscription");
  };

  return (
    <Paper 
      component="footer" 
      elevation={0} 
      sx={{ 
        bgcolor: 'grey.50', 
        mt: 'auto',
        borderTop: 1,
        borderColor: 'grey.200'
      }}
    >
      <Container maxWidth="lg">
        {/* Section principale */}
        <Box py={6}>
          <Grid container spacing={13}>
            {/* Logo et informations de l'entreprise */}
            <Grid item xs={12} md={3}>
              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Business sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {footerData.companyName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {footerData.description}
                </Typography>
                <Box>
                  <Link 
                    href="#" 
                    color="text.secondary" 
                    underline="hover"
                    sx={{ mr: 2, fontSize: '0.875rem' }}
                  >
                    Conditions d'utilisation
                  </Link>
                  <Link 
                    href="#" 
                    color="text.secondary" 
                    underline="hover"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    Politique de confidentialité
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Produits */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Produits
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {products.map((product, index) => (
                  <Box component="li" key={index} mb={1}>
                    <Link 
                      href={product.href}
                      color="text.secondary"
                      underline="hover"
                      variant="body2"
                      sx={{ 
                        '&:hover': { 
                          color: 'text.primary',
                          transition: 'color 0.15s ease-in-out'
                        }
                      }}
                    >
                      {product.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Ressources */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Ressources
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {resources.map((resource, index) => (
                  <Box component="li" key={index} mb={1}>
                    <Link 
                      href={resource.href}
                      color="text.secondary"
                      underline="hover"
                      variant="body2"
                      sx={{ 
                        '&:hover': { 
                          color: 'text.primary',
                          transition: 'color 0.15s ease-in-out'
                        }
                      }}
                    >
                      {resource.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Entreprise */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Entreprise
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {company.map((item, index) => (
                  <Box component="li" key={index} mb={1}>
                    <Link 
                      href={item.href}
                      color="text.secondary"
                      underline="hover"
                      variant="body2"
                      sx={{ 
                        '&:hover': { 
                          color: 'text.primary',
                          transition: 'color 0.15s ease-in-out'
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Newsletter
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Recevez les dernières actualités et articles chaque mois.
              </Typography>
              <Box 
                component="form" 
                onSubmit={handleNewsletterSubmit}
                sx={{ maxWidth: 300 }}
              >
                <Box display="flex" mb={2}>
                  <TextField
                    type="email"
                    placeholder="Votre email"
                    variant="outlined"
                    size="small"
                    required
                    sx={{ 
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ 
                      minWidth: 'auto',
                      px: 2,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  >
                    <Send sx={{ fontSize: 18 }} />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Section du bas */}
        <Box py={3}>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* Copyright */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                © {currentYear} {footerData.companyName}. Tous droits réservés.
              </Typography>
            </Grid>

            {/* Réseaux sociaux */}
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
                <IconButton
                  component="a"
                  href={footerData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  sx={{
                    color: '#0077b5',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 119, 181, 0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  component="a"
                  href={footerData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  sx={{
                    color: '#316FF6',
                    '&:hover': {
                      backgroundColor: 'rgba(49, 111, 246, 0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  component="a"
                  href={footerData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  sx={{
                    color: '#000',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  component="a"
                  href={footerData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  sx={{
                    color: '#333',
                    '&:hover': {
                      backgroundColor: 'rgba(51, 51, 51, 0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <GitHub />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;