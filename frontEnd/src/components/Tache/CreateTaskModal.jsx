import React from "react";
import {
  Box, TextField, Button, Grid, Stack, MenuItem
} from "@mui/material";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { SaveOutlined, AddCircleOutline } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { createTask } from "../../redux/actions/taskAction";

export default function CreateTaskModal({
  open,
  handleClose,
  projectId,
  sprintId,
  users = [],
}) {
  const dispatch = useDispatch();
  // LOG utilisateurs reçus
  console.log("====== [CreateTaskModal] RENDER ======");
  console.log("[CreateTaskModal] users prop reçu :", users);

  if (Array.isArray(users)) {
    users.forEach((u, i) => {
      console.log(`[CreateTaskModal] user[${i}]`, u);
    });
  }

  const schema = Yup.object({
    title: Yup.string().required("Titre requis"),
    description: Yup.string().required("Description requise"),
    user: Yup.string().required("Utilisateur requis"),
    priority: Yup.string().required("Priorité requise"),
  });

  const {
    register,
    handleSubmit,
    reset,
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
      const body = {
        ...data,
        project: projectId,
        sprint: sprintId,
        status: "backlog", 
      };
      const actionResult = await dispatch(createTask(body));
      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de la création de la tâche.");
        return;
      }
      toast.success("Tâche créée avec succès");
      closeAndReset();
    } catch (e) {
      toast.error("Erreur interne !");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <ModelComponent
        open={open}
        handleClose={closeAndReset}
        title="Créer une tâche"
        icon={<AddCircleOutline />}
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
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((u, idx) => {
                    console.log("[CreateTaskModal] map user:", u);
                    return (
                      <MenuItem value={u._id} key={u._id}>
                        {u.fullName || u.name || "Utilisateur"}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem value="" disabled>
                    Aucun membre d'équipe disponible (voir la console !)
                  </MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              <SaveOutlined sx={{ mr: 1 }} />
              Créer
            </Button>
          </Stack>
        </form>
      </ModelComponent>
    </>
  );
}
