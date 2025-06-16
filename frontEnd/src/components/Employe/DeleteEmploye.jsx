import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { CreateUserAction } from "../../redux/actions/employeAction";
import ModelComponent from "../Global/ModelComponent";
import { PersonAddAlt1 } from "@mui/icons-material";

const DeleteEmploye = ({ open, handleClose, handleConfirm, employeName, cancelText = "Annuler", confirmText = "Supprimer" }) => {
  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Confirmer la suppression"
      icon={<DeleteOutline />}
    >
      <Grid container direction="column" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Typography>
            Es-tu sûr de vouloir supprimer <strong>{employeName}</strong> ?
          </Typography>
        </Grid>
        <Grid item container justifyContent="center" spacing={2}>
          <Grid item>
            <ButtonComponent text={cancelText} onClick={handleClose} icon={<CloseOutlined />} />
          </Grid>
          <Grid item>
            <ButtonComponent text={confirmText} onClick={handleConfirm} icon={<DeleteOutline />} />
          </Grid>
        </Grid>
      </Grid>
    </ModelComponent>
  );
};
export default DeleteEmploye;
