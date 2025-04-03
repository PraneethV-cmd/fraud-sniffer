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

const UserProfile = () => {
  // Mock user data (would come from API in a real app)
  const [user, setUser] = useState({
    userID: 1,
    userName: "JohnDoe",
    email: "john.doe@example.com",
    score: 1250,
    password: "********", // Placeholder for UI only
  })

  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...user })
  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Generate initials for avatar
  const getInitials = (name) => {
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
                  {user.userName}
                </Typography>
                <Typography variant="body1" color="textSecondary" className="profile-email">
                  {user.email}
                </Typography>
                <Box className="score-container">
                  <BadgeIcon color="primary" />
                  <Typography variant="h6" component="p" className="profile-score">
                    Score: {user.score}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" className="profile-id">
                  User ID: {user.userID}
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
                          name="userName"
                          value={editedUser.userName}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <Box className="field-content">
                          <Typography variant="body2" color="textSecondary">
                            Username
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
                        <Typography variant="body1">{user.score} points</Typography>
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

