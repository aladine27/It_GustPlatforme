import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const PaginationComponent = ({
  count,
  page,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  color = 'primary',
  size = 'medium',
  showFirstButton = true,
  showLastButton = true,
}) => {
  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper
        elevation={3}
        sx={{
          px: 3,
          py: 2,
          borderRadius: 3,
          backgroundColor: '#fefefe',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Stack spacing={2} direction="row" alignItems="center">
          <Pagination
            count={count}
            page={page}
            onChange={onChange}
            siblingCount={siblingCount}
            boundaryCount={boundaryCount}
            color={color}
            size={size}
            showFirstButton={showFirstButton}
            showLastButton={showLastButton}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default PaginationComponent;
