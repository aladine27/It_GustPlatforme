import React from 'react';
import ModelComponent from '../Global/ModelComponent'; // modal stylé, fourni par toi
import { Button, Stack, Typography, Chip, Box } from '@mui/material';

export default function EventDetailsModal({
  open,
  handleClose,
  event,
  onEdit,
  onDelete
}) {
  if (!event) return null;

  return (
    <ModelComponent
      open={open}
      handleClose={handleClose}
      title={event.title}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {event.status}
      </Typography>
      <Typography sx={{ mb: 1.5 }}>
        <strong>Description:</strong> {event.description || 'Aucune description'}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>Début:</strong> {new Date(event.startDate).toLocaleString()}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>Durée:</strong> {event.duration}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>Emplacement:</strong> {event.location}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>Type:</strong> {event.types?.[0]?.name || 'Non défini'}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>Invités:</strong> 
        <Box component="span" sx={{ ml: 1 }}>
          {(event.invited || []).length > 0
            ? event.invited.map(user => (
                <Chip key={user._id} label={user.fullName} size="small" sx={{ mr: 0.5 }} />
              ))
            : "Aucun"}
        </Box>
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={onEdit}>
          Modifier
        </Button>
        <Button variant="contained" color="error" onClick={() => onDelete(event._id)}>
          Supprimer
        </Button>
      </Stack>
    </ModelComponent>
  );
}
