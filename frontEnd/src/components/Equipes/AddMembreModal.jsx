import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, TextField, Autocomplete, Divider, Grid
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { updateTeam, fetchAllTeams } from "../../redux/actions/teamActions";
import { FetchEmployesAction } from "../../redux/actions/employeAction";
import ModelComponent from "../Global/ModelComponent";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

export default function AddMemberToTeamModal({ open, handleClose, team, allProjectTeams }) {
  const dispatch = useDispatch();
  const { list: allEmployes, loading } = useSelector(state => state.employe);
  const { teams: allTeamsFromRedux } = useSelector(state => state.team || {});

  useEffect(() => {
    if (open) dispatch(FetchEmployesAction());
  }, [open, dispatch]);

  const projectTeamsData = useMemo(() => {
    if (allProjectTeams?.length) return allProjectTeams;
    if (allTeamsFromRedux?.length) return allTeamsFromRedux;
    return [];
  }, [allProjectTeams, allTeamsFromRedux]);

  const employees = useMemo(
    () => (allEmployes || []).filter(emp => emp.role === "Employe"),
    [allEmployes]
  );
  const domaines = useMemo(
    () => [...new Set(employees.map(emp => emp.domain).filter(Boolean))],
    [employees]
  );
  const [selectedDomaine, setSelectedDomaine] = useState("");

  const normalizeId = (id) => typeof id === 'string'
    ? id
    : (id && id._id ? id._id.toString() : (id ? id.toString() : null));

  const sameProjectTeams = useMemo(() => {
    if (!team || !projectTeamsData) return [];
    const currentProjectId = normalizeId(team.project);
    if (!currentProjectId) return [];
    return projectTeamsData.filter(
      t => normalizeId(t.project) === currentProjectId
    );
  }, [team, projectTeamsData]);

  const assignedEmployeeIdsInProject = useMemo(() => {
    const assignedIds = new Set();
    sameProjectTeams.forEach(t =>
      (t.employeeList || []).forEach(emp =>
        assignedIds.add(normalizeId(emp))
      )
    );
    return Array.from(assignedIds);
  }, [sameProjectTeams]);
  const currentTeamMemberIds = useMemo(() => (
    team?.employeeList?.map(emp => normalizeId(emp)).filter(Boolean) || []
  ), [team]);

  // RHF
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(
      Yup.object({
        employeeList: Yup.array().min(1, "Sélectionne au moins un membre à ajouter"),
      })
    ),
    defaultValues: { employeeList: [] }
  });

  useEffect(() => {
    if (!open) {
      reset({ employeeList: [] });
      setSelectedDomaine("");
    }
  }, [open, reset]);

  const currentlySelected = watch("employeeList") || [];
  const currentlySelectedIds = currentlySelected.map(emp => normalizeId(emp));

  const availableEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const empId = normalizeId(emp);
      if (!empId) return false;
      const isNotAssignedAnywhere = !assignedEmployeeIdsInProject.includes(empId);
      const isCurrentlySelected = currentlySelectedIds.includes(empId);
      return isNotAssignedAnywhere || isCurrentlySelected;
    });
    if (selectedDomaine) filtered = filtered.filter(emp => emp.domain === selectedDomaine);
    return filtered;
  }, [
    employees,
    assignedEmployeeIdsInProject,
    currentlySelectedIds,
    selectedDomaine
  ]);

  const onSubmit = async (data) => {
    try {
      const newMemberIds = data.employeeList.map(emp => normalizeId(emp));
      const conflictingIds = newMemberIds.filter(id =>
        assignedEmployeeIdsInProject.includes(id) && !currentTeamMemberIds.includes(id)
      );
      if (conflictingIds.length > 0) {
        toast.error("Certains employés sont déjà assignés à une autre équipe de ce projet.");
        return;
      }
      const finalEmployeeList = [
        ...currentTeamMemberIds,
        ...newMemberIds
      ].filter((id, index, arr) => arr.indexOf(id) === index);

      const actionResult = await dispatch(updateTeam({
        id: team._id,
        updateData: { employeeList: finalEmployeeList }
      }));

      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de l'ajout de membre.");
        return;
      }
      toast.success("Membre(s) ajouté(s) avec succès");
      handleClose();
      dispatch(fetchAllTeams());
    } catch (error) {
      toast.error("Erreur interne !");
    }
  };

  if (!team) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <ModelComponent
        open={open}
        handleClose={handleClose}
        title={
          <span>
            Ajouter des membres à&nbsp;
            <span style={{ color: "#1565c0" }}>{team.title}</span>
          </span>
        }
        icon={<GroupAddOutlinedIcon />}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Box sx={{ width: "100%", maxWidth: 410, mx: "auto" }}>
            {/* Filtre domaine */}
            <TextField
              select
              label="Filtrer par domaine"
              value={selectedDomaine}
              onChange={e => setSelectedDomaine(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value=""></option>
              {domaines.map(dom => (
                <option key={dom} value={dom}>{dom}</option>
              ))}
            </TextField>

            {/* Autocomplete selection */}
            <Controller
              name="employeeList"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={availableEmployees}
                  getOptionLabel={option =>
                    `${option.fullName || option.name} (${option.domain || 'N/A'})`
                  }
                  value={field.value}
                  loading={loading}
                  onChange={(_, value) => field.onChange(value)}
                  isOptionEqualToValue={(option, value) =>
                    normalizeId(option) === normalizeId(value)
                  }
                  noOptionsText={
                    availableEmployees.length === 0
                      ? "Tous les employés sont déjà assignés à une équipe de ce projet"
                      : "Aucun employé trouvé"
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Sélectionne un ou plusieurs membres *"
                      error={!!errors.employeeList}
                      helperText={errors.employeeList?.message}
                      fullWidth
                    />
                  )}
                  sx={{ mb: 0.5 }}
                />
              )}
            />

            {/* Message rouge dispo */}
            {availableEmployees.length === 0 && (
              <Box sx={{
                color: "#FF5555",
                fontWeight: 500,
                textAlign: "center",
                mt: 1,
                mb: 1
              }}>
                Aucun membre disponible pour ce projet
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleClose} color="inherit" variant="outlined">
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={availableEmployees.length === 0}
                sx={{ minWidth: 120 }}
              >
                Ajouter
              </Button>
            </Box>
          </Box>
        </form>
      </ModelComponent>
    </>
  );
}
