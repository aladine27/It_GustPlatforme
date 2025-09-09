import React, { useEffect } from "react";
import {
  Box, TextField, Button, Grid, Stack, MenuItem
} from "@mui/material";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { SaveOutlined, AddCircleOutline, EditOutlined } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { createTask, updateTask } from "../../redux/actions/taskAction";

export default function CreateTaskModal({
  open,
  handleClose,
  projectId,
  sprintId,
  users = [],
  isEdit = false,
  task = null,
  onSuccess,
}) {
  const dispatch = useDispatch();

  // LOG ouverture modal et data
  useEffect(() => {
    console.log("[MODAL] open=", open, "isEdit=", isEdit, "task=", task, "users=", users);
  }, [open, isEdit, task, users]);

  // Validation schema
  const schema = Yup.object({
    title: Yup.string().required("Titre requis"),
    description: Yup.string().required("Description requise"),
    user: Yup.string().required("Utilisateur requis"),
    priority: Yup.string().required("Priorité requise"),
  });

  // Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      user: "",
      priority: "",
    }
  });

  // Fixe la valeur de user et priority même si users changent APRES ouverture
  useEffect(() => {
    if (open) {
      if (isEdit && task) {
        // Force les valeurs à celles de la tâche (cas edit)
        // task.user peut être soit ID soit object
        let userId = "";
        if (task.user && typeof task.user === "object" && task.user._id) userId = task.user._id;
        else if (typeof task.user === "string") userId = task.user;
        // Check si ce userId existe dans la liste users reçue (sinon met "")
        const exists = users.find((u) => u._id === userId);
        setValue("user", exists ? userId : "");
        setValue("title", task.title || "");
        setValue("description", task.description || "");
        setValue("priority", ["low", "medium", "high"].includes(task.priority) ? task.priority : "");
        console.log("[MODAL] RESET EDIT:", {
          title: task.title,
          description: task.description,
          user: exists ? userId : "",
          priority: task.priority,
        });
      } else {
        reset({
          title: "",
          description: "",
          user: "",
          priority: "",
        });
      }
    }

  }, [isEdit, task, open, reset, users, setValue]);

  const closeAndReset = () => {
    reset({
      title: "",
      description: "",
      user: "",
      priority: "",
    });
    handleClose();
  };
const onSubmit = async (data) => {
  try {
    if (isEdit && task) {
      if (!task._id) {
        toast.error("ID de la tâche manquant !");
        return;
      }
      await dispatch(updateTask({ id: task._id, updateData: data })).unwrap();
      toast.success("Tâche modifiée avec succès");
      closeAndReset();
      onSuccess?.(); 
    } else {
      const body = {
        ...data,
        project: projectId,
        sprint: sprintId,
        status: "backlog",
      };

      await dispatch(createTask(body)).unwrap();

      toast.success("Tâche créée avec succès");
      closeAndReset();
      onSuccess?.(); // re-fetch du board
    }
  } catch (e) {
    // e vient de .unwrap() => message d’erreur côté thunk si fourni
    toast.error(
      typeof e === "string" ? e : "Erreur lors de l’enregistrement de la tâche."
    );
  }
};


  // Toujours afficher les users valides dans la liste déroulante
  const userOptions = Array.isArray(users) ? users.filter(u => u && u._id) : [];

  return (
    <>
      <ModelComponent
        open={open}
        handleClose={closeAndReset}
        title={isEdit ? "Modifier la tâche" : "Créer une tâche"}
        icon={isEdit ? <EditOutlined /> : <AddCircleOutline />}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                label="Titre *"
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description *"
                fullWidth
                multiline
                minRows={2}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Priorité *"
                fullWidth
                {...register("priority")}
                error={!!errors.priority}
                helperText={errors.priority?.message}
                sx={{ mb: 2 }}
              >
                <MenuItem value="low">Basse</MenuItem>
                <MenuItem value="medium">Moyenne</MenuItem>
                <MenuItem value="high">Haute</MenuItem>
              </TextField>
              <TextField
                select
                label="Membre assigné *"
                fullWidth
                {...register("user")}
                error={!!errors.user}
                helperText={errors.user?.message}
                sx={{ mb: 2 }}
              >
                {userOptions.length > 0 ? (
                  userOptions.map((u, idx) => (
                    <MenuItem value={u._id} key={u._id}>
                      {u.fullName || u.name || "Utilisateur"}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    Aucun membre d'équipe disponible
                  </MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              <SaveOutlined sx={{ mr: 1 }} />
              {isEdit ? "Modifier" : "Créer"}
            </Button>
          </Stack>
        </form>
      </ModelComponent>
    </>
  );
}
