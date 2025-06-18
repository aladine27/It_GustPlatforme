import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button, 
  Stack, 
  Typography, 
  Chip, 
  Box, 
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function EventDetailsModal({
  open,
  handleClose,
  event,
  eventTypes,
  onEdit,
  onDelete,
  userRole
}) {
  console.log("EventDetailsModal > event :", event);
  console.log("EventDetailsModal > open :", open);

  if (!event) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          {event.title}
        </Typography>
        <IconButton 
          aria-label="close" 
          onClick={handleClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Description</strong>
            </Typography>
            <Typography variant="body1">
              {event.description || 'Aucune description'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Date et heure de début</strong>
            </Typography>
            <Typography variant="body1">
              {event.startDate ? new Date(event.startDate).toLocaleString('fr-FR') : 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Durée</strong>
            </Typography>
            <Typography variant="body1">
              {event.duration || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Emplacement</strong>
            </Typography>
            <Typography variant="body1">
              {event.location || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Statut</strong>
            </Typography>
            <Chip 
              label={event.status || 'N/A'} 
              size="small"
              color={
                event.status === 'Terminé' ? 'success' :
                event.status === 'Annulé' ? 'error' :
                event.status === 'En cours' ? 'warning' : 'default'
              }
            />
          </Box>

          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Type d'événement</strong>
            </Typography>
            <Typography variant="body1">
              {event.types && event.types.length > 0 && event.types[0]?.name
                ? event.types[0].name
                : 'Non défini'}
            </Typography>
          </Box>


          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Invités</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {Array.isArray(event.invited) && event.invited.length > 0
                ? event.invited
                    .filter(user => !!user && (user.fullName || user.name))
                    .map(user => (
                      <Chip
                        key={user._id || user.id || Math.random()}
                        label={user.fullName || user.name || "Invité"}
                        size="small"
                        variant="outlined"
                      />
                    ))
                : <Typography variant="body1" color="text.secondary">Aucun invité</Typography>
              }
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      {["Admin", "RH"].includes(userRole) && (
        <>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={onEdit}
            >
              MODIFIER
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => onDelete(event._id)}
            >
              SUPPRIMER
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}