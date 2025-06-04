import { CloseOutlined } from '@mui/icons-material';
import {
  Box,
  Grid,
  IconButton,
  Modal,
  Typography,
  Divider
} from '@mui/material';
import React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 480,
  bgcolor: '#ffffff',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const ModelComponent = ({ open, handleClose, title, children, icon }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#f1f1f1',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            color: '#333',
          }}
        >
          <CloseOutlined />
        </IconButton>

        {/* Icon + Title */}
        <Grid container direction="column" alignItems="center" spacing={1}>
          {icon && (
            <Grid item>
              {React.cloneElement(icon, {
                style: { fontSize: 40, color: '#1A9BC3' },
              })}
            </Grid>
          )}
          {title && (
            <Grid item>
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: 600, color: '#1A9BC3', textAlign: 'center' }}
              >
                {title}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 2 }} />

        {/* Content */}
        <Box id="modal-description" sx={{ mt: 1 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModelComponent;
