import { CloseOutlined, DeleteOutline } from "@mui/icons-material";
import ModelComponent from "../Global/ModelComponent";
import { Grid, Typography } from "@mui/material";
import { ButtonComponent } from '../../components/Global/ButtonComponent';

const DeleteEmploye = ({
  open,
  handleClose,
  handleConfirm,
  employeName,
  cancelText = "Annuler",
  confirmText = "Supprimer"
}) => {


  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title="Confirmer la suppression"
      icon={<DeleteOutline />}
    >
      <Grid container direction="column" alignItems="center" spacing={2} sx={{ mt: 0 }}>
        <Grid item>
          <Typography>
            Es-tu sûr de vouloir supprimer {employeName} ?
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
