import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Typography, Container, Card, Avatar, Box, Stack, useTheme, alpha } from "@mui/material"

// Données de feedback (à remplacer par vos propres données ou une API)
const feedbackData = [
  {
    image: "/placeholder.svg?height=80&width=80",
    name: "Mef Badreddine",
    email: "mef@gmail.com",
    role: "Back-end Developer",
    feedback:
      "Travailler chez TekTAl a transformé ma carrière. L'environnement collaboratif et les défis techniques stimulants me permettent de grandir chaque jour. L'équipe est exceptionnelle !",
    rating: 5,
    experience: "2 ans",
  },
  {
    image: "/placeholder.svg?height=80&width=80",
    name: "Bahaa Eddine",
    email: "bahaa2000lol@gmail.com",
    role: "Front-end Developer",
    feedback:
      "L'innovation est au cœur de tout ce que nous faisons ici. J'adore pouvoir expérimenter avec les dernières technologies et voir mes idées prendre vie dans des projets concrets.",
    rating: 5,
    experience: "1.5 ans",
  },
  {
    image: "/placeholder.svg?height=80&width=80",
    name: "Ala Eddine Ibrahim",
    email: "alaEddine-ibrahim@gmail.com",
    role: "Full-stack Developer",
    feedback:
      "TekTAl offre un équilibre parfait entre défis techniques et développement personnel. La culture d'entreprise favorise vraiment l'apprentissage continu et l'excellence.",
    rating: 5,
    experience: "3 ans",
  },
  {
    image: "/placeholder.svg?height=80&width=80",
    name: "Sarah Benali",
    email: "sarah.benali@tektal.com",
    role: "DevOps Engineer",
    feedback:
      "Ce qui me plaît le plus, c'est la diversité des projets et la confiance que l'équipe me fait. Chaque jour apporte de nouveaux défis passionnants à résoudre.",
    rating: 5,
    experience: "2.5 ans",
  },
  {
    image: "/placeholder.svg?height=80&width=80",
    name: "Ahmed Mansouri",
    email: "ahmed.mansouri@tektal.com",
    role: "Data Scientist",
    feedback:
      "L'approche data-driven de TekTAl et l'accès aux technologies de pointe font de cette entreprise un endroit idéal pour un data scientist ambitieux.",
    rating: 5,
    experience: "1 an",
  },
]

// Composant FeedbackCard amélioré
const FeedbackCard = ({ image, name, email, role, feedback, rating, experience }) => 
  {
  const theme = useTheme()

  return (
    <Card
      sx={{
        p: 3,
        m: 2,
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          "& .avatar": {
            transform: "scale(1.05)",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
    >
      {/* Guillemets décoratifs */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: "3rem",
          color: "green",
          fontFamily: "serif",
          lineHeight: 1,
        }}
      >
        "
      </Box>

      <Stack spacing={3} sx={{ height: "100%" }}>
        {/* Feedback principal */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              lineHeight: 1.6,
              fontStyle: "italic",
              fontSize: "0.95rem",
              mb: 2,
            }}
          >
            "{feedback}"
          </Typography>

          {/* Rating avec étoiles */}
          <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
            {[...Array(rating)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  color: "#FFD700",
                  fontSize: "1.2rem",
                }}
              >
                ★
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Informations du développeur */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={image}
            className="avatar"
            sx={{
              width: 56,
              height: 56,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "transform 0.3s ease",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: "1rem",
                mb: 0.5,
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: "0.875rem",
                mb: 0.5,
              }}
            >
              {role}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              {experience} d'expérience
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Card>
  )
}

// Composant AboutUs amélioré
const AboutUs = () => {
  const theme = useTheme()

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    rtl: false,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        py: 8,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          background:
            "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* En-tête de section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            A propos de Nous
          </Typography>

          <Box
            sx={{
              width: 80,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: 2,
              mx: "auto",
              mb: 3,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            
            ITGust est une agence web à Tunis qui utilise les dernières technologies digitales pour collecter des informations sur le comportement des internautes. 
            Elle intervient sur les différents leviers du marketing digital et de l’intelligence web.
            Nos experts en Intelligence Artificielle se distinguent par leur savoir-faire et expertise.
          </Typography>
        </Box>

        {/* Carousel */}
        <Box
          sx={{
            "& .slick-dots": {
              bottom: -50,
              "& li button:before": {
                fontSize: 12,
                color: theme.palette.primary.main,
                opacity: 0.5,
              },
              "& li.slick-active button:before": {
                opacity: 1,
                color: theme.palette.primary.main,
              },
            },
            "& .slick-prev, & .slick-next": {
              zIndex: 1,
              "&:before": {
                fontSize: 24,
                color: theme.palette.primary.main,
              },
            },
            "& .slick-prev": {
              left: -40,
            },
            "& .slick-next": {
              right: -40,
            },
          }}
        >
          <Slider {...settings}>
            {feedbackData.map((feedback, index) => (
              <div key={index}>
                <FeedbackCard {...feedback} />
              </div>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  )
}

export default AboutUs
