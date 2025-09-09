import React, { useEffect, useMemo } from "react";
import {
  Box, TextField, Button, Stack, Autocomplete
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { SaveOutlined, AddCircleOutline, EditOutlined } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import ModelComponent from "../Global/ModelComponent";
import { createSprint, updateSprint } from "../../redux/actions/sprintActions";

// Vérifie si une date doit être désactivée pour l'équipe sélectionnée (true = désactivée)
function shouldDisableDateForTeam(date, sprints, selectedTeamId, currentSprintId = null) {
  if (!selectedTeamId) return false;
  for (let sprint of sprints) {
  if (currentSprintId && String(sprint._id) === String(currentSprintId)) continue;
    const sStart = new Date(sprint.startDate);
    const sEnd = new Date(sprint.endDate);
    const sprintTeamId = (sprint.team?._id || sprint.team || "").toString();
    if (sprintTeamId === selectedTeamId.toString() && date >= sStart && date <= sEnd) {
      return true;
    }
  }
  return false;
}

// Calcule le statut du sprint
function computeSprintStatus(startDate, endDate) {
  const now = new Date();
  if (!startDate || !endDate) return "";
  if (now < new Date(startDate)) return "Planned";
  if (now > new Date(endDate)) return "Completed";
  return "Ongoing";
}

// Schéma de validation Yup (chevauchement = interdit que pour la même équipe)
function makeSchema({ projectStartDate, projectEndDate, sprints, isEdit, sprintData }) {
  const currentSprintId = sprintData?._id || null;
  return Yup.object({
    title: Yup.string().required("Le titre est requis").min(3).max(100),
    team: Yup.object().nullable().required("L'équipe est requise"),
    startDate: Yup.date()
      .typeError("Date de début invalide")
      .required("Date de début requise")
      .test(
        "start-in-project-range",
        "Date de début hors projet",
        val => !projectStartDate || !val || new Date(val) >= new Date(projectStartDate)
      )
      .test(
        "no-overlap-same-team",
        "Le sprint se chevauche avec un autre sprint de la même équipe",
        function (val) {
          if (!val || !sprints) return true;
          const endDate = this.parent.endDate;
          const selectedTeam = this.parent.team?._id || this.parent.team;
          if (!selectedTeam) return true;
          for (let sprint of sprints) {
            // :white_check_mark: On ignore le sprint en cours lors de la modification
            if (currentSprintId && sprint._id === currentSprintId) continue;
            const sStart = new Date(sprint.startDate);
            const sEnd = new Date(sprint.endDate);
            const sprintTeam = (sprint.team?._id || sprint.team || "").toString();
            if (
              endDate &&
              new Date(val) <= sEnd &&
              new Date(endDate) >= sStart &&
              sprintTeam === selectedTeam.toString()
            ) {
              return false;
            }
          }
          return true;
        }
      ),
    endDate: Yup.date()
      .typeError("Date de fin invalide")
      .required("Date de fin est requise")
      .min(Yup.ref("startDate"), "Date de fin doit être après la date de début")
      .test(
        "end-in-project-range",
        "Date de fin hors projet",
        val => !projectEndDate || !val || new Date(val) <= new Date(projectEndDate)
      )
      .test(
        "no-overlap-same-team",
        "Le sprint se chevauche avec un autre sprint de la même équipe",
        function (val) {
          if (!val || !sprints) return true;
          const startDate = this.parent.startDate;
          const selectedTeam = this.parent.team?._id || this.parent.team;
          if (!selectedTeam) return true;
          for (let sprint of sprints) {
            // :white_check_mark: On ignore le sprint en cours lors de la modification
            if (currentSprintId && sprint._id === currentSprintId) continue;
            const sStart = new Date(sprint.startDate);
            const sEnd = new Date(sprint.endDate);
            const sprintTeam = (sprint.team?._id || sprint.team || "").toString();
            if (
              startDate &&
              new Date(startDate) <= sEnd &&
              new Date(val) >= sStart &&
              sprintTeam === selectedTeam.toString()
            ) {
              return false;
            }
          }
          return true;
        }
      ),
  });
}

export default function CreateSprintModal({
  open,
  handleClose,
  blockCreateSprint,
  projectId,
  projectStartDate,
  projectEndDate,
  nextSprintStartDate,
  sprints = [],
  sprintData = null,
  isEdit = false
}) {
  if (!open || (blockCreateSprint && !isEdit)) return null;
  const dispatch = useDispatch();
  const teams = useSelector(state => state.team.teams || []);
  const loadingTeams = useSelector(state => state.team.loading);

  // On filtre les équipes du projet courant
  const projectTeams = useMemo(() => {
    return teams.filter(
      t => {
        let teamProject = typeof t.project === "object" ? t.project?._id || t.project : t.project;
        return String(teamProject) === String(projectId);
      }
    );
  }, [teams, projectId]);

  // Schéma de validation
  const schema = makeSchema({ projectStartDate, projectEndDate, sprints, isEdit, sprintData });

const {
  register,
  control,
  handleSubmit,
  reset,
  watch,
  formState: {errors}
} = useForm({
  resolver: yupResolver(schema),
  defaultValues: {
    title: "",
    team: null,
    startDate: nextSprintStartDate || new Date(),
    endDate: null,
  }
});

  const selectedTeamId = watch("team")?._id || watch("team");
  const currentSprintId = sprintData?._id;

  useEffect(() => {
    if (open && isEdit && sprintData) {
      reset({
        title: sprintData.title || "",
        team: projectTeams.find(t => t._id === (sprintData.team?._id || sprintData.team)) || null,
        startDate: sprintData.startDate ? new Date(sprintData.startDate) : nextSprintStartDate || new Date(),
        endDate: sprintData.endDate ? new Date(sprintData.endDate) : null,
      });
    }
    if (open && !isEdit) {
      reset({
        title: "",
        team: null,
        startDate: nextSprintStartDate || new Date(),
        endDate: null,
      });
    }
  }, [open, isEdit, sprintData, reset, projectTeams, nextSprintStartDate]);

  const closeAndReset = () => {
    reset({
      title: "",
      team: null,
      startDate: nextSprintStartDate || new Date(),
      endDate: null,
    });
    handleClose();
  };

  const onSubmit = async (data) => {
    if (blockCreateSprint && !isEdit) {
      toast.error("Impossible de créer plus de sprints, période du projet atteinte !");
      return;
    }
    try {
      let duration = "";
      if (data.startDate && data.endDate) {
        const diff = differenceInCalendarDays(new Date(data.endDate), new Date(data.startDate)) + 1;
        duration = diff > 1 ? `${diff} jours` : "1 jour";
      }
      const status = computeSprintStatus(data.startDate, data.endDate);
      const body = {
        title: data.title,
        status,
        duration,
        startDate: data.startDate,
        endDate: data.endDate,
        project: projectId,
        team: data.team?._id,
      };
      if (isEdit && sprintData) {
        const actionResult = dispatch(updateSprint({ id: sprintData._id, updateData: body }));
        if (actionResult?.error) {
          toast.error(actionResult?.payload || "Erreur lors de la modification du sprint.");
          return;
        }
        toast.success("Sprint modifié avec succès");
      } else {
        const actionResult = await dispatch(createSprint(body));
        if (actionResult?.error) {
          toast.error(actionResult?.payload || "Erreur lors de la création du sprint.");
          return;
        }
        toast.success("Sprint créé avec succès");
      }
      closeAndReset();
    } catch (e) {
      console.error("[CreateSprintModal] Erreur interne submit :", e);
      toast.error("Erreur interne !");
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3500} />
      <ModelComponent
        open={open}
        handleClose={closeAndReset}
        title={isEdit ? "Modifier un sprint" : "Créer un nouveau sprint"}
        icon={isEdit ? <EditOutlined /> : <AddCircleOutline />}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ my: 2 }}>
            <TextField
              label="Titre *"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 2 }}
            />
            <div style={{ marginBottom: 10, color: "#aaa", fontSize: 13 }}>
              {loadingTeams
                ? "Chargement des équipes..."
                : (projectTeams.length === 0 ? "Aucune équipe trouvée pour ce projet." : "")}
            </div>
            <Controller
              name="team"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={projectTeams}
                  getOptionLabel={option => {
                    if (!option) return "";
                    if (typeof option === "string") return option;
                    if (option.title) return option.title;
                    return "";
                  }}
                  value={field.value}
                  loading={loadingTeams}
                  onChange={(_, value) => field.onChange(value)}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Équipe assignée *"
                      error={!!errors.team}
                      helperText={errors.team?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              )}
            />
            <Stack direction="row" spacing={2}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date de début *"
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                          sx: { mb: 2 }
                        }
                      }}
                      format="dd/MM/yyyy"
                      minDate={projectStartDate}
                      maxDate={projectEndDate}
                      shouldDisableDate={date =>
                        shouldDisableDateForTeam(
                          date,
                          sprints,
                          selectedTeamId,
                          currentSprintId
                        )
                      }
                      onChange={val => field.onChange(val)}
                    />
                  </LocalizationProvider>
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date de fin *"
                      {...field}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                          sx: { mb: 2 }
                        }
                      }}
                      format="dd/MM/yyyy"
                      minDate={watch("startDate")}
                      maxDate={projectEndDate}
                      shouldDisableDate={date =>
                        shouldDisableDateForTeam(
                          date,
                          sprints,
                          selectedTeamId,
                          currentSprintId
                        )
                      }
                      onChange={val => field.onChange(val)}
                    />
                  </LocalizationProvider>
                )}
              />
            </Stack>
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={isEdit ? <EditOutlined /> : <SaveOutlined />}
              >
                {isEdit ? "Modifier" : "Créer"}
              </Button>
            </Box>
          </Box>
        </form>
      </ModelComponent>
    </>
  );
}
