import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No authentication token found');
        }

        const userID = sessionStorage.getItem('userID');
        console.log('UserID:', userID);
        if (!userID) {
          throw new Error('User ID not found');
        }

        const response = await fetch(`http://localhost:8080/api/profile/${userID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not ok:', response.status, errorText);
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        console.log('Raw response data:', data);
        
        // The backend sends the data directly as the message
        setProfile({
          user: data,
          createdAssignments: data.createdAssignments || [],
          joinedAssignments: data.joinedAssignments || []
        });
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  console.log('Current profile state:', profile);

  if (!profile || !profile.user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No profile data available</Typography>
      </Box>
    );
  }

  const { user, createdAssignments, joinedAssignments } = profile;

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {user.userName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {user.userName}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* User Score */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  User Score
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h3" color="primary">
                    {user.score || 0}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Assignment Statistics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Assignment Statistics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Created Assignments: {createdAssignments?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Joined Assignments: {joinedAssignments?.length || 0}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile; 