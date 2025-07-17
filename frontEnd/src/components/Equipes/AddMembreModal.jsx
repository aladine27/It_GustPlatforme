import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Autocomplete
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { updateTeam, fetchAllTeams } from "../../redux/actions/teamActions";
import { FetchEmployesAction } from "../../redux/actions/employeAction";

const AddMemberToTeamModal = ({ open, handleClose, team }) => {
  const dispatch = useDispatch();

  // Récupérer tous les employés (uniquement "Employe")
  const { list: allEmployes, loading } = useSelector(state => state.employe);
  useEffect(() => { if (open) dispatch(FetchEmployesAction()); }, [open, dispatch]);
  const employees = (allEmployes || []).filter(emp => emp.role === "Employe");

  // Filtrer ceux déjà dans l'équipe (pour éviter les doublons)
  const alreadyInTeam = team?.employeeList?.map(e => e._id) || [];
  const employeesToAdd = employees.filter(e => !alreadyInTeam.includes(e._id));

  // Validation Yup
  const schema = Yup.object({
    employeeList: Yup.array().min(1, "Sélectionne au moins un membre à ajouter"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { employeeList: [] }
  });

  useEffect(() => {
    if (!open) reset({ employeeList: [] });
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      // Nouvelle liste = anciens membres + nouveaux membres
      const newEmployeeIds = [
        ...alreadyInTeam,
        ...data.employeeList.map(e => e._id)
      ];

      const actionResult = await dispatch(updateTeam({
        id: team._id,
        updateData: { employeeList: newEmployeeIds }
      }));
      if (actionResult?.error) {
        toast.error(actionResult?.payload || "Erreur lors de l'ajout de membre.");
        return;
      }
      toast.success("Membre(s) ajouté(s) avec succès");
      handleClose();
      dispatch(fetchAllTeams()); // refresh
    } catch (e) {
      toast.error("Erreur interne !");
    }
  };

  if (!team) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter des membres à l’équipe {team.title}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="employeeList"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={employeesToAdd}
                  getOptionLabel={option => option.fullName || option.name}
                  value={field.value}
                  loading={loading}
                  onChange={(_, value) => field.onChange(value)}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Membres à ajouter *"
                      error={!!errors.employeeList}
                      helperText={errors.employeeList?.message}
                    />
                  )}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">Ajouter</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddMemberToTeamModal;
