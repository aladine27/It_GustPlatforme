import React, { useState } from "react";
import { Box, Paper, Typography, Divider, Stack } from "@mui/material";
import TableComponent from "../../components/Global/TableComponent";
import PaginationComponent from "../../components/Global/PaginationComponent";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EmailIcon from "@mui/icons-material/Email";

// Mock datas (à remplacer par API/back plus tard)
const mockCVFiles = [
  { id: 1, filename: "CV_Alice_Durand.pdf" },
  { id: 2, filename: "CV_Yassine_BenAli.pdf" },
  { id: 3, filename: "CV_Lina_Maarek.pdf" },
  { id: 4, filename: "CV_Raw_OldFormat.pdf" },
];

const mockApplicationsIA = [
  {
    id: 1,
    filename: "CV_Alice_Durand.pdf",
    email: "alice.durand@email.com",
    poste: "Développeur Full Stack",
    score: 92.1,
    skills_matched: ["React", "Node.js", "TypeScript"],
    appliedAt: "2024-07-18",
  },
  {
    id: 2,
    filename: "CV_Yassine_BenAli.pdf",
    email: "y.benali@gmail.com",
    poste: "Data Scientist",
    score: 76.8,
    skills_matched: ["Python", "Machine Learning", "SQL"],
    appliedAt: "2024-07-21",
  },
  {
    id: 3,
    filename: "CV_Lina_Maarek.pdf",
    email: "l.maarek@protonmail.com",
    poste: "UI/UX Designer",
    score: 59.2,
    skills_matched: ["Figma", "UI", "Design Thinking"],
    appliedAt: "2024-07-19",
  },
];

export default function ApplicationListRHIA() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [filtered, setFiltered] = useState(false);

  // Table colonnes
  const cvColumns = [
    { id: "filename", label: "Nom du fichier" },
  ];

  // Classement en 1ère colonne IA
  const iaColumns = [
    { id: "ranking", label: "Rang", render: (row) => <b>{row.ranking}</b> },
    { id: "filename", label: "CV" },
    { id: "email", label: "Email" },
    { id: "poste", label: "Poste" },
    { id: "score", label: "Score IA" },
    { id: "skills_matched", label: "Compétences trouvées", render: (row) =>
      <Stack direction="Column" spacing={0.5} flexWrap="wrap">
        {row.skills_matched.map(s =>
          <Typography key={s} sx={{ bgcolor: "#e0f2f1", color: "#1976d2", borderRadius: 1, px: 1, mr: 0.5, fontSize: 13 }}>{s}</Typography>
        )}
      </Stack>
    },
  ];

  // Actions (utilise UNIQUEMENT les icons existantes)
  const cvActions = [
    {
      tooltip: "Télécharger",
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: row => window.open("#", "_blank"), // TODO: implement download
    },
  ];

  const iaActions = [
    {
      tooltip: "Télécharger CV",
      icon: <DownloadIcon color="primary" fontSize="small" />,
      onClick: row => window.open("#", "_blank"),
    },
    {
      tooltip: "Envoyer Email",
      icon: <EmailIcon color="primary" fontSize="small" />,
      onClick: row => {
        window.open(`mailto:${row.email}?subject=Candidature ${row.filename}&body=Bonjour,`, '_blank');
      },
    },
  ];

  // Ajoute classement dynamique à mockApplicationsIA
  const mockApplicationsWithRanking = mockApplicationsIA.map((row, idx) => ({
    ...row,
    ranking: idx + 1,
  }));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", py: 3 }}>
      <Box sx={{ maxWidth: 1250, mx: "auto", px: { xs: 1, md: 2 } }}>
        <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
          Candidatures – Filtrage IA
        </Typography>

        {/* Bloc 1 : Table des CV */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="h6" fontWeight={700} color="primary">
              CV Reçus ({mockCVFiles.length})
            </Typography>
            <ButtonComponent
              text="Filtrer via IA"
              icon={<FilterAltIcon />}
              onClick={() => setFiltered(true)}
              color="#1976d2"
              disabled={filtered}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <TableComponent
            columns={cvColumns}
            rows={mockCVFiles}
            actions={cvActions}
          />
          <Box sx={{ mt: 2 }}>
            <PaginationComponent count={1} page={page1} onChange={(e, p) => setPage1(p)} />
          </Box>
        </Paper>

        {/* Bloc 2 : Résultat IA */}
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
          <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
            Résultats du filtrage IA
          </Typography>
          {!filtered ? (
            <Typography color="#64748b" fontStyle="italic" mb={2}>
              Cliquez sur <b>Filtrer via IA</b> pour lancer l’analyse automatique.
            </Typography>
          ) : (
            <>
              <TableComponent
                columns={iaColumns}
                rows={mockApplicationsWithRanking}
                actions={iaActions}
              />
              <Box sx={{ mt: 2 }}>
                <PaginationComponent count={1} page={page2} onChange={(e, p) => setPage2(p)} />
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
