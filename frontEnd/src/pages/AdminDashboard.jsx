import { useMemo, useState } from "react";
import {Box, Grid, Card, CardContent, Typography, Chip, Stack, Avatar,Divider} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import {PieChart,BarChart,LineChart,Gauge} from "@mui/x-charts";

import { StyledCard } from "../style/style";

/* ================== DONNÉES MOCK ================== */
const kpi = {
  users: 1432,
  projectsActive: 12,
  jobOpen: 8,
  applications: 245,
  notifications: 325,
};
const usersByRole = [
  { id: "Admin", value: 8 },
  { id: "Manager", value: 18 },
  { id: "RH", value: 12 },
  { id: "Employé", value: 208 },
];
const leavesMonthlyStatus = [
  { m: "Janv", ap: 6, rj: 1, pd: 2 },
  { m: "Févr", ap: 7, rj: 2, pd: 3 },
  { m: "Mars", ap: 6, rj: 1, pd: 3 },
  { m: "Avr",  ap: 8, rj: 2, pd: 2 },
  { m: "Mai",  ap: 7, rj: 1, pd: 3 },
  { m: "Juin", ap: 9, rj: 2, pd: 2 },
];
const leaveTypesTop3 = [
  { type: "Annuel", v: 34 },
  { type: "Maladie", v: 22 },
  { type: "Sans solde", v: 12 },
];
const monthlyLeaves = [
  { month: "Janv", v: 18 }, { month: "Févr", v: 22 }, { month: "Mars", v: 20 },
  { month: "Avr",  v: 25 }, { month: "Mai",  v: 21 }, { month: "Juin", v: 26 },
  { month: "Juil", v: 24 }, { month: "Août", v: 29 }, { month: "Sept", v: 30 },
  { month: "Oct",  v: 28 }, { month: "Nov",  v: 31 }, { month: "Déc",  v: 33 },
];
const applicationsPerOffer = [
  { offer: "DevOps",   v: 210 },
  { offer: "Frontend", v: 160 },
  { offer: "Backend",  v: 130 },
  { offer: "QA",       v: 95  },
  { offer: "Data",     v: 80  },
];
const jobByCategory = [
  { id: "Informatique", value: 6 },
  { id: "Ressources Humaines", value: 3 },
  { id: "Ventes", value: 2 },
  { id: "Design", value: 4 },
];
const offersStatus = [
  { id: "Ouvertes", value: 8 },
  { id: "Clôturées", value: 5 },
];
const tasksByStatus = [
  { id: "À faire", value: 42 },
  { id: "En cours", value: 68 },
  { id: "Terminées", value: 120 },
];
const sprintsStats = { inProgress: 3, done: 5 };
const burndown = [
  { d: "Lun", r: 50 }, { d: "Mar", r: 44 }, { d: "Mer", r: 38 },
  { d: "Jeu", r: 29 }, { d: "Ven", r: 22 }, { d: "Sam", r: 15 }, { d: "Dim", r: 8 },
];
const projectCompletion = 75;
const documentsMonthly = [
  { m: "Janv", gen: 10, val: 7,  aw: 2 },
  { m: "Févr", gen: 15, val: 12, aw: 3 },
  { m: "Mars", gen: 16, val: 13, aw: 2 },
  { m: "Avr",  gen: 18, val: 14, aw: 3 },
  { m: "Mai",  gen: 19, val: 15, aw: 2 },
  { m: "Juin", gen: 22, val: 17, aw: 3 },
];
const docByType = [
  { id: "Contrat", value: 64 },
  { id: "Attestation", value: 48 },
  { id: "Politique", value: 32 },
  { id: "Autre", value: 20 },
];
const eventsStatus = [
  { id: "Planifié", value: 14 },
  { id: "Réalisé", value: 22 },
  { id: "Annulé", value: 3 },
];
const typeEvents = [
  { id: "Réunion", value: 12 },
  { id: "Formation", value: 5 },
  { id: "Atelier", value: 4 },
  { id: "Autre", value: 3 },
];
const upcomingEvents = [
  { title: "Réunion plénière T3", date: "2025-09-05 10:00", type: "Réunion",   location: "Siège" },
  { title: "Formation sécurité",  date: "2025-09-10 14:00", type: "Formation", location: "En ligne" },
  { title: "Atelier d’équipe",    date: "2025-09-15 09:30", type: "Atelier",    location: "Salle B" },
];
const notifStats = [
  { id: "Non lues", value: kpi.notifications },
  { id: "Lues",     value: 955 },
];
const recentNotifications = [
  { title: "Nouvelle politique ajoutée", ago: "il y a 2 h", unread: true },
  { title: "Sprint de projet clôturé",   ago: "hier",       unread: false },
  { title: "Nouvelle offre publiée",     ago: "il y a 2 j", unread: false },
];
const headcountTrend = [
  { m: "Janv", employees: 210, hires: 8,  exits: 3 },
  { m: "Févr", employees: 218, hires: 12, exits: 4 },
  { m: "Mars", employees: 225, hires: 9,  exits: 2 },
  { m: "Avr",  employees: 233, hires: 10, exits: 2 },
  { m: "Mai",  employees: 236, hires: 6,  exits: 3 },
  { m: "Juin", employees: 242, hires: 9,  exits: 3 },
  { m: "Juil", employees: 246, hires: 7,  exits: 3 },
  { m: "Août", employees: 251, hires: 8,  exits: 3 },
  { m: "Sept", employees: 255, hires: 6,  exits: 2 },
  { m: "Oct",  employees: 260, hires: 8,  exits: 3 },
  { m: "Nov",  employees: 264, hires: 7,  exits: 3 },
  { m: "Déc",  employees: 268, hires: 6,  exits: 2 },
];
const peopleKpis = { totalEmployees: 268, managers: 18, teams: 5 };
/* ================== COMPOSANTS ================== */
const KpiCard = ({ icon, label, value, sub }) => (
  <Card
    sx={{
      p: 0,
      background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(25,118,210,0.1)",
      borderRadius: 4,
      boxShadow: "0 8px 32px rgba(25,118,210,0.12)",
      transition: "all .3s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 48px rgba(25,118,210,.2)", border: "1px solid rgba(25,118,210,.2)" },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar variant="rounded" sx={{
          background: "linear-gradient(135deg,#1976d2 0%,#42a5f5 100%)",
          color: "#fff", width: 48, height: 48, boxShadow: "0 4px 16px rgba(25,118,210,.3)"
        }}>
          {icon}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h6" sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg,#1a1a1a 0%,#333 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
        {sub && <Chip size="small" color="primary" label={sub} sx={{ fontWeight: 600 }} />}
      </Stack>
    </CardContent>
  </Card>
);
const GroupSection = ({ title, subtitle, children }) => (
  <StyledCard
    sx={{
      p: 0,
      background: "linear-gradient(135deg,rgba(255,255,255,.95) 0%,rgba(248,250,252,.9) 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,.2)",
      borderRadius: 5,
      boxShadow: "0 12px 40px rgba(0,0,0,.08)"
    }}
  >
    <CardContent sx={{ pb: 2, p: 3 }}>
      <Typography
        variant="h3"
        sx={{
          mb: .5,
          background: "linear-gradient(135deg,#1976d2 0%,#1565c0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 500, opacity: .8 }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ mb: 2.5, background: "linear-gradient(90deg,rgba(25,118,210,.3) 0%,rgba(25,118,210,.1) 50%,rgba(25,118,210,.3) 100%)", height: 2, borderRadius: 1 }} />
      {children}
    </CardContent>
  </StyledCard>
);
const SubBlock = ({ title, children, right, description }) => (
  <StyledCard
    sx={{
      background: "linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(250,252,255,.8) 100%)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(25,118,210,.08)",
      borderRadius: 4,
      boxShadow: "0 6px 24px rgba(25,118,210,.08)"
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{title}</Typography>
        {right}
      </Stack>
      {children}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
    </CardContent>
  </StyledCard>
);

/* ================== PAGE ================== */
export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState("12 derniers mois");
  const months = useMemo(() => monthlyLeaves.map(m => m.month), []);
  const monthsVals = useMemo(() => monthlyLeaves.map(m => m.v), []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: 6, background: "linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)", minHeight: "100vh" }}>
      {/* KPIs */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KpiCard icon={<PeopleAltRoundedIcon />} label="Utilisateurs actifs" value={kpi.users} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KpiCard icon={<FolderOpenRoundedIcon />} label="Projets en cours" value={kpi.projectsActive} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KpiCard icon={<WorkOutlineRoundedIcon />} label="Offres d’emploi ouvertes" value={kpi.jobOpen} />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KpiCard icon={<ArticleOutlinedIcon />} label="Candidatures totales" value={kpi.applications} />
        </Grid>
      </Grid>
      {/* DELIVERY */}
      <GroupSection title="Livraison" subtitle="Projets, tâches et sprints">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <SubBlock
              title="Achèvement des projets"
              description="Jauge d’avancement moyen des projets actifs."
            >
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 2 }}>
                <Gauge value={projectCompletion} startAngle={-110} endAngle={110} width={260} height={170} />
              </Box>
              <Typography variant="subtitle2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
                Actifs 34 • Clôturés 27
              </Typography>
            </SubBlock>
          </Grid>
          <Grid item xs={12} md={4}>
            <SubBlock
              title="Tâches par statut"
              description="Répartition des tâches (À faire, En cours, Terminées) sur l’ensemble des projets."
            >
              <PieChart
                series={[{ data: tasksByStatus.map((s, i) => ({ id: i, value: s.value, label: s.id })), innerRadius: 40, paddingAngle: 2 }]}
                height={230}
                slotProps={{ legend: { direction: "column", position: { vertical: "middle", horizontal: "right" } } }}
              />
            </SubBlock>
          </Grid>
          <Grid item xs={12} md={4}>
            <SubBlock
              title="Burn‑down du sprint"
           
              description="Charge de travail restante au fil des jours du sprint. Plus ça descend vite, mieux c’est."
            >
              <LineChart
                xAxis={[{ data: burndown.map(b => b.d), scaleType: "point" }]}
                series={[{ data: burndown.map(b => b.r), label: "Restant" }]}
                height={230}
              />
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>
      <Box sx={{ height: 24 }} />
      {/* PEOPLE & TEAMS */}
      <GroupSection title="Personnes & Équipes" subtitle="Utilisateurs, rôles et dynamique d’équipes">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={5} lg={4}>
            <SubBlock
              title="Utilisateurs par rôle"
             
              description="Répartition de tous les comptes par rôle. Permet d’équilibrer les profils (Admin, Manager, RH, Employé)."
            >
              <PieChart
                series={[{ data: usersByRole.map((r, i) => ({ id: i, value: r.value, label: r.id })), innerRadius: 32, paddingAngle: 2 }]}
                height={220}
                slotProps={{ legend: { direction: "column", position: { vertical: "middle", horizontal: "right" } } }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <SubBlock
              title="Évolution des effectifs (12 mois)"
              right={
                <Stack direction="row" spacing={1}>
                  <Chip label={`Employés : ${peopleKpis.totalEmployees}`} color="primary" />
 
                </Stack>
              }
              description="Effectif total (zone) et flux mensuels (entrées/sorties). Utile pour suivre la croissance et le turnover."
            >
              <LineChart
                xAxis={[{ data: headcountTrend.map(x => x.m), scaleType: "point" }]}
                series={[
                  { label: "Employés", data: headcountTrend.map(x => x.employees), area: true },
                  { label: "Arrivées", data: headcountTrend.map(x => x.hires) },
                  { label: "Départs",  data: headcountTrend.map(x => x.exits) },
                ]}
                height={260}
                grid={{ vertical: true, horizontal: true }}
              />
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>
      <Box sx={{ height: 24 }} />
      {/* CONGÉS */}
      <GroupSection title="Congés" subtitle="Volumes, statuts et tendances">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <SubBlock
              title="Statut des congés par mois"
              description="Barres empilées montrant le nombre de congés Approuvés, En attente et Rejetés pour chaque mois."
            >
              <BarChart
                height={260}
                xAxis={[{ data: leavesMonthlyStatus.map(x => x.m), scaleType: "band" }]}
                series={[
                  { label: "Approuvés", data: leavesMonthlyStatus.map(x => x.ap), stack: "lv" },
                  { label: "En attente", data: leavesMonthlyStatus.map(x => x.pd), stack: "lv" },
                  { label: "Rejetés",   data: leavesMonthlyStatus.map(x => x.rj), stack: "lv" },
                ]}
                grid={{ vertical: true }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={5}>
            <SubBlock
              title="Top des types de congés"
              description="Types de congés les plus demandés. Permet d’anticiper les périodes de forte demande."
            >
              <BarChart
                height={260}
                xAxis={[{ data: leaveTypesTop3.map(l => l.type), scaleType: 'band' }]}
                series={[{ label: 'Demandes', data: leaveTypesTop3.map(l => l.v) }]}
                grid={{ vertical: true }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12}>
            <SubBlock
              title="Tendance globale des congés"
              description="Évolution du volume total de demandes de congés par mois."
            >
              <LineChart
                xAxis={[{ data: months, scaleType: "point" }]}
                series={[{ data: monthsVals, label: "Congés", area: true }]}
                height={230}
              />
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>
      <Box sx={{ height: 24 }} />
      {/* RECRUTEMENT */}
      <GroupSection title="Recrutement" subtitle="Offres, catégories et candidatures">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7} lg={6}>
            <SubBlock
              title="Candidatures par offre"
              description="Comparaison du nombre de candidatures par offre pour identifier les postes les plus attractifs."
            >
              <BarChart
                height={260}
                yAxis={[{ data: applicationsPerOffer.map(o => o.offer), scaleType: "band" }]}
                series={[{ data: applicationsPerOffer.map(o => o.v), label: "Candidatures" }]}
                layout="horizontal"
                grid={{ horizontal: true }}
              />
            </SubBlock>
          </Grid>

         <Grid item xs={12} md={6} lg={5} >
            <SubBlock
              title="Offres par catégorie"
              description="Répartition des offres ouvertes par famille de métiers."
            >
              <PieChart
                series={[{ data: jobByCategory.map((c, i) => ({ id: i, value: c.value, label: c.id })), innerRadius: 35 }]}
                height={230}
              />
            </SubBlock>
          </Grid>

      
        </Grid>
      </GroupSection>
      <Box sx={{ height: 24 }} />
      {/* DOCUMENTS */}
      <GroupSection title="Documents" subtitle="Volumes, statuts et répartition par type">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <SubBlock
              title="Documents par mois (empilé)"
              description="Production de documents par mois : générés, validés, en attente."
            >
              <BarChart
                height={260}
                xAxis={[{ data: documentsMonthly.map(x => x.m), scaleType: "band" }]}
                series={[
                  { label: "Générés",  data: documentsMonthly.map(x => x.gen), stack: "doc" },
                  { label: "Validés",  data: documentsMonthly.map(x => x.val), stack: "doc" },
                  { label: "En attente", data: documentsMonthly.map(x => x.aw),  stack: "doc" },
                ]}
                grid={{ vertical: true }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={5}>
            <SubBlock
              title="Documents par type"
              description="Répartition des documents RH (contrats, attestations, politiques…)."
            >
              <PieChart
                series={[{ data: docByType.map((d, i) => ({ id: i, value: d.value, label: d.id })), innerRadius: 45 }]}
                height={230}
              />
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>
      <Box sx={{ height: 24 }} />
      {/* ÉVÉNEMENTS */}
      <GroupSection title="Événements" subtitle="Planification et activité des événements">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <SubBlock
              title="Événements par type"
              description="Types d’événements planifiés (réunions, formations, ateliers…)."
            >
              <PieChart
                series={[{ data: typeEvents.map((e, i) => ({ id: i, value: e.value, label: e.id })), innerRadius: 40 }]}
                height={230}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={6}>
            <SubBlock
              title="Événements par statut"
              description="Répartition des événements selon leur statut (Planifié, Réalisé, Annulé)."
            >
              <BarChart
                height={230}
                xAxis={[{ data: eventsStatus.map(s => s.id), scaleType: "band" }]}
                series={[{ data: eventsStatus.map(s => s.value) }]}
                grid={{ vertical: true }}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12}>
            <SubBlock
              title="Prochains événements"
              description="Les prochains événements à venir avec date, lieu et type."
            >
              <Stack spacing={1.2}>
                {upcomingEvents.map((ev, idx) => (
                  <Stack key={idx} direction="row" spacing={1.2} alignItems="center"
                    sx={{ p: 1.2, borderRadius: 2, border: "1px solid #e3f2fd", background: "#fff" }}>
                    <Avatar sx={{ bgcolor: "primary.main", color: "#fff", width: 36, height: 36 }}>
                      {ev.type[0]}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{ev.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ev.type} • {ev.location} • {ev.date}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>
      <Box sx={{ height: 24 }} />
      {/* NOTIFICATIONS */}
      <GroupSection title="Notifications" subtitle="Alertes et distribution des messages">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <SubBlock
              title="Statut des notifications"
              description="Part des notifications lues vs non lues par les utilisateurs."
            >
              <PieChart
                series={[{ data: notifStats.map((n, i) => ({ id: i, value: n.value, label: n.id })), innerRadius: 50 }]}
                height={200}
              />
            </SubBlock>
          </Grid>

          <Grid item xs={12} md={6}>
            <SubBlock
              title="Notifications récentes"
              description="Derniers messages envoyés aux utilisateurs."
            >
              <Stack spacing={1}>
                {recentNotifications.map((n, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between"
                    sx={{ p: 1, borderRadius: 1.5, background: n.unread ? "rgba(251,192,45,.12)" : "rgba(25,118,210,.06)" }}>
                    <Typography variant="body2" sx={{ fontWeight: n.unread ? 700 : 500 }}>{n.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{n.ago}</Typography>
                  </Stack>
                ))}
              </Stack>
            </SubBlock>
          </Grid>
        </Grid>
      </GroupSection>
      <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 500, opacity: .7, background: "rgba(255,255,255,.8)",
            backdropFilter: "blur(10px)", p: "8px 16px", borderRadius: 3,
            border: "1px solid rgba(0,0,0,.05)"
          }}
        >
          Démo statique • Contenu groupé par thèmes • Graphiques diversifiés (MUI X Charts)
        </Typography>
      </Box>
    </Box>
  );
}
