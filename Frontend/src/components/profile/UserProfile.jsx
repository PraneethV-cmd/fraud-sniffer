import { useState, useEffect } from "react"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import "./UserProfile.css"

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const userID = sessionStorage.getItem('userID');

        if (!token || !userID) {
          throw new Error('Authentication required');
        }

        console.log('Fetching profile for user:', userID);
        const response = await fetch(`http://localhost:8080/api/user/${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Profile data received:', data);
        setUser(data);
        setEditedUser(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit
      setEditedUser({ ...user })
    }
    setEditMode(!editMode)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value,
    })
  }

  const handleSave = () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editedUser.email)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      })
      return
    }

    // Validate username
    if (editedUser.userName.trim().length < 3) {
      setSnackbar({
        open: true,
        message: "Username must be at least 3 characters",
        severity: "error",
      })
      return
    }

    // In a real app, you would send this data to your API
    setUser({ ...editedUser })
    setEditMode(false)
    setSnackbar({
      open: true,
      message: "Profile updated successfully!",
      severity: "success",
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

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

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No profile data available</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="profile-container">
      <Paper elevation={3} className="profile-paper">
        <Box className="profile-header">
          <Typography variant="h4" component="h1" className="profile-title">
            User Profile
          </Typography>
          {!editMode ? (
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditToggle}>
              Edit Profile
            </Button>
          ) : (
            <Box>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleEditToggle}>
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4} className="profile-content">
          <Grid item xs={12} md={4}>
            <Card className="profile-card">
              <CardContent className="profile-card-content">
                <Box className="avatar-container">
                  <Avatar className="profile-avatar">{getInitials(user.userName)}</Avatar>
                </Box>
                <Typography variant="h5" component="h2" className="profile-name">
                  {user.userName} {user.score >= 1000 ? "👼" : "👿"}
                </Typography>
                <Typography variant="body1" color="textSecondary" className="profile-email">
                  {user.email}
                </Typography>
                <Box className="score-container">
                  <BadgeIcon color="primary" />
                  <Typography variant="h6" component="p" className="profile-score">
                    Score: {user.score || 0} {user.score >= 1000 ? "👼" : "👿"}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" className="profile-id">
                  Email: {user.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card className="profile-details-card">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Profile Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box className="detail-field">
                      <Box className="field-icon">
                        <PersonIcon color="primary" />
                      </Box>
                      {editMode ? (
                        <TextField
                          fullWidth
                          label="Name"
                          name="userName"
                          value={editedUser.userName}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <Box className="field-content">
                          <Typography variant="body2" color="textSecondary">
                            Name
                          </Typography>
                          <Typography variant="body1">{user.userName}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className="detail-field">
                      <Box className="field-icon">
                        <EmailIcon color="primary" />
                      </Box>
                      {editMode ? (
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={editedUser.email}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <Box className="field-content">
                          <Typography variant="body2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body1">{user.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className="detail-field">
                      <Box className="field-icon">
                        <BadgeIcon color="primary" />
                      </Box>
                      <Box className="field-content">
                        <Typography variant="body2" color="textSecondary">
                          Score
                        </Typography>
                        <Typography variant="body1">
                          {user.score || 0} {user.score >= 1000 ? "👼" : "👿"}
                          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                            {user.score >= 1000 ? "(Good standing)" : "(Warning: Low score)"}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default UserProfile

