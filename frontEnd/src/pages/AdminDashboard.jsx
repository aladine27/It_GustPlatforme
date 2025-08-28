// src/pages/AdminDashboard.jsx
import { useMemo, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Chip, Stack, Avatar, Divider } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import { PieChart, BarChart, LineChart, Gauge } from "@mui/x-charts";
import { StyledCard } from "../style/style";

/* ================== DONNÉES MOCK — basées sur TES TABLES ==================
   > user(roleString), Project(status,startDate,endDate), Sprint, Task(status, startDate, endDate),
   > Leave(status, startDate, endDate, leaveType), Joboffer(status), Application(jobOffer ref),
   > applicationAnalysis(scoreIA, email, filename), Documents(status, deliveryDate, traitementDateLimiteDate),
   > Event(status, startDate, type_event), Notification(status:Boolean)
========================================================================== */
const kpi = {
  employeesActive: 268,                 // user
  projectsActive: 12,                   // Project(status=active)
  tasksDoneThisMonth: 120,              // Task(status=Terminées, mois courant)
  leavesPending: 9,                     // Leave(status=Pending)
  offersOpen: 8,                        // Joboffer(status=Open)
  notifUnread: 325,                     // Notification(status=false)
};
const peopleKpis = { totalEmployees: 20 };

// Tâches par statut (Task.status)
const tasksByStatus = [
  { id: "À faire", value: 42 },
  { id: "En cours", value: 68 },
  { id: "Terminées", value: 120 },
];

// Vitesse par sprint = tasks terminées / sprint (Task lié à Sprint)
const sprintVelocity = [
  { sprint: "S1", done: 18 },
  { sprint: "S2", done: 22 },
  { sprint: "S3", done: 25 },
  { sprint: "S4", done: 27 },
];

// Achèvement moyen portefeuille (Project) – jauge simple
const portfolioCompletion = 76;

// Projets actifs par mois (Project.startDate) — vue de charge
const projectsByMonth = [
  { month: "Janv", projects: 12 }, { month: "Févr", projects: 15 }, { month: "Mars", projects: 14 },
  { month: "Avr",  projects: 18 }, { month: "Mai",  projects: 17 }, { month: "Juin", projects: 20 },
  { month: "Juil", projects: 21 }, { month: "Août", projects: 24 }, { month: "Sept", projects: 23 },
  { month: "Oct",  projects: 25 }, { month: "Nov",  projects: 27 }, { month: "Déc",  projects: 26 },
];

// Congés: stack mensuel par statut (Leave.status + startDate)
const leavesMonthlyStatus = [
  { m: "Janv", ap: 20, pd: 6, rj: 2 },
  { m: "Févr", ap: 22, pd: 7, rj: 2 },
  { m: "Mars", ap: 18, pd: 6, rj: 3 },
  { m: "Avr",  ap: 25, pd: 5, rj: 2 },
  { m: "Mai",  ap: 21, pd: 7, rj: 3 },
  { m: "Juin", ap: 26, pd: 6, rj: 2 },
];

// Types de congés (Leave.leaveType)
const leaveTypesTop = [
  { type: "Annuel", v: 34 },
  { type: "Maladie", v: 22 },
  { type: "Sans solde", v: 12 },
];

// Recrutement: candidatures par offre (Application -> Joboffer)
const applicationsPerOffer = [
  { offer: "DevOps", v: 210 },
  { offer: "Frontend", v: 160 },
  { offer: "Backend", v: 130 },
  { offer: "QA", v: 95 },
];

// Qualité moyenne IA par offre (applicationAnalysis.scoreIA agrégé par jobOffer)
const avgScoreByOffer = [
  { offer: "DevOps", v: 78 },
  { offer: "Frontend", v: 72 },
  { offer: "Backend", v: 69 },
  { offer: "QA", v: 65 },
];

// Documents: statut + SLA retard (deliveryDate > traitementDateLimiteDate)
const documentsStatus = [
  { id: "Validés", value: 96 },
  { id: "En cours", value: 28 },
  { id: "Refusés", value: 7 },
];
const documentsSLA = [
  { id: "Dans les délais", value: 88 },
  { id: "En retard", value: 20 },
];

// Événements (Event.type / status)
const eventsByType = [
  { id: "Réunion", value: 12 },
  { id: "Formation", value: 5 },
  { id: "Atelier", value: 4 },
];
const eventsByStatus = [
  { id: "Planifié", value: 14 },
  { id: "Réalisé", value: 22 },
  { id: "Annulé", value: 3 },
];
// --- ÉVÉNEMENTS : par mois et par statut (Event.startDate, Event.status) ---
const eventsMonthlyStatus = [
  { m: "Janv", plan: 6, en: 2, done: 3 },
  { m: "Févr", plan: 7, en: 3, done: 4 },
  { m: "Mars", plan: 5, en: 2, done: 5 },
  { m: "Avr",  plan: 8, en: 3, done: 6 },
  { m: "Mai",  plan: 6, en: 4, done: 5 },
  { m: "Juin", plan: 7, en: 3, done: 7 },
];

