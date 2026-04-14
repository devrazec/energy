'use client';

import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

export default function Loading() {
  const { isLoading } = useContext(GlobalContext);

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      open={isLoading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          borderRadius: 3,
          padding: '40px 60px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress
            size={70}
            sx={{
              color: '#008bc1',
              fontWeight: 'bold',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(0, 139, 193, 0.1) 0%, rgba(0, 139, 193, 0.05) 100%)',
            }}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#008bc1',
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '0.5px',
            }}
          >
            Loading
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '12px',
              marginTop: '6px',
              letterSpacing: '2px',
            }}
          >
            Please wait...
          </Typography>
        </Box>
      </Box>
    </Backdrop>
  );
}
