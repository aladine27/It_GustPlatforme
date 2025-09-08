// OurServicesTwoCols.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const servicesData = [
  {
    id: 1,
    title: "Développement web et mobile",
    description:
      "Nos développeurs s'engagent à créer des sites web élégants et performants, adaptés avec la vision unique de chaque entreprise. Nous prenons également en charge le développement des applications mobiles Android et iOS.",
    image: "/images/dev.jpg",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    title: "Intelligence Artificielle",
    description:
      "Notre agence IA à Tunis est à la pointe des dernières technologies d’analyse d’informations. Pour piloter votre stratégie digitale, nous utilisons des outils d’alertes, tracking, profiling, Big Data et analyse de données.",
    image: "/images/ai.jpg",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 3,
    title: "Marketing digital",
    description:
      "Pour optimiser votre site internet, faites appel à notre agence de marketing digital à Tunis : SEO, SEA, rédaction web, community management et web design.",
    image: "/images/marketing.jpg",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

const RightServiceRow = ({ service }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)",
        position: "relative",
        overflow: "hidden",
        transition: "transform .25s ease",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="flex-start">
        <Box
          sx={{
            width: 112,
            height: 112,
            flexShrink: 0,
            borderRadius: 2,
            overflow: "hidden",
            background: service.gradient,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box
            component="img"
            src={service.image}
            alt={service.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "soft-light",
            }}
          />
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            {service.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {service.description}
          </Typography>
        </Box>
      </Stack>

      {/* tiret décoratif */}
      <Box
        sx={{
          position: "absolute",
          right: 18,
          bottom: 18,
          width: 28,
          height: 6,
          borderRadius: 3,
          bgcolor: theme.palette.primary.main,
          opacity: 0.8,
        }}
      />
    </Card>
  );
};

const OurServicesTwoCols = () => {
  const theme = useTheme();
  const bigCard = servicesData[0];          // “Développement web et mobile”
  const rightList = servicesData.slice(1);  // IA + Marketing

  return (
    <Box
      sx={{
        // 🔧 Réduction de l’espace vertical autour de la section
        pt: { xs: 2, md: 4 },               // (au lieu de py: { xs: 6, md: 10 })
        pb: { xs: 6, md: 8 },
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3.5}>
          {/* En-tête à gauche */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography
                variant="overline"
                sx={{ color: "primary.main", letterSpacing: 2, fontWeight: 700 }}
              >
                SERVICES
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                Nos services
              </Typography>
              <Typography sx={{ color: "text.secondary", maxWidth: 580 }}>
                Notre <b style={{ color: theme.palette.primary.main }}>agence web à Tunis</b> vous
                accompagne avec plusieurs prestations de qualité.
              </Typography>
            </Box>
          </Grid>

          {/* Colonne droite : IA + Marketing */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3.5}>
              {rightList.map((s) => (
                <RightServiceRow key={s.id} service={s} />
              ))}
            </Stack>
          </Grid>

          {/* Ligne suivante : on “pousse” de 5 colonnes pour se placer sous la colonne droite */}
          <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }} />
          <Grid item xs={12} md={7}>
            {/* Utilise la même carte que “Marketing digital” → même taille */}
            <RightServiceRow service={bigCard} />
          </Grid>

          {/* CTA aligné avec la colonne droite */}
          <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }} />
          <Grid item xs={12} md={7}>
            <Box sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Découvrir tous nos services
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OurServicesTwoCols;
