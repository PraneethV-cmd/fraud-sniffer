import { useState } from "react"
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
import { Context } from "../../context/context";
import { useContext, useEffect } from "react";

const UserProfile = () => {
  const {
    userData, setUserData
  } = useContext(Context);

  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...userData })
  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })


  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit
      setEditedUser({ ...userData })
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
    if (editedUser.username.trim().length < 3) {
      setSnackbar({
        open: true,
        message: "Username must be at least 3 characters",
        severity: "error",
      })
      return
    }

    fetch(`http://localhost:8080/api/user/${userData.userid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editedUser }),

    })
    .then((response) =>{
      setUserData({ ...editedUser })
      response.json()
      setEditMode(false)
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      })
    })
    .catch((error) => {
      console.error("Error updating profile:", error)
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      })
    })
    
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
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
                  <Avatar className="profile-avatar">{userData.username}</Avatar>
                </Box>
                <Typography variant="h5" component="h2" className="profile-name">
                  {userData.username}
                </Typography>
                <Typography variant="body1" color="textSecondary" className="profile-email">
                  {userData.email}
                </Typography>
                <Box className="score-container">
                  <BadgeIcon color="primary" />
                  <Typography variant="h6" component="p" className="profile-score">
                    Score: {userData.score}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" className="profile-id">
                  User ID: {userData.userid}
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
                          label="Username"
                          name="username"
                          value={editedUser.username}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <Box className="field-content">
                          <Typography variant="body2" color="textSecondary">
                            Username
                          </Typography>
                          <Typography variant="body1">{userData.username}</Typography>
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
                          <Typography variant="body1">{userData.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className="detail-field">
                      <Box className="field-icon">
                        <LockIcon color="primary" />
                      </Box>
                      {editMode ? (
                        <TextField
                          fullWidth
                          label="New Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={editedUser.password}
                          onChange={handleInputChange}
                          variant="outlined"
                          helperText="Leave unchanged to keep current password"
                        />
                      ) : (
                        <Box className="field-content">
                          <Typography variant="body2" color="textSecondary">
                            Password
                          </Typography>
                          <Typography variant="body1">••••••••</Typography>
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
                        <Typography variant="body1">{userData.score} points</Typography>
                        <Typography variant="caption" color="textSecondary">
                          (Score is calculated based on your activity and cannot be edited directly)
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default UserProfile