// --- Durée moyenne en heures par mois (Event.duration) ---
const eventsAvgDuration = [
  { m: "Janv", h: 1.4 },
  { m: "Févr", h: 1.7 },
  { m: "Mars", h: 1.3 },
  { m: "Avr",  h: 2.0 },
  { m: "Mai",  h: 1.6 },
  { m: "Juin", h: 1.9 },
];


// Notifications: lues vs non lues (Notification.status)
const notifRead = [
  { id: "Non lues", value: kpi.notifUnread },
  { id: "Lues", value: 955 },
];
// ---- au-dessus du composant, ajoute ces mocks (ou branche ta data réelle) ----
const totalEmployees = Number(
  (peopleKpis?.totalEmployees) ??
  (kpi?.employeesActive) ??
  (kpi?.users) ??
  0
);

// Employés en congé par mois (à calculer côté backend depuis Leave.approuvés)
const employeesOnLeaveMonthly = [
  { m: "Janv", on: 12 },
  { m: "Févr", on: 15 },
  { m: "Mars", on: 14 },
  { m: "Avr",  on: 18 },
  { m: "Mai",  on: 16 },
  { m: "Juin", on: 19 },
];
const upcomingEvents = [
  { title: "Réunion plénière T3",    date: "2025-09-05T10:00:00", type: "Réunion",   location: "Siège",     status: "Planifié" },
  { title: "Formation sécurité",     date: "2025-09-10T14:00:00", type: "Formation", location: "En ligne",  status: "Planifié" },
  { title: "Atelier d’équipe",       date: "2025-09-15T09:30:00", type: "Atelier",    location: "Salle B",  status: "Planifié" },
  { title: "Démo projet Phoenix",    date: "2025-09-18T16:00:00", type: "Réunion",   location: "Salle A",  status: "Planifié" },
  { title: "Onboarding juniors",     date: "2025-09-20T09:00:00", type: "Formation", location: "Open space",status: "Planifié" },
  { title: "Rétro sprint S5",        date: "2025-09-23T11:00:00", type: "Réunion",   location: "Teams",     status: "Planifié" },
];

