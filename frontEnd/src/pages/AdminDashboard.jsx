// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, Grid, Card, CardContent, Typography, Chip, Stack, Avatar, Divider
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import { BarChart, LineChart, Gauge } from "@mui/x-charts";
import { useDispatch, useSelector } from "react-redux";
import { StyledCard } from "../style/style";

/* actions */
import { FetchEmployesAction } from "../redux/actions/employeAction";
import { fetchAllProjects } from "../redux/actions/projectActions";
import { fetchAllSprints } from "../redux/actions/sprintActions";
import { fetchAllJobOffres } from "../redux/actions/jobOffreAction";
import { fetchAllApplications } from "../redux/actions/applicationAction";
import { fetchAllEvents } from "../redux/actions/eventAction";

/* API IA (comme ApplicationList.jsx) */
const API_ANALYSIS_BASE = "http://localhost:3000/application-analysis";
const getAuth = () => {
  const t1 = localStorage.getItem("access-token");
  const t2 = localStorage.getItem("token");
  const token = t1 || t2;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* UI helpers */
const KpiCard = ({ icon, label, value }) => (
  <Card sx={{ px: 2, py: 1.25, borderRadius: 6, maxWidth: 240, boxShadow: "0 4px 16px rgba(0,0,0,.08)" }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar variant="rounded" sx={{ bgcolor: "primary.main", color: "#fff", width: 40, height: 40 }}>
        {icon}
      </Avatar>
      <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="nowrap">
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>{value ?? 0}</Typography>
        <Typography component="span" variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {label}
        </Typography>
      </Stack>
    </Stack>
  </Card>
);

const GroupSection = ({ title, subtitle, children }) => (
  <StyledCard sx={{ p: 0, background: "linear-gradient(135deg,rgba(255,255,255,.95) 0%,rgba(248,250,252,.9) 100%)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 5, boxShadow: "0 12px 40px rgba(0,0,0,.08)" }}>
    <CardContent sx={{ pb: 2, p: 3 }}>
      <Typography variant="h3" sx={{ mb: .5, background: "linear-gradient(135deg,#1976d2 0%,#1565c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>{title}</Typography>
      {subtitle && <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 500, opacity: .8 }}>{subtitle}</Typography>}
      <Divider sx={{ mb: 2.5, background: "linear-gradient(90deg,rgba(25,118,210,.3) 0%,rgba(25,118,210,.1) 50%,rgba(25,118,210,.3) 100%)", height: 2, borderRadius: 1 }} />
      {children}
    </CardContent>
  </StyledCard>
);

const SubBlock = ({ title, children, right, description }) => (
  <StyledCard sx={{ background: "linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(250,252,255,.8) 100%)", backdropFilter: "blur(10px)", border: "1px solid rgba(25,118,210,.08)", borderRadius: 4, boxShadow: "0 6px 24px rgba(25,118,210,.08)" }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{title}</Typography>
        {right}
      </Stack>
      {children}
      {description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>}
    </CardContent>
  </StyledCard>
);

/* utils */
const monthLabels = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];
const monthIndex = (d) => (d ? new Date(d).getMonth() : -1);
const countByMonth = (items, dateField) => {
  const arr = new Array(12).fill(0);
  items?.forEach(i => {
    const m = monthIndex(i?.[dateField]);
    if (m >= 0) arr[m] += 1;
  });
  return arr;
};

/* normalisation des statuts (EN/FR → plan/en/done) */
const normalizeStatus = (s = "") => {
  const x = s.toLowerCase().trim();
  if (/plan|plann|planifié/.test(x)) return "plan";                     // Planned / Planifié
  if (/cours|progress|ongoing|in\s*progress/.test(x)) return "en";      // En cours
  if (/term|complete|réalis|realiz|done|finish/.test(x)) return "done"; // Completed / Terminé
  if (/annul|cancel/.test(x)) return "cancel";
  return "other";
};

/* ---- Helpers progression projet (fix jauge) ---- */
const normalizeProjectStatus = (s = "") => {
  const x = s.toLowerCase().trim();
  if (/completed|termin|réalis/.test(x)) return "done";
  if (/ongoing|in\s*progress|encours/.test(x)) return "ongoing";
  if (/planned|planifi/.test(x)) return "planned";
  return "other";
};
const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const progressForProject = (p) => {
  const manual = Number(p?.progress);
  if (Number.isFinite(manual)) return clamp(manual);
  const st = normalizeProjectStatus(p?.status);
  if (st === "done") return 100;
  if (st === "ongoing") {
    const start = p?.startDate ? new Date(p.startDate).getTime() : NaN;
    const end   = p?.endDate   ? new Date(p.endDate).getTime()   : NaN;
    const now   = Date.now();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      const ratio = ((now - start) / (end - start)) * 100;
      return clamp(Math.floor(ratio), 0, 99); // 99 max pour distinguer d'un Completed
    }
    return 0;
  }
  return 0;
};

export default function AdminDashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchEmployesAction());
    dispatch(fetchAllProjects());
    dispatch(fetchAllSprints());
    dispatch(fetchAllJobOffres());
    dispatch(fetchAllApplications());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  /* store */
  const users        = useSelector(s => s.employe?.list || s.employe?.users || s.user?.list || []);
  const projects     = useSelector(s => s.project?.projects || s.project?.list || []);
  const jobOffres    = useSelector(s => s.jobOffre?.list || s.jobOffre?.jobOffres || []);
  const applications = useSelector(s => s.application?.list || s.application?.applications || []);
  const events       = useSelector(s => s.event?.list || s.event?.events || []);

  /* KPI */
  const kpi = useMemo(() => ({
    employeesActive: users?.length || 0,
    projectsActive : projects?.filter(p => !/(archiv)/i.test(p?.status || "")).length || 0,
    offersOpen     : jobOffres?.filter(o => (o?.status || "").toLowerCase() === "open").length || 0,
  }), [users, projects, jobOffres]);

  /* Delivery (FIXED) */
  const portfolioCompletion = useMemo(() => {
    const total = projects?.length || 0;
    if (!total) return 0;
    const sum = projects.reduce((acc, p) => acc + progressForProject(p), 0);
    return Math.round(sum / total);
  }, [projects]);

  const projectsByMonth = useMemo(() => {
    const series = countByMonth(projects, "startDate");
    return monthLabels.map((m,i) => ({ month: m, projects: series[i] || 0 }));
  }, [projects]);

  /* Recrutement – candidatures par offre */
  const applicationsPerOffer = useMemo(() => {
    const map = new Map();
    applications?.forEach(a => {
      const k = a?.jobOffre?.title || a?.jobOffre || "N/A";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([offer, v]) => ({ offer, v })).slice(0, 10);
  }, [applications]);

  /* Recrutement – Score IA moyen par offre (API IA) */
  const [avgScoreByOffer, setAvgScoreByOffer] = useState([]);
  useEffect(() => {
    if (!Array.isArray(jobOffres) || jobOffres.length === 0) {
      setAvgScoreByOffer([]);
      return;
    }
    const run = async () => {
      const results = await Promise.all(
        jobOffres.map(async (o) => {
          try {
            const res = await axios.get(`${API_ANALYSIS_BASE}/${o._id}`, { headers: { ...getAuth() } });
            const payload = Array.isArray(res.data?.data) ? res.data.data
                          : (Array.isArray(res.data) ? res.data : []);
            const scores = (payload || [])
              .map(r => Number(r?.score))
              .filter(Number.isFinite);
            const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0) / scores.length) : 0;
            return { offer: o?.title || o?.name || String(o?._id), v: avg };
          } catch {
            return { offer: o?.title || String(o?._id), v: 0 };
          }
        })
      );
      setAvgScoreByOffer(results.filter(r => r.v > 0).slice(0, 8));
    };
    run();
  }, [jobOffres]);

  /* Events — normalisés */
  const eventsMonthlyStatus = useMemo(() => {
    const plan = new Array(12).fill(0);
    const en   = new Array(12).fill(0);
    const done = new Array(12).fill(0);

    (events || []).forEach(e => {
      const idx = monthIndex(e?.startDate || e?.date);
      if (idx < 0) return;
      switch (normalizeStatus(e?.status)) {
        case "plan": plan[idx]++; break;
        case "en":   en[idx]++;   break;
        case "done": done[idx]++; break;
        default: break;
      }
    });

    return monthLabels.map((m,i) => ({ m, plan: plan[i], en: en[i], done: done[i] }));
  }, [events]);

  const upcomingEvents = useMemo(() => (
    events
      ?.filter(e =>
        new Date(e?.startDate || e?.date) >= new Date() &&
        normalizeStatus(e?.status) === "plan"
      )
      ?.sort((a,b) => new Date(a?.startDate || a?.date) - new Date(b?.startDate || b?.date))
      ?.slice(0,3)
      ?.map(e => ({
        title: e?.title || e?.name || "Événement",
        date : e?.startDate || e?.date,
        type : e?.type_event || e?.type || "Événement",
        location: e?.location || "-",
      })) || []
  ), [events]);

  const fmt = (iso) => new Date(iso).toLocaleString("fr-FR", { weekday:"short", day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" });

  /* render */
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: 6, background: "linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)", minHeight: "100vh" }}>
      {/* KPIs */}
      <Grid container spacing={2} alignItems="center" wrap="wrap" sx={{ mb: 3 }}>
        <Grid item xs="auto"><KpiCard icon={<PeopleAltRoundedIcon />} label="Employés" value={kpi.employeesActive} /></Grid>
        <Grid item xs="auto"><KpiCard icon={<FolderOpenRoundedIcon />} label="Projets actifs" value={kpi.projectsActive} /></Grid>
        <Grid item xs="auto"><KpiCard icon={<WorkOutlineRoundedIcon />} label="Offres ouvertes" value={kpi.offersOpen} /></Grid>
      </Grid>

      {/* DELIVERY */}
      <GroupSection title="Delivery" subtitle="Flux de travail et capacité">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <SubBlock title="Achèvement portefeuille" description="Taux global d'avancement des projets.">
              <Box sx={{ display:"flex", justifyContent:"center", alignItems:"center", py:2 }}>
                <Gauge value={portfolioCompletion} startAngle={-110} endAngle={110} width={260} height={170} />
              </Box>
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={6}>
            <SubBlock title="Projets actifs / mois" description="Créations/activations de projets par mois.">
              <LineChart
                xAxis={[{ data: monthLabels, scaleType: "point" }]}
                series={[{ data: projectsByMonth.map(p => p.projects), label: "Projets" }]}
                height={260}
                grid={{ vertical: true, horizontal: true }}
              />
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>

      <Box sx={{ height: 24 }} />

      {/* RECRUTEMENT */}
      <GroupSection title="Recrutement" subtitle="Attractivité et qualité des candidatures">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <SubBlock title="Candidatures par offre" description="(Applications ↔ JobOffers).">
              <BarChart
                height={260}
                yAxis={[{ data: applicationsPerOffer.map(o => o.offer), scaleType: "band" }]}
                series={[{ data: applicationsPerOffer.map(o => o.v), label: "Candidatures" }]}
                layout="horizontal"
                grid={{ horizontal: true }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={5}>
            <SubBlock title="Score IA moyen par offre" description="Moyenne des scores analysés par offre.">
              <BarChart
                height={260}
                xAxis={[{ data: avgScoreByOffer.map(o => o.offer), scaleType: "band" }]}
                series={[{ data: avgScoreByOffer.map(o => o.v), label: "Score IA (moy.)" }]}
                grid={{ vertical: true }}
              />
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>

      <Box sx={{ height: 24 }} />

      {/* ÉVÉNEMENTS */}
      <GroupSection title="Engagement des Employés" subtitle="Statuts mensuels & prochains événements">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}>
            <SubBlock title="Statuts par mois" description="Event.status via Event.startDate">
              <BarChart
                height={280}
                xAxis={[{ data: monthLabels, scaleType: "band" }]}
                series={[
                  { label: "Planifié", data: eventsMonthlyStatus.map(e => e.plan), stack: "evt" },
                  { label: "En cours", data: eventsMonthlyStatus.map(e => e.en),   stack: "evt" },
                  { label: "Terminé",  data: eventsMonthlyStatus.map(e => e.done), stack: "evt" },
                ]}
                grid={{ vertical: true, horizontal: true }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={4}>
            <SubBlock title="Événements à venir">
              <Stack spacing={1.2}>
                {upcomingEvents.map((ev, idx) => (
                  <Stack key={idx} direction="row" spacing={1.2} alignItems="center" sx={{ p: 1.2, borderRadius: 2, border: "1px solid #e3f2fd", background: "#fff" }}>
                    <Avatar sx={{ bgcolor: "primary.main", color: "#fff", width: 36, height: 36, fontWeight: 700 }}>
                      {ev.type?.[0] || "É"}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>{ev.title}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{fmt(ev.date)} • {ev.type} • {ev.location}</Typography>
                    </Box>
                    <Chip label="à venir" size="small" color="primary" variant="outlined" />
                  </Stack>
                ))}
              </Stack>
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>

      <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
        <Typography variant="caption" sx={{ fontWeight: 500, opacity: .7, background: "rgba(255,255,255,.8)", backdropFilter: "blur(10px)", p: "8px 16px", borderRadius: 3, border: "1px solid rgba(0,0,0,.05)" }}>
          Données live via Redux + API IA • aucun mock
        </Typography>
      </Box>
    </Box>
  );
}
