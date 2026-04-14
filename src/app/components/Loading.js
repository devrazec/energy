'use client';

import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

export default function Loading() {
  const { isLoading } = useContext(GlobalContext);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={isLoading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
}
