import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  Box,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { ButtonComponent } from "../../components/Global/ButtonComponent";
import { StyledCard, Title } from "../../style/style";
import KanbanBoard from "../../components/Tache/kanbanBoard";

const initialState = {
  backlog: [
    {
      id: "1",
      title: "Design API Architecture",
      assignee: "John Doe",
      priority: "high",
      timeEstimate: "8h",
      tags: ["Backend", "API"],
    },
    {
      id: "2",
      title: "Setup Database Schema",
      assignee: "Sarah Lee",
      priority: "medium",
      timeEstimate: "4h",
      tags: ["Database"],
    },
  ],
  inProgress: [
    {
      id: "3",
      title: "Create User Interface Components",
      assignee: "Jane Smith",
      priority: "high",
      timeEstimate: "12h",
      tags: ["Frontend", "UI"],
    },
  ],
  review: [
    {
      id: "4",
      title: "Test API Endpoints",
      assignee: "Ali Ben",
      priority: "medium",
      timeEstimate: "6h",
      tags: ["Testing", "QA"],
    },
  ],
  done: [
    {
      id: "5",
      title: "Initial Project Specifications",
      assignee: "Yassine",
      priority: "low",
      timeEstimate: "2h",
      tags: ["Documentation"],
    },
  ],
};

const columns = [
  { id: "backlog", title: "Backlog", color: "#f44336" },
  { id: "inProgress", title: "In Progress", color: "#ff9800" },
  { id: "review", title: "Review", color: "#4caf50" },
  { id: "done", title: "Done", color: "#9e9e9e" },
];

const Tache = () => {
  const [tasksByColumn, setTasksByColumn] = useState(initialState);
  const totalTasks = Object.values(tasksByColumn).flat().length;
  const completedTasks = tasksByColumn.done.length;
  const progress = (completedTasks / totalTasks) * 100;
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (result) => {
    setIsDragging(false);
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const sourceTasks = Array.from(tasksByColumn[source.droppableId]);
    const destTasks = Array.from(tasksByColumn[destination.droppableId]);
    const [removed] = sourceTasks.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, removed);
      setTasksByColumn({
        ...tasksByColumn,
        [source.droppableId]: sourceTasks,
      });
    } else {
      destTasks.splice(destination.index, 0, removed);
      setTasksByColumn({
        ...tasksByColumn,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks,
      });
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        bgcolor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <StyledCard
        sx={{
          borderRadius: "1.5",
          boxShadow: "0 16px 56px rgba(50,100,255,0.10)",
          border: "1.5px solid #d5e7ff",
          background: "#fff",
          p: { xs: 1, md: 4 },
          width: "100%",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              mb: 2,
            }}
          >
            <Title variant="h4" sx={{ textAlign: "center", width: "100%" }}>
              Sprint Planning & Task Management
            </Title>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <AvatarGroup max={4}>
              <Avatar sx={{ bgcolor: "#1976d2" }}>J</Avatar>
              <Avatar sx={{ bgcolor: "#ff9800" }}>S</Avatar>
              <Avatar sx={{ bgcolor: "#43a047" }}>A</Avatar>
              <Avatar sx={{ bgcolor: "#f44336" }}>Y</Avatar>
            </AvatarGroup>
            <ButtonComponent text="Add Task" icon={<AddIcon />} />
          </Box>
        </Box>
        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="body1" fontWeight={700} sx={{ color: "#1976d2" }}>
              Sprint Progress
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ color: "#1976d2" }}>
              {completedTasks}/{totalTasks} tasks completed
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#ede9fe",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              },
            }}
          />
        </Box>
        {/* KANBAN */}
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragStart={() => setIsDragging(true)}
        >
          <KanbanBoard
            columns={columns}
            tasksByColumn={tasksByColumn}
            isDragging={isDragging}
          />
        </DragDropContext>
      </StyledCard>
    </Box>
  );
};

export default Tache;
