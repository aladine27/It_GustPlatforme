import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Paper, Box, Chip, Typography, Stack, IconButton, Tooltip, Link, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import SprintIcon from "@mui/icons-material/DirectionsRun";
import ProjectDetailModal from "./ProjectDetailModal";

const statusMap = {
  completed: {
    color: "success",
    bgColor: "#e8f5e8",
    textColor: "#2e7d32",
    gradient: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
  },
  terminé: {
    color: "success",
    bgColor: "#e8f5e8",
    textColor: "#2e7d32",
    gradient: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
  },
  ongoing: {
    color: "warning",
    bgColor: "#fff3e0",
    textColor: "#f57c00",
    gradient: "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
  },
  "en cours": {
    color: "warning",
    bgColor: "#fff3e0",
    textColor: "#f57c00",
    gradient: "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
  },
  planned: {
    color: "primary",
    bgColor: "#e3f2fd",
    textColor: "#1976d2",
    gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  },
  planifié: {
    color: "primary",
    bgColor: "#e3f2fd",
    textColor: "#1976d2",
    gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  },
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
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const statusInfo = statusMap[project.status?.toLowerCase()] || {
    color: "default",
    bgColor: "#f5f5f5",
    textColor: "#666",
    gradient: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
  };

  return (
    <>
      <Paper
        elevation={isHovered ? 8 : 3}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: 0,
          mb: 2,
          borderRadius: 3,
          border: "1px solid #e1e8f0",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          minHeight: 420,
          minWidth: 350,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          cursor: "pointer",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: statusInfo.gradient,
            zIndex: 1,
          },
        }}
      >
        {/* Image section */}
        <Box
          sx={{
            width: "100%",
            height: 140,
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30px",
              background: "linear-gradient(transparent, rgba(0,0,0,0.1))",
              pointerEvents: "none",
            },
          }}
        >
          <img
            src={staticProjectImage || "/placeholder.svg?height=140&width=350&query=project"}
            alt="project"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* Status Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 2,
            }}
          >
            <Chip
              label={t(project.status)}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                textTransform: "capitalize",
                background: statusInfo.bgColor,
                color: statusInfo.textColor,
                border: `1px solid ${statusInfo.textColor}20`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          </Box>

          {/* Admin Actions */}
          {isAdminOrManager && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 0.5,
                opacity: isHovered ? 1 : 0.7,
                transition: "opacity 0.3s ease",
              }}
            >
              <Tooltip title={t("Modifier")} arrow>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "#1976d2",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                    setOpenEdit(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("Supprimer")} arrow>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "#d32f2f",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": {
                      backgroundColor: "#ffebee",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                    setOpenDelete(true);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Project Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 1.5,
              fontSize: "1.1rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={project.title}
          >
            {project.title}
          </Typography>

          {/* Details Grid */}
          <Box sx={{ mb: 2 }}>
            <Stack spacing={1.5}>
              {/* Duration */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: "#f1f5f9",
                    color: "#64748b",
                  }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    D
                  </Typography>
                </Avatar>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  {t("Durée")}:
                </Typography>
                <Typography variant="body2" color="#1e293b" fontWeight={600}>
                  {project.duration || t("Non définie")}
                </Typography>
              </Box>

              {/* File */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: "#fef3c7",
                    color: "#d97706",
                  }}
                >
                  <FolderIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Typography variant="body2" color="#64748b" fontWeight={500}>
                  {t("Fichier")}:
                </Typography>
                {project.file ? (
                 <Link
                  href={project.file ? `http://localhost:3000/uploads/projects/${project.file}` : "#"}
                  target="_blank"
                  underline="hover"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#2563eb",
                    "&:hover": { color: "#1d4ed8" },
                  }}
                >
                  {project.file.length > 18 ? project.file.slice(0, 16) + "..." : project.file}
                </Link>
                ) : (
                  <Typography variant="body2" color="#9ca3af" fontWeight={500}>
                    {t("Aucun fichier")}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Stats Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mb: 2,
              p: 1.5,
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                <SprintIcon sx={{ fontSize: 16, color: "#6366f1", mr: 0.5 }} />
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  {project.sprints?.length || 0}
                </Typography>
              </Box>
              <Typography variant="caption" color="#64748b" fontWeight={500}>
                {t("Sprints")}
              </Typography>
            </Box>

            <Box sx={{ width: "1px", backgroundColor: "#e2e8f0", mx: 1 }} />

            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                <GroupIcon sx={{ fontSize: 16, color: "#10b981", mr: 0.5 }} />
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  {project.teams?.length || 0}
                </Typography>
              </Box>
              <Typography variant="caption" color="#64748b" fontWeight={500}>
                {t("Équipes")}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1.5,
              mt: "auto",
              pt: 1,
            }}
          >
            <Tooltip title={t("Voir les tâches")} arrow>
              <IconButton
                size="medium"
                sx={{
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                  width: 44,
                  height: 44,
                  "&:hover": {
                    backgroundColor: "#bbf7d0",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                  },
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/tache/${project._id}`);
                }}
              >
                <TimelineIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("Voir les détails")} arrow>
              <IconButton
                size="medium"
                sx={{
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                  width: 44,
                  height: 44,
                  "&:hover": {
                    backgroundColor: "#bfdbfe",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  },
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDetail(true);
                }}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Modal détails */}
      <ProjectDetailModal
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        project={project}
        onEdit={() => {
          setSelectedProject(project);
          setOpenEdit(true);
          setOpenDetail(false);
        }}
        onDelete={() => {
          setSelectedProject(project);
          setOpenDelete(true);
          setOpenDetail(false);
        }}
        userRole={isAdminOrManager ? "Admin" : "User"}
      />
    </>
  );
};

export default ProjectCard;
