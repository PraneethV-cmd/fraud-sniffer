import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Profile from '../components/Profile';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Profile />
      </Box>
    </Container>
  );
};

export default ProfilePage; 