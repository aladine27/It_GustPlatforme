import React, { useEffect, useMemo, useState } from "react";
import {
  TextField, Button, Grid, Stack, Autocomplete
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { SaveOutlined, AddCircleOutline, EditOutlined } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { createTeam, updateTeam, fetchAllTeams } from "../../redux/actions/teamActions";
import { FetchEmployesAction } from "../../redux/actions/employeAction";

export default function CreateTeamModal({ open, handleClose, projectId, teamData, isEdit,allProjectTeams }) {
  const dispatch = useDispatch();
  const { list: allEmployes, loading } = useSelector(state => state.employe);

  // Debug : log tous les employés reçus
  useEffect(() => {
    console.log("ALL EMPLOYES from redux:", allEmployes);
  }, [allEmployes]);

  // On ne prend que les employés au sens "role"
  const employees = useMemo(() => {
    const filtered = (allEmployes || []).filter(emp => emp.role === "Employe");
    console.log("Employés filtrés (role='Employe') :", filtered);
    return filtered;
  }, [allEmployes]);

  // 1. State pour le domaine sélectionné
  const [selectedDomaine, setSelectedDomaine] = useState("");

  // 2. Liste des domaines uniques (pour le filtre)
  const domaines = useMemo(() => {
    const domainList = (employees || []).map(emp => emp.domain).filter(Boolean);
    const uniqueDomains = [...new Set(domainList)];
    console.log("Tous les domaines trouvés:", domainList);
    console.log("Domaines uniques:", uniqueDomains);
    return uniqueDomains;
  }, [employees]);

  useEffect(() => {
    if (open) {
      dispatch(FetchEmployesAction());
    }
  }, [open, dispatch]);

  // Validation schema
  const schema = Yup.object({
    title: Yup.string().required("Le nom d'équipe est requis"),
    employeeList: Yup.array().min(1, "Sélectionne au moins un membre"),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      employeeList: [],
    }
  });
  const alreadyAssignedIds = useMemo(() => {
  // On ignore l’équipe en cours d’édition si c’est un edit
  const exceptThisTeam = allProjectTeams.filter(
    t => !isEdit || t._id !== teamData?._id
  );
  return exceptThisTeam
    .flatMap(team => team.employeeList.map(e => typeof e === "string" ? e : e._id));
}, [allProjectTeams, isEdit, teamData]);

const employeesFiltered = useMemo(() => {
  return employees.filter(emp =>
    !alreadyAssignedIds.includes(emp._id)
    || (isEdit && (teamData?.employeeList || []).some(e => (typeof e === "string" ? e : e._id) === emp._id))
  );
}, [employees, alreadyAssignedIds, isEdit, teamData]);


  useEffect(() => {
    if (open && isEdit && teamData) {
      setValue("title", teamData.title || "");
      setValue(
        "employeeList",
        (teamData.employeeList || []).map(e =>
          typeof e === "string"
            ? employees.find(emp => emp._id === e) || { _id: e, fullName: "Ancien membre" }
            : e
        )
      );
    }
  }, [open, isEdit, teamData, employees, setValue]);

  useEffect(() => {
    if (!open) {
      reset({ title: "", employeeList: [] });
      setSelectedDomaine(""); // Reset filtre domaine à la fermeture
    }
  }, [open, reset]);

  // Close and reset handler
  const closeAndReset = () => {
    reset({ title: "", employeeList: [] });
    setSelectedDomaine("");
    handleClose();
  };

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const body = {
        title: data.title,
        employeeList: data.employeeList.map(e => e._id),
        project: projectId,
      };

      let actionResult;
      if (isEdit && teamData) {
        actionResult =  dispatch(updateTeam({ id: teamData._id, updateData: body }));
      } else {
        actionResult =  dispatch(createTeam(body));
      }

      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de la sauvegarde.");
        return;
      }

      toast.success(isEdit ? "Équipe modifiée avec succès" : "Équipe créée avec succès");
      closeAndReset();
      setTimeout(() => dispatch(fetchAllTeams()), 200);
    } catch (e) {
      toast.error("Erreur interne !");
    }
  };

  return (
    <ModelComponent
      open={open}
      handleClose={closeAndReset}
      title={isEdit ? "Modifier l'équipe" : "Créer une équipe"}
      icon={isEdit ? <EditOutlined /> : <AddCircleOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              label="Nom de l'équipe *"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 2 }}
            />

            {/* ---- Filtre par domaine ---- */}
            <TextField
              select
              label="Filtrer par domaine"
              value={selectedDomaine}
              onChange={e => setSelectedDomaine(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value=""/>
              {domaines.map(dom => (
                <option key={dom} value={dom}>{dom}</option>
              ))}
            </TextField>

            {/* ---- Champ multi-employé filtré ---- */}
            <Controller
              name="employeeList"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={
                    selectedDomaine
                      ? employeesFiltered.filter(emp => emp.domain === selectedDomaine)
                      : employeesFiltered
                  }
                  getOptionLabel={option => option.fullName || option.name}
                  value={field.value}
                  loading={loading}
                  onChange={(_, value) => field.onChange(value)}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Membres de l'équipe *"
                      error={!!errors.employeeList}
                      helperText={errors.employeeList?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            <SaveOutlined sx={{ mr: 1 }} />
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </Stack>
      </form>
    </ModelComponent>
  );
}
