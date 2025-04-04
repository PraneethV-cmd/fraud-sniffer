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
  CircularProgress,
  Tooltip,
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
import { Context } from "../../context/context"
import { useContext } from "react"
import { styled } from "@mui/material/styles"

const ScoreGauge = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

const ScoreLabel = styled(Typography)(({ theme, risk }) => ({
  position: "absolute",
  bottom: 0,
  color: risk === "low" ? "#4caf50" : risk === "medium" ? "#ff9800" : "#f44336",
  fontWeight: "bold",
}))

const ThresholdMarker = styled(Box)(({ theme, position, color }) => ({
  position: "absolute",
  width: "3px",
  height: "10px",
  backgroundColor: color,
  bottom: "5px",
  transform: `translateX(${position}px)`,
}))

const RiskIndicator = styled(Box)(({ theme, risk }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: risk === "low" ? "#e8f5e9" : risk === "medium" ? "#fff3e0" : "#ffebee",
  color: risk === "low" ? "#2e7d32" : risk === "medium" ? "#e65100" : "#c62828",
  fontWeight: "bold",
  display: "inline-block",
}))

const UserProfile = () => {
  const { userData, setUserData } = useContext(Context)

  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...userData })
  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const getRiskLevel = (score) => {
    const normalizedScore = score > 1000 ? 1000 : score
    if (normalizedScore < 400) return "high"
    if (normalizedScore < 700) return "medium"
    return "low"
  }

  const getColorForRisk = (risk) => {
    switch (risk) {
      case "low":
        return "#4caf50" // green
      case "medium":
        return "#ff9800" // orange
      case "high":
        return "#f44336" // red
      default:
        return "#4caf50"
    }
  }

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
      .then((response) => {
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

                <ScoreGauge>
                  <Tooltip title={`${userData.score} out of 1000`} arrow>
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={(userData.score / 1000) * 100}
                        size={120}
                        thickness={5}
                        sx={{
                          color: getColorForRisk(getRiskLevel(userData.score)),
                          "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h5" component="div" color="text.secondary" fontWeight="bold">
                          {userData.score}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                  <Box sx={{ width: "100%", mt: 1, display: "flex", justifyContent: "center", position: "relative" }}>
                    <ThresholdMarker position={-40} color="#f44336" />
                    <ThresholdMarker position={0} color="#ff9800" />
                    <ThresholdMarker position={40} color="#4caf50" />
                  </Box>
                  <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Typography variant="caption" color="error">
                      High Risk
                    </Typography>
                    <Typography variant="caption" color="warning.main">
                      Medium
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Low Risk
                    </Typography>
                  </Box>
                  <RiskIndicator risk={getRiskLevel(userData.score)}>
                    {getRiskLevel(userData.score).toUpperCase()} RISK
                  </RiskIndicator>
                </ScoreGauge>
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
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                          <Box
                            sx={{
                              width: "100%",
                              height: "8px",
                              borderRadius: "4px",
                              background:
                                "linear-gradient(90deg, #f44336 0%, #f44336 40%, #ff9800 40%, #ff9800 70%, #4caf50 70%, #4caf50 100%)",
                              position: "relative",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                height: "16px",
                                width: "4px",
                                backgroundColor: "#000",
                                top: "-4px",
                                left: `${(userData.score / 1000) * 100}%`,
                                transform: "translateX(-50%)",
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 0.5 }}>
                          <Typography variant="caption" color="error">
                            0
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            400
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            700
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            1000
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
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

