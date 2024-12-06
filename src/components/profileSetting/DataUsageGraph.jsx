import React from 'react';
import { Box, Typography } from '@mui/material';
import PieArcLabel from './charts/PieChart';

const DataUsageGraph = () => {
  return (
    <Box>
      <Typography variant="h6" textAlign="center" mb={2}>
        Data Usage (By File Type)
      </Typography>
      <PieArcLabel/>
    </Box>
  );
};

export default DataUsageGraph;
