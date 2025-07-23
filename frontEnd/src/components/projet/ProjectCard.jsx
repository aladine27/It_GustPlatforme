import React, { useState } from "react";
import {
  Paper, Box, Chip, Typography, Stack, IconButton, Tooltip, Link
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ProjectDetailModal from "./ProjectDetailModal";

const statusMap = {
  "completed": { color: "success" },
  "terminé": { color: "success" },
  "ongoing": { color: "warning" },
  "en cours": { color: "warning" },
  "planned": { color: "primary" },
  "planifié": { color: "primary" },
};

const ProjectCard = ({
  project,
  staticProjectImage,
  navigate,
  isAdminOrManager,
  setSelectedProject,
  setOpenEdit,
  setOpenDelete,
}) => {
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: "1.5px solid #e6eafd",
          background: "#fafdff",
          minHeight: 360,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Image */}
        <Box sx={{
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
        }}>
          <img
            src={staticProjectImage || "/placeholder.svg"}
            alt="project"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        {/* Statut et dates */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
          <Chip
            label={project.status}
            size="small"
            color={statusMap[project.status?.toLowerCase()]?.color || "default"}
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
              px: 1.5, py: 0.15, borderRadius: 2,
              textTransform: "capitalize"
            }}
          />
     
        </Box>

        {/* Détails colonne */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Typography variant="subtitle2" fontWeight={700} color="#2563eb">
            Titre : <span style={{ fontWeight: 400, color: "#1e293b" }}>{project.title}</span>
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} color="#2563eb">
            Durée : <span style={{ fontWeight: 400, color: "#1e293b" }}>{project.duration || "-"}</span>
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} color="#2563eb" sx={{ mb: 1 }}>
            Fichier : {
              project.file ? (
                <Link href={`/uploads/${project.file}`} target="_blank" underline="hover" fontWeight={500}>
                  {project.file.length > 22 ? project.file.slice(0, 20) + "..." : project.file}
                </Link>
              ) : (
                <span style={{ color: "#a6b0c3", fontWeight: 400 }}>Aucun</span>
              )
            }
          </Typography>
        </Box>

        {/* Sprints / Equipes centrés */}
        <Stack direction="row" spacing={2} mb={1} display="flex" alignItems="center" justifyContent="center" sx={{gap:1}}>
          <Typography variant="body2" color="text.secondary">
            Sprints: <strong>{project.sprints?.length || 0}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Equipes: <strong>{project.teams?.length || 0}</strong>
          </Typography>
        </Stack>

        {/* Action buttons */}
       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
  {isAdminOrManager && (
    <>
      {/* Modifier */}
      <Tooltip title="Modifier">
        <IconButton
          size="small"
          sx={{
            backgroundColor: "#e3f2fd",      // BLEU CLAIR
            color: "#1976d2",                // BLEU
            "&:hover": { backgroundColor: "#bbdefb" }
          }}
          onClick={e => { e.stopPropagation(); setSelectedProject(project); setOpenEdit(true); }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Supprimer */}
      <Tooltip title="Supprimer">
        <IconButton
          size="small"
          sx={{
            backgroundColor: "#ffebee",      // ROUGE CLAIR
            color: "#d32f2f",                // ROUGE
            "&:hover": { backgroundColor: "#ffcdd2" }
          }}
          onClick={e => { e.stopPropagation(); setSelectedProject(project); setOpenDelete(true); }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  )}

  {/* Voir tâches */}
  <Tooltip title="Voir tâches">
    <IconButton
      size="small"
      sx={{
        backgroundColor: "#e8f5e9",          // VERT CLAIR
        color: "#388e3c",                    // VERT
        "&:hover": { backgroundColor: "#c8e6c9" }
      }}
      onClick={e => { e.stopPropagation(); navigate(`/dashboard/tache/${project._id}`); }}
    >
      <TimelineIcon fontSize="small" />
    </IconButton>
  </Tooltip>

  {/* Voir détails */}
  <Tooltip title="Voir détails">
    <IconButton
      size="small"
      sx={{
        backgroundColor: "#e3f2fd"
      }}
      onClick={e => { e.stopPropagation(); setOpenDetail(true); }}
    >
      <InfoOutlinedIcon fontSize="small" color="primary" />
    </IconButton>
  </Tooltip>
</Box>

      </Paper>

      {/* Modal détails */}
      <ProjectDetailModal
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        project={project}
        onEdit={() => { setSelectedProject(project); setOpenEdit(true); setOpenDetail(false); }}
        onDelete={() => { setSelectedProject(project); setOpenDelete(true); setOpenDetail(false); }}
        userRole={isAdminOrManager ? "Admin" : "User"}
      />
    </>
  );
};

export default ProjectCard;
