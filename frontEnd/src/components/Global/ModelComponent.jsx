import { CloseOutlined } from '@mui/icons-material'
import { Box, Grid, Icon, IconButton, Modal, Typography  } from '@mui/material'
import React from 'react'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width:"auto",
  height: "auto",
  bgcolor: '#F4FAFF',
  boxShadow: 10,
  borderRadius: '10px',
  p:3,
};

const ModelComponent = ({ open, handleClose,title,children,icon }) => {
  return (
   <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description" >
<Box sx={style}>
<IconButton
          aria-label="close"
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: -7,
            top: -7,
            backgroundColor: '#F2F2F2',
            color: "#080D50",
          }}>
          <CloseOutlined  />
        </IconButton>
        <Grid sx={{textAlign:"center",color:"#1A9BC3"}}>
          {icon && React.cloneElement(icon, { style: { color:"#1A9BC3" } })}
        </Grid>
        <Typography  style={{textAlign:"center",color:"#1A9BC3",fontSize:20}} >
              <Grid  >
                {title}
              </Grid>
        </Typography>
  <Box>
    {children}
  </Box>
</Box>
   </Modal>
  )
}

export default ModelComponent
