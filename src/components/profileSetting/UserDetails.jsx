import React from 'react';
import { Box, TextField } from '@mui/material';

const UserDetails = ({ username, email, setUsername, setEmail }) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default UserDetails;
