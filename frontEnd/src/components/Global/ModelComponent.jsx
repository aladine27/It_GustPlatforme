import { CloseOutlined } from '@mui/icons-material'
import { Box, Icon, IconButton, Modal, Typography } from '@mui/material'
import React from 'react'

const ModelComponent = ({ open, handleClose,title,children,icon }) => {
  return (
   <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description" >
<Box>
  <IconButton onClick={handleClose}>
    <CloseOutlined />
  </IconButton>
  <Typography>
    {title} <Icon>{icon}</Icon>
  </Typography>
  <Box>
    {children}
  </Box>
</Box>
   </Modal>
  )
}

export default ModelComponent