// Petit helper pour formater la date en FR
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ================== UI HELPERS ================== */
const KpiCard = ({ icon, label, value }) => (
  <Card
    sx={{
      px: 2, py: 1.25,
      borderRadius: 6,
      maxWidth: 240,           // carte plus fine
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        variant="rounded"
        sx={{ bgcolor: "primary.main", color: "#fff", width: 40, height: 40 }}
      >
        {icon}
      </Avatar>

      {/* chiffre + libellé sur UNE ligne */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="baseline"
        flexWrap="nowrap"
      >
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        <Typography
          component="span"
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}  // évite le retour à la ligne
        >
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

/* ================== PAGE ================== */
export default function AdminDashboard() {
  const months = useMemo(() => leavesMonthlyStatus.map(m => m.m), []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: 6, background: "linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)", minHeight: "100vh" }}>
      {/* KPIs CLÉS */}
      <Grid container spacing={2} alignItems="center" justifyContent="flex-start" wrap="wrap" sx={{ mb: 3 }}>
      <Grid item xs="auto">
        <KpiCard icon={<PeopleAltRoundedIcon />} label="Employés" value={kpi.employeesActive} />
      </Grid>
      <Grid item xs="auto">
        <KpiCard icon={<FolderOpenRoundedIcon />} label="Projets actifs" value={kpi.projectsActive} />
      </Grid>
      <Grid item xs="auto">
        <KpiCard icon={<WorkOutlineRoundedIcon />} label="Offres ouvertes" value={kpi.offersOpen} />
      </Grid>
      <Grid item xs="auto">
        <KpiCard icon={<NotificationsActiveRoundedIcon />} label="Notif non lues" value={kpi.notifUnread} />
      </Grid>
    </Grid>

      {/* DELIVERY */}
<GroupSection title="Delivery" subtitle="Flux de travail et capacité">
  <Grid container spacing={2.5}>
    {/* Bloc 1 : Projet accompli */}
    <Grid item xs={12} md={6}>
      <SubBlock
        title="Projet Accompli par rapport au nombre total de projets"
        description="Vision instantanée du taux d'accomplissement global du projet en cours"
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 2 }}>
          <Gauge
            value={portfolioCompletion}
            startAngle={-110}
            endAngle={110}
            width={260}
            height={170}
          />
        </Box>
      </SubBlock>
    </Grid>

    {/* Bloc 2 : Tâches accomplies */}
    <Grid item xs={12} md={6}>
      <SubBlock
        title="Tâches accomplies par Sprints"
        description="Cadence réelle de livraison (Tasks Done / Sprint)."
      >
        <BarChart
          height={240}
          xAxis={[{ data: sprintVelocity.map(s => s.sprint), scaleType: "band" }]}
          series={[{ data: sprintVelocity.map(s => s.done), label: "Tâches terminées" }]}
          grid={{ vertical: true }}
        />
      </SubBlock>
    </Grid>

    {/* Bloc 3 : Projets actifs */}
    <Grid item xs={12}>
      <SubBlock
        title="Projets actifs / mois"
        description="Charge initiée par mois pour planifier la capacité (Project.startDate)."
      >
        <LineChart
          xAxis={[{ data: projectsByMonth.map(p => p.month), scaleType: "point" }]}
          series={[{ data: projectsByMonth.map(p => p.projects), label: "Projets" }]}
          height={260}
          grid={{ vertical: true, horizontal: true }}
        />
      </SubBlock>
    </Grid>
  </Grid>
</GroupSection>
      <Box sx={{ height: 24 }} />
      {/* CONGÉS */}
    <Grid item xs={12} md={5}>
  <SubBlock
    title="Employés en congé / Présents"
    description="Effectif en congé approuvé et effectif présent par mois (Leave.status='Approuvé')."
  >
    <BarChart
      height={280}
      xAxis={[{ data: employeesOnLeaveMonthly.map(e => e.m), scaleType: "band" }]}
      series={[
        {
          label: "En congé",
          data: employeesOnLeaveMonthly.map(e => e.on),
          stack: "eff"
        },
       {
          label: "Présents",
          data: employeesOnLeaveMonthly.map(e =>
            Math.max(totalEmployees - Number(e.on || 0), 0)
          ),
          stack: "eff",
        }
      ]}
      grid={{ vertical: true, horizontal: true }}
    />
    <Typography variant="caption" color="text.secondary">
      Présents = {totalEmployees} − En congé (par mois).
    </Typography>
  </SubBlock>
</Grid>
      <Box sx={{ height: 24 }} />
      {/* RECRUTEMENT */}
      <GroupSection title="Recrutement" subtitle="Attractivité et qualité des candidatures">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <SubBlock title="Candidatures par offre" description="Identifie les postes attractifs (Application ↔ Joboffer).">
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
            <SubBlock title="Score IA moyen par offre" description="Mesure de la qualité des profils (applicationAnalysis.scoreIA).">
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
      {/* ÉVÉNEMENTS & NOTIFS */}
  {/* ÉVÉNEMENTS */}
<GroupSection title="Engagement des Employées" subtitle="Statuts mensuels & durée moyenne">
  <Grid container spacing={2.5}>
    {/* Statuts par mois (stack) */}
    <Grid item xs={12} md={8}>
      <SubBlock
        title="Statuts par mois"
        description="Comptes d'événements planifiés / en cours / terminés (Event.status) par mois (Event.startDate)."
      >
        <BarChart
          height={280}
          xAxis={[{ data: eventsMonthlyStatus.map(e => e.m), scaleType: "band" }]}
          series={[
            { label: "Planifié", data: eventsMonthlyStatus.map(e => e.plan), stack: "evt" },
            { label: "En cours", data: eventsMonthlyStatus.map(e => e.en),   stack: "evt" },
            { label: "Terminé",  data: eventsMonthlyStatus.map(e => e.done), stack: "evt" },
          ]}
          grid={{ vertical: true, horizontal: true }}
        />
      </SubBlock>
    </Grid>

    {/* Colonne droite : Événements à venir + Notifs */}
    <Grid item xs={12} md={4}>
      <Stack spacing={2}>
        {/* Événements à venir (3 items) */}
        <SubBlock title="Événements à venir">
          <Stack spacing={1.2}>
            {upcomingEvents
              .filter(e => new Date(e.date) >= new Date() && e.status === "Planifié")
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 3)
              .map((ev, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  sx={{ p: 1.2, borderRadius: 2, border: "1px solid #e3f2fd", background: "#fff" }}
                >
                  <Avatar sx={{ bgcolor: "primary.main", color: "#fff", width: 36, height: 36, fontWeight: 700 }}>
                    {ev.type?.[0] || "É"}
                  </Avatar>

                  <Box flex={1} minWidth={0}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                      {ev.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {formatDateTime(ev.date)} • {ev.type} • {ev.location}
                    </Typography>
                  </Box>

                  <Chip label="à venir" size="small" color="primary" variant="outlined" />
                </Stack>
              ))}
          </Stack>
        </SubBlock>

        {/* Notifications lues / non lues (donut) */}
        <SubBlock title="Notifications (lues / non lues)">
          <PieChart
            height={220}
            series={[
              {
                innerRadius: 40,
                paddingAngle: 4,
                cornerRadius: 4,
                data: notifRead.map((d, i) => ({ id: i, value: d.value, label: d.id })),
              },
            ]}
            slotProps={{
              legend: { position: { vertical: "middle", horizontal: "right" } },
            }}
          />
        </SubBlock>
      </Stack>
    </Grid>
  </Grid>
</GroupSection>



      <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
        <Typography variant="caption" sx={{ fontWeight: 500, opacity: .7, background: "rgba(255,255,255,.8)", backdropFilter: "blur(10px)", p: "8px 16px", borderRadius: 3, border: "1px solid rgba(0,0,0,.05)" }}>
          Données mock alignées sur le schéma • Charts = indicateurs décisionnels (admin)
        </Typography>
      </Box>
    </Box>
  );
}
