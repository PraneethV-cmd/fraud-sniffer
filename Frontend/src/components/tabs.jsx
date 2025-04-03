import React, { useContext, useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  CircularProgress, 
  Fab,
  Paper,
  Container,
  useTheme,
  alpha
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccordionUsage from "./accordionManageAssignments";
import ViewAssignmentsAccordion from "./accordionViewAssignments";
import AccordionPlagiarismChecker from "./accordionPlagiarismChecker";
import CreateAssignmentForm from "./CreateAssignmentForm";
import { Context } from "../context/context";
import AutohideSnackbar from "./snackBar";

export default function ColorTabs() {
  const {
    value, setValue,
    assignmentList, setAssignmentList,
    managableAssignments, setManagableAssignments,
    loading, setLoading
  } = useContext(Context);

  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

  // Open Dialog
  const handleOpenJoinDialog = () => {
    setOpenJoinDialog(true);
  };

  // Close Dialog
  const handleCloseJoinDialog = () => {
    setOpenJoinDialog(false);
    setJoinCode("");
  };

  // Handle Submit Join Code
  const handleSubmitJoinCode = () => {
    const userID = sessionStorage.getItem("userID");
    fetch("http://localhost:8080/api/assignment/join", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ joinCode, userID })
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => { throw new Error(err.error); });
      }
      return response.json();
    })
    .then((data) => {
      setAssignmentList(data);
      setSnackbarMessage("Successfully joined the assignment!");
      setSnackbarOpen(true);
    })
    .catch((err) => {
      setSnackbarMessage(`Error: ${err.message}`);
      setSnackbarOpen(true);
    });

    handleCloseJoinDialog();
  };

  useEffect(() => {
    const userID = sessionStorage.getItem("userID");
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=participant`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),

      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=owner`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),

      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=getSubmissions`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),
    ])
      .then(([participantData, ownerData, submissionData]) => {
        const ownerDataWithSubmissions = ownerData.map(ownerAssignment => {
          const submissions = submissionData.filter(sub => sub.assignmentid === ownerAssignment.assignmentid);
          return { ...ownerAssignment, submissions };
        });

        setAssignmentList(participantData);
        setManagableAssignments(ownerDataWithSubmissions);
      })
      .catch((err) => {
        console.error("Error fetching assignments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteAssignment = (assignmentId) => {
    setManagableAssignments((prevAssignments) =>
      prevAssignments.filter((assignment) => assignment.assignmentid !== assignmentId)
    );
  };

  const updateManagebleAssignments = (updatedAssignment) => {
    setManagableAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.assignmentid === updatedAssignment.assignmentid ? updatedAssignment : assignment
      )
    );
  };

  // Custom styles for tabs
  const tabStyle = (isSelected) => ({
    fontWeight: "600",
    fontSize: "1rem",
    color: isSelected ? "#ffffff" : "#555555",
    textTransform: "none",
    transition: "all 0.3s ease-in-out",
    letterSpacing: "0.5px",
    padding: "12px 24px",
    borderRadius: "10px",
    margin: "0 8px",
    background: isSelected 
      ? "linear-gradient(45deg, #5e35b1, #3949ab)" 
      : "linear-gradient(45deg, #f5f5f5, #e0e0e0)",
    boxShadow: isSelected 
      ? "0 6px 12px rgba(94, 53, 177, 0.3)" 
      : "0 2px 5px rgba(0, 0, 0, 0.05)",
    "&:hover": {
      background: isSelected 
        ? "linear-gradient(45deg, #5e35b1, #3949ab)" 
        : "linear-gradient(45deg, #e0e0e0, #f5f5f5)",
      transform: "translateY(-2px)",
      boxShadow: isSelected 
        ? "0 8px 16px rgba(94, 53, 177, 0.4)" 
        : "0 4px 8px rgba(0, 0, 0, 0.1)",
    }
  });

  // Custom icons for tabs
  const getTabIcon = (tabValue) => {
    switch(tabValue) {
      case "View Assignments": return "📚";
      case "Manage Assignments": return "📔";
      case "Create Assignments": return "✍️";
      case "Check Plagiarism": return "🔍";
      default: return "";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          width: "100%", 
          padding: "30px", 
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
          minHeight: "90vh",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header with title */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 4,
            pb: 2,
            borderBottom: "2px solid",
            borderColor: alpha(theme.palette.primary.main, 0.2)
          }}
        >
          <SchoolIcon 
            sx={{ 
              fontSize: 40, 
              color: "#5e35b1", 
              mr: 2,
              filter: "drop-shadow(0 2px 4px rgba(94, 53, 177, 0.3))"
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              color: "#5e35b1",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}
          >
            Classroom Assignment Manager
          </Typography>
        </Box>

        {/* Tabs navigation */}
        <Paper 
          elevation={3} 
          sx={{
            display: "flex",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "16px",
            padding: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            marginBottom: "30px",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 10
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTabs-flexContainer": {
                gap: 1,
              }
            }}
          >
            {["View Assignments", "Manage Assignments", "Create Assignments", "Check Plagiarism"].map((tabValue) => (
              <Tab
                key={tabValue}
                value={tabValue}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{getTabIcon(tabValue)}</span>
                    <span><b>{tabValue}</b></span>
                  </Box>
                }
                sx={tabStyle(value === tabValue)}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content area with animation */}
        <Box 
          sx={{ 
            position: "relative",
            animation: "fadeIn 0.5s ease-in-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" }
            }
          }}
        >
          {value === "View Assignments" && (
            <Paper 
              elevation={4} 
              sx={{ 
                padding: "25px", 
                borderRadius: "20px", 
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: "bold", 
                  color: "#5e35b1",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {getTabIcon("View Assignments")} Your Assignments
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress sx={{ color: "#5e35b1" }} />
                </Box>
              ) : assignmentList.length > 0 ? (
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 2,
                  "& > *": {
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)"
                    }
                  }
                }}>
                  {assignmentList.map((assignment, index) => (
                    <ViewAssignmentsAccordion 
                      key={`view_assignments-${assignment.assignmentinfoid}`} 
                      index={index} 
                      assignment={assignment} 
                    />
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    textAlign: "center", 
                    py: 6,
                    px: 3,
                    borderRadius: "12px",
                    background: "rgba(94, 53, 177, 0.05)",
                    border: "1px dashed rgba(94, 53, 177, 0.3)"
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#666", 
                      fontStyle: "italic",
                      mb: 1
                    }}
                  >
                    No assignments found
                  </Typography>
                  <Typography color="text.secondary">
                    Join an assignment using the + button in the bottom right
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {value === "Manage Assignments" && (
            <Paper 
              elevation={4} 
              sx={{ 
                padding: "25px", 
                borderRadius: "20px", 
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: "bold", 
                  color: "#5e35b1",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {getTabIcon("Manage Assignments")} Manage Your Assignments
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress sx={{ color: "#5e35b1" }} />
                </Box>
              ) : managableAssignments.length > 0 ? (
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 2,
                  "& > *": {
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)"
                    }
                  }
                }}>
                  {managableAssignments.map((assignment, index) => (
                    <AccordionUsage 
                      key={`manage_assignments-${assignment.assignmentid}`} 
                      index={index} 
                      assignment={assignment} 
                      onDelete={handleDeleteAssignment} 
                    />
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    textAlign: "center", 
                    py: 6,
                    px: 3,
                    borderRadius: "12px",
                    background: "rgba(94, 53, 177, 0.05)",
                    border: "1px dashed rgba(94, 53, 177, 0.3)"
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#666", 
                      fontStyle: "italic",
                      mb: 1
                    }}
                  >
                    No assignments to manage
                  </Typography>
                  <Typography color="text.secondary">
                    Create an assignment in the "Create Assignments" tab
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {value === "Create Assignments" && (
            <Paper 
              elevation={4} 
              sx={{ 
                padding: "25px", 
                borderRadius: "20px", 
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: "bold", 
                  color: "#5e35b1",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {getTabIcon("Create Assignments")} Create New Assignment
              </Typography>
              <CreateAssignmentForm />
            </Paper>
          )}

          {value === "Check Plagiarism" && (
            <Paper 
              elevation={4} 
              sx={{ 
                padding: "25px", 
                borderRadius: "20px", 
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: "bold", 
                  color: "#5e35b1",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {getTabIcon("Check Plagiarism")} Plagiarism Checker
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress sx={{ color: "#5e35b1" }} />
                </Box>
              ) : managableAssignments.length > 0 ? (
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 2,
                  "& > *": {
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)"
                    }
                  }
                }}>
                  {managableAssignments.map((assignment, index) => (
                    <AccordionPlagiarismChecker 
                      key={`plagiarism-checker-${assignment.assignmentid}`} 
                      index={index} 
                      assignment={assignment} 
                      updateAssignment={updateManagebleAssignments}
                    />
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    textAlign: "center", 
                    py: 6,
                    px: 3,
                    borderRadius: "12px",
                    background: "rgba(94, 53, 177, 0.05)",
                    border: "1px dashed rgba(94, 53, 177, 0.3)"
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#666", 
                      fontStyle: "italic",
                      mb: 1
                    }}
                  >
                    No assignments to check
                  </Typography>
                  <Typography color="text.secondary">
                    Create an assignment first to check for plagiarism
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Box>

        {/* Floating "+JOIN" Button with animation */}
        <Fab 
          color="primary" 
          aria-label="join" 
          onClick={handleOpenJoinDialog} 
          sx={{ 
            position: "fixed", 
            bottom: 30, 
            right: 30, 
            background: "linear-gradient(45deg, #5e35b1, #3949ab)", 
            "&:hover": { 
              background: "linear-gradient(45deg, #3949ab, #5e35b1)", 
              transform: "scale(1.1) rotate(90deg)", 
            }, 
            boxShadow: "0 6px 16px rgba(94, 53, 177, 0.4)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { boxShadow: "0 0 0 0 rgba(94, 53, 177, 0.7)" },
              "70%": { boxShadow: "0 0 0 10px rgba(94, 53, 177, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(94, 53, 177, 0)" }
            }
          }}
        >
          <AddIcon sx={{ fontSize: "2rem" }} />
        </Fab>

        {/* Join Code Dialog */}
        <Dialog 
          open={openJoinDialog} 
          onClose={handleCloseJoinDialog}
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.2)",
              padding: "20px",
              maxWidth: "400px",
              width: "100%"
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              fontWeight: "bold", 
              color: "#5e35b1", 
              textAlign: "center",
              fontSize: "1.5rem",
              pb: 1
            }}
          >
            Join an Assignment
          </DialogTitle>
          <DialogContent>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                textAlign: "center", 
                mb: 3,
                px: 2
              }}
            >
              Enter the code provided by your instructor to join the assignment
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Join Code"
              type="text"
              fullWidth
              variant="outlined"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: alpha("#5e35b1", 0.3),
                    borderWidth: "2px"
                  },
                  "&:hover fieldset": {
                    borderColor: alpha("#5e35b1", 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5e35b1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: alpha("#5e35b1", 0.8),
                  "&.Mui-focused": {
                    color: "#5e35b1",
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", paddingBottom: "20px", gap: 2 }}>
            <Button 
              onClick={handleCloseJoinDialog} 
              sx={{ 
                borderRadius: "10px", 
                padding: "8px 20px", 
                fontWeight: "bold",
                color: "#f44336",
                border: "2px solid",
                borderColor: alpha("#f44336", 0.5),
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderColor: "#f44336",
                  background: alpha("#f44336", 0.05),
                  transform: "translateY(-2px)",
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitJoinCode} 
              variant="contained" 
              disabled={!joinCode.trim()}
              sx={{ 
                borderRadius: "10px", 
                padding: "8px 20px", 
                fontWeight: "bold",
                background: "linear-gradient(45deg, #5e35b1, #3949ab)",
                "&:hover": {
                  background: "linear-gradient(45deg, #3949ab, #5e35b1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(94, 53, 177, 0.4)",
                },
                "&.Mui-disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e"
                }
              }}
            >
              Join Assignment
            </Button>
          </DialogActions>
        </Dialog>

        <AutohideSnackbar 
          message={snackbarMessage} 
          open={snackbarOpen} 
          onClose={() => setSnackbarOpen(false)} 
        />
      </Paper>
    </Container>
  );
}