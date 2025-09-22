import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, Grid, Card, CardContent, Typography, Stack, Avatar,
  IconButton, Badge, Popover, Divider, Tooltip // <-- Import de Tooltip
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { BarChart, LineChart } from "@mui/x-charts";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FetchEmployesAction } from "../redux/actions/employeAction";
import { fetchAllProjects } from "../redux/actions/projectActions";
import { fetchAllSprints } from "../redux/actions/sprintActions";
import { fetchAllJobOffres } from "../redux/actions/jobOffreAction";
import { fetchAllApplications } from "../redux/actions/applicationAction";
import { fetchAllEvents, fetchEventTypes } from "../redux/actions/eventAction";

const API_ANALYSIS_BASE = "http://localhost:3000/application-analysis";

const getAuth = () => {
  const token = localStorage.getItem("access-token") || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const KpiCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius * 2.5,
  minWidth: 170,
  boxShadow: "0 4px 14px rgba(0,0,0,.06)"
}));

const StatBlock = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.shape.borderRadius * 3,
  background: "rgba(255,255,255,.85)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0,0,0,.06)",
  boxShadow: "0 8px 28px rgba(31,38,135,.08)"
}));

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  
  const monthLabels = useMemo(() => [
    t("Janv"), t("Févr"), t("Mars"), t("Avr"), t("Mai"), t("Juin"),
    t("Juil"), t("Août"), t("Sept"), t("Oct"), t("Nov"), t("Déc")
  ], [t]);

  const fmt = (iso) =>
    new Date(iso).toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { weekday: "short", day: "2-digit", month: "short" });
    
  const monthIndex = (d) => (d ? new Date(d).getMonth() : -1);
  
  const countByMonth = (items, dateField) => {
    const arr = new Array(12).fill(0);
    (items || []).forEach(i => {
      const m = monthIndex(i?.[dateField]);
      if (m >= 0) arr[m] += 1;
    });
    return arr;
  };

  const normalizeStatus = (s = "") => {
    const x = (s || "").toLowerCase().trim();
    if (/plan|plann|planifi/.test(x)) return "plan";
    if (/cours|progress|ongoing|in\s*progress/.test(x)) return "en";
    if (/term|complete|réalis|realiz|done|finish/.test(x)) return "done";
    return "other";
  };

  useEffect(() => {
    dispatch(FetchEmployesAction());
    dispatch(fetchAllProjects());
    dispatch(fetchAllSprints());
    dispatch(fetchAllJobOffres());
    dispatch(fetchAllApplications());
    dispatch(fetchAllEvents());
    dispatch(fetchEventTypes());
  }, [dispatch]);

  const users = useSelector(s => s.employe?.list || s.employe?.users || s.user?.list || []);
  const projects = useSelector(s => s.project?.projects || s.project?.list || []);
  const jobOffres = useSelector(s => s.jobOffre?.list || s.jobOffre?.jobOffres || []);
  const applications = useSelector(s => s.application?.list || s.application?.applications || []);
  const events = useSelector(s => s.event?.list || s.event?.events || []);

  const kpi = useMemo(() => ({
    employeesActive: users?.length || 0,
    projectsActive: (projects || []).filter(p => !/(archiv)/i.test(p?.status || "")).length || 0,
    offersOpen: (jobOffres || []).filter(o => (o?.status || "").toLowerCase() === "open").length || 0,
  }), [users, projects, jobOffres]);

  const projectsByMonth = useMemo(() => {
    const series = countByMonth(projects, "startDate");
    return monthLabels.map((m, i) => ({ m, v: series[i] || 0 }));
  }, [projects, monthLabels]);

  const applicationsPerOffer = useMemo(() => {
    const map = new Map();
    (applications || []).forEach(a => {
      const k = a?.jobOffre?.title || a?.jobOffre || "N/A";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([offer, v]) => ({ offer, v }));
  }, [applications]);

  const [avgScoreByOffer, setAvgScoreByOffer] = useState([]);
  useEffect(() => {
    if (!Array.isArray(jobOffres) || jobOffres.length === 0) {
      setAvgScoreByOffer([]);
      return;
    }
    (async () => {
      const results = await Promise.all(
        jobOffres.map(async (o) => {
          try {
            const res = await axios.get(`${API_ANALYSIS_BASE}/${o._id}`, { headers: getAuth() });
            const payload = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            const scores = (payload || []).map(r => Number(r?.score)).filter(Number.isFinite);
            const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
            return { offer: o?.title || o?._id, v: avg };
          } catch {
            return { offer: o?.title || o?._id, v: 0 };
          }
        })
      );
      setAvgScoreByOffer(results);
    })();
  }, [jobOffres]);

  const eventsMonthlyStatus = useMemo(() => {
    const plan = new Array(12).fill(0), en = new Array(12).fill(0), done = new Array(12).fill(0);
    (events || []).forEach(e => {
      const idx = monthIndex(e?.startDate || e?.date); if (idx < 0) return;
      switch (normalizeStatus(e?.status)) {
        case "plan": plan[idx]++; break;
        case "en": en[idx]++; break;
        case "done": done[idx]++; break;
        default: break;
      }
    });
    return { plan, en, done };
  }, [events]);

  const upcomingEvents = useMemo(() => (
    (events || [])
      .filter(e => new Date(e?.startDate || e?.date) >= new Date() && normalizeStatus(e?.status) === "plan")
      .sort((a, b) => new Date(a?.startDate || a?.date) - new Date(b?.startDate || b?.date))
      .slice(0, 6)
      .map(e => ({
        title: e?.title || t("Événement"),
        date: e?.startDate || e?.date,
      }))
  ), [events, t]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const CH = 200;

  return (
    <Box sx={{ p: 2, background: "linear-gradient(135deg,#f5f7fa 0%,#e8eef6 100%)" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Grid container spacing={1.5} alignItems="center" sx={{ width: "auto" }}>
          <Grid item>
            <KpiCard>
              <Avatar sx={{ bgcolor: "primary.light", mr: 1 }}><PeopleAltRoundedIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} lineHeight={1}>{kpi.employeesActive}</Typography>
                <Typography variant="body2" color="text.secondary">{t("Employés")}</Typography>
              </Box>
            </KpiCard>
          </Grid>
          <Grid item>
            <KpiCard>
              <Avatar sx={{ bgcolor: "success.light", mr: 1 }}><FolderOpenRoundedIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} lineHeight={1}>{kpi.projectsActive}</Typography>
                <Typography variant="body2" color="text.secondary">{t("Projets actifs")}</Typography>
              </Box>
            </KpiCard>
          </Grid>
          <Grid item>
            <KpiCard>
              <Avatar sx={{ bgcolor: "warning.light", mr: 1 }}><WorkOutlineRoundedIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} lineHeight={1}>{kpi.offersOpen}</Typography>
                <Typography variant="body2" color="text.secondary">{t("Offres ouvertes")}</Typography>
              </Box>
            </KpiCard>
          </Grid>
        </Grid>

        <IconButton
          color="primary"
          onClick={handleOpen}
          sx={{ bgcolor: "white", boxShadow: "0 2px 10px rgba(0,0,0,.12)", "&:hover": { bgcolor: "white" } }}
        >
          <Badge color="error" invisible={!upcomingEvents.length} badgeContent={upcomingEvents.length}>
            <CalendarMonthRoundedIcon />
          </Badge>
        </IconButton>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <StatBlock>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: .5 }}>{t("Évolution mensuelle des projets")}</Typography>
              <LineChart
                height={CH}
                xAxis={[{ data: monthLabels, scaleType: "point" }]}
                series={[{ data: projectsByMonth.map(p => p.v), label: t("Projets"), showMark: false }]}
                grid={{ vertical: true, horizontal: true }}
              />
            </CardContent>
          </StatBlock>
        </Grid>

        <Grid item xs={12} md={6}>
          <StatBlock>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: .5 }}>{t("Activité événementielle")}</Typography>
              <BarChart
                height={CH}
                xAxis={[{ data: monthLabels, scaleType: "band" }]}
                series={[
                  { label: t("Planifié"), data: eventsMonthlyStatus.plan, stack: "evt" },
                  { label: t("En cours"), data: eventsMonthlyStatus.en, stack: "evt" },
                  { label: t("Terminé"), data: eventsMonthlyStatus.done, stack: "evt" },
                ]}
                grid={{ vertical: true, horizontal: true }}
              />
            </CardContent>
          </StatBlock>
        </Grid>

        <Grid item xs={12} md={6}>
          <StatBlock>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: .5 }}>{t("Offres les plus populaires")}</Typography>
              <BarChart
                height={CH}
                yAxis={[{ data: applicationsPerOffer.slice(0, 8).map(o => o.offer), scaleType: "band" }]}
                series={[{ data: applicationsPerOffer.slice(0, 8).map(o => o.v), label: t("Candidatures") }]}
                layout="horizontal"
                grid={{ horizontal: true }}
              />
            </CardContent>
          </StatBlock>
        </Grid>

        <Grid item xs={12} md={6}>
          <StatBlock>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: .5 }}>{t("Score IA moyen")}</Typography>
              <BarChart
                height={CH}
                xAxis={[
                  { 
                    data: avgScoreByOffer.slice(0, 8).map(o => o.offer), 
                    scaleType: "band",
                    // Customisation de l'affichage de l'axe pour un meilleur rendu visuel
                    tickLabelStyle: {
                      angle: -45, // Rotation des labels pour éviter le chevauchement
                      textAnchor: 'end', // Ancrage à la fin pour un bon alignement
                      fontSize: 10, // Taille de police réduite
                      dominantBaseline: 'ideographic', // Ajustement de la ligne de base
                    },
                  }
                ]}
                series={[
                  { 
                    data: avgScoreByOffer.slice(0, 8).map(o => o.v), 
                    label: t("Score IA (moy.)"),
                    // Ajout d'un slot pour le Tooltip personnalisé sur les barres
                    valueFormatter: (value, context) => {
                      const offerTitle = avgScoreByOffer[context.dataIndex]?.offer || '';
                      return `${offerTitle} : ${value} ${t("points")}`;
                    },
                    tooltip: ({ label, value }) => (
                      <Stack direction="column" spacing={0.5} sx={{ p: 1, bgcolor: 'background.paper', border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="bold">{label}</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 10, height: 10, bgcolor: 'primary.main', borderRadius: '50%' }} />
                          <Typography variant="body2">{t("Score IA (moy.)")} :</Typography>
                          <Typography variant="body2" fontWeight="bold">{value}</Typography>
                        </Stack>
                      </Stack>
                    )
                  }
                ]}
                grid={{ vertical: true }}
              />
            </CardContent>
          </StatBlock>
        </Grid>
      </Grid>

      {/* Le Popover pour les événements reste inchangé, car il ne concerne pas les barres du BarChart */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 360, maxHeight: 420, overflowY: "auto", p: 1.5 } }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          {t("Événements à venir")}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Stack spacing={1.25}>
          {upcomingEvents.length ? upcomingEvents.map((ev, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", color: "#fff", width: 34, height: 34, fontWeight: 700 }}>
                {new Date(ev.date).getDate()}
              </Avatar>
              <Box minWidth={0}>
                <Typography variant="body2" fontWeight={600} noWrap>{ev.title}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {fmt(ev.date)} • {ev.type}
                </Typography>
              </Box>
            </Stack>
          )) : (
            <Typography variant="body2" color="text.secondary">{t("Aucun événement planifié.")}</Typography>
          )}
        </Stack>
      </Popover>
    </Box>
  );
}