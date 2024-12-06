import React from 'react';
import { Box, Typography } from '@mui/material';

const SubscriptionInfo = ({expiryDateFormatted}) => {
  return (
    <Box textAlign="center" mb={3}>
      <Typography variant="h6">Subscription Plan: Premium</Typography>
      <Typography variant="body1">Expires on: {expiryDateFormatted}</Typography>
    </Box>
  );
};

export default SubscriptionInfo;
