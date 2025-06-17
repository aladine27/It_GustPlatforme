import { useEffect } from "react"
import { Box, Typography, Button, ButtonGroup } from "@mui/material"
import { useTranslation } from "react-i18next"
import moment from "moment"
import "moment/locale/fr"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

export default function CustomToolbar(props) {
  const { t, i18n } = useTranslation()

  // Synchronise la locale de moment
  useEffect(() => {
    moment.locale(i18n.language)
  }, [i18n.language])

  // Format la date en fonction de la langue
  const today = moment().locale(i18n.language).format("dddd DD MMMM YYYY")

  // Labels traduits pour les vues
  const viewLabels = {
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
  }

  return (
    <Box
      className="rbc-toolbar"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
        gap: { xs: 2, md: 3 },
        alignItems: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        borderRadius: "20px",
        padding: { xs: "1rem", md: "1.25rem 2rem" },
        mb: 2,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Navigation gauche */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <Button
          onClick={() => props.onNavigate("TODAY")}
          variant="contained"
          size="medium"
          startIcon={<Calendar size={18} />}
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            textTransform: "none",
            borderRadius: "12px",
            px: 2.5,
            py: 1,
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
            "&:hover": {
              backgroundColor: "#2563eb",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {t("today")}
        </Button>

        <ButtonGroup
          variant="outlined"
          sx={{
            "& .MuiButton-root": {
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: "12px",
              px: 2,
              py: 1,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                borderColor: "#94a3b8",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            },
            "& .MuiButtonGroup-grouped:not(:last-of-type)": {
              borderRightColor: "#cbd5e1",
            },
          }}
        >
          <Button onClick={() => props.onNavigate("PREV")}>
            <ChevronLeft size={18} />
          </Button>
          <Button onClick={() => props.onNavigate("NEXT")}>
            <ChevronRight size={18} />
          </Button>
        </ButtonGroup>
      </Box>

      {/* Centre : label + date */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          order: { xs: -1, md: 0 },
        }}
      >
        <Typography
          className="rbc-toolbar-label"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            color: "#1e293b",
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {moment(props.date).locale(i18n.language).format("MMMM YYYY")}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "#64748b",
            fontWeight: 500,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {today}
        </Typography>
      </Box>

      {/* Droite : vue */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        <ButtonGroup
          variant="outlined"
          sx={{
            backgroundColor: "white",
            borderRadius: "14px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            overflow: "hidden",
            "& .MuiButton-root": {
              borderColor: "transparent",
              color: "#64748b",
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "none",
              px: 2.5,
              py: 1.25,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              "&:hover": {
                backgroundColor: "#f8fafc",
                color: "#3b82f6",
              },
              transition: "all 0.2s ease-in-out",
            },
            "& .MuiButton-contained": {
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            },
            "& .MuiButtonGroup-grouped:not(:last-of-type)": {
              borderRightColor: "#e2e8f0",
            },
          }}
        >
          {props.views.map((view) => (
            <Button
              key={view}
              variant={props.view === view ? "contained" : "outlined"}
              onClick={() => props.onView(view)}
            >
              {viewLabels[view] || view}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </Box>
  )
}
