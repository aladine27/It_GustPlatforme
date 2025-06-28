import { CloseOutlined, DeleteOutline } from "@mui/icons-material";
import ModelComponent from "./ModelComponent";
import { Box, Grid, IconButton, Modal, Typography } from "@mui/material";
import { ButtonComponent } from './ButtonComponent';

const CustomDeleteForm = ({
  open,
  handleClose,
  title,
children,
icon
}) => {


  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
     <Box 
     sx={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"auto",height:"auto",bgcolor:"#fff4f4",borderRadius:"10px",boxShadow:24,p:3}}>
<IconButton aria-label="close" onClick={handleClose} sx={{position:"absolute",top:-7,right:-7,backgroundColor:"#f9e5e4",color:"red"}}>
  <CloseOutlined />
</IconButton>
<Typography style={{textAlign:"center",color:"red",fontSize:18}}>
<Grid>
  {icon}
</Grid>
<Grid>
  {title}
</Grid>
</Typography>
<Box>
  {children}
</Box>
</Box>
    </Modal>
  );
};

export default CustomDeleteForm;
