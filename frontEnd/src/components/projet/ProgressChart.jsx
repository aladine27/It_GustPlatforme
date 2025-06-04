import React from 'react';
import { Box, Card, Typography, CircularProgress, Grid, Paper } from '@mui/material';

const stats = [
  { label: 'Completed Projects', value: 75, color: '#2e7d32' },   // Green
  { label: 'Ongoing Projects', value: 60, color: '#ed6c02' },     // Orange
  { label: 'Upcoming Projects', value: 30, color: '#0288d1' }     // Blue
];

const ProgressChart = () => {
  return (
    <Card
      sx={{
        p: 4,
        mt: 3,
        
        boxShadow: 4,
        maxWidth: 700,
        mx: 'auto',
        bgcolor: '#fafafa',
        borderRadius: '10px',
      }}
    >
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3} color="primary">
        All Projects Status Overview
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={stat.value}
                    size={80}
                    thickness={4}
                    sx={{ color: stat.color }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {`${stat.value}%`}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle1" mt={2} fontWeight="bold" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default ProgressChart;
