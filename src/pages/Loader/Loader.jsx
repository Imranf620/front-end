import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
        zIndex: 1000, // To ensure the loader is on top
      }}
    >
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default Loader;
