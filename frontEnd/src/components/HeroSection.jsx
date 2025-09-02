import { Box, Typography, Container, Button, Stack, useTheme } from "@mui/material"
import { ArrowForward } from "@mui/icons-material"
import test from "../assets/test.png"

const HeroSection = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `linear-gradient(
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0.5)
        ), url(${test})`,
        color: "#fff",
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h10"
          sx={{
            fontWeight: 800,
            mb: 6,
            fontSize: { xs: "2rem", md: "3.5rem" },
            lineHeight: 1.2,
          }}
        >
          Rejoignez l'innovation avec ITGust
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: "700px",
            mx: "auto",
            mb: 4,
            fontWeight: 400,
            fontSize: { xs: "1rem", md: "1.25rem" },
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          Nous transformons vos idées en solutions digitales concrètes, grâce à une équipe passionnée par la technologie, l’IA et l’innovation.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          >
            Démarrer
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              color: "#fff",
              borderColor: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            En savoir plus
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection
