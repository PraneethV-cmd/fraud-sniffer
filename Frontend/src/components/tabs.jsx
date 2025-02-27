import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccordionUsage from "./accordionManageAssignments";
import ViewAssignmentsAccordion from "./accordionViewAssignments";
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
        headers: { 
          "Content-Type": "application/json" 
        },
      }).then((response) => response.json()),

      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=owner`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),
    ])
      .then(([participantData, ownerData]) => {
        console.log("Participant:", participantData);
        console.log("Owner:", ownerData);
        setAssignmentList(participantData);
        setManagableAssignments(ownerData);
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

  return (
    <Box sx={{ width: "100%", padding: "20px", paddingLeft: "40px" }}>

      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tab
          value="View Assignments"
          label={<span>📚 View Assignments</span>}
          sx={{
            fontWeight: "bold",
            color: "#1976D2",
            textTransform: "none",
            transition: "transform 0.3s, color 0.3s, letter-spacing 0.4s",
            "&:hover": {
              color: "#004ba0",
              letterSpacing: "4px",
            },
          }}
        />
        <Tab
          value="Manage Assignments"
          label={<span>📔 Manage Assignments</span>}
          sx={{
            fontWeight: "bold",
            color: "#1976D2",
            textTransform: "none",
            transition: "transform 0.3s, color 0.3s, letter-spacing 0.4s",
            "&:hover": {
              color: "#004ba0",
              letterSpacing: "4px",
            },
          }}
        />
        <Tab
          value="Create Assignments"
          label={<span>✍️ Create Assignments</span>}
          sx={{
            fontWeight: "bold",
            color: "#1976D2",
            textTransform: "none",
            transition: "transform 0.3s, color 0.3s, letter-spacing 0.4s",
            "&:hover": {
              color: "#004ba0",
              letterSpacing: "4px",
            },
          }}
        />
        <Tab
          value="Check Plagiarism"
          label={<span>🔍 Check Plagiarism</span>}
          sx={{
            fontWeight: "bold",
            color: "#1976D2",
            textTransform: "none",
            transition: "transform 0.3s, color 0.3s, letter-spacing 0.4s",
            "&:hover": {
              color: "#004ba0",
              letterSpacing: "4px",
            },
          }}
        />

        <AutohideSnackbar 
          message={snackbarMessage} 
          open={snackbarOpen} 
          onClose={() => setSnackbarOpen(false)} 
        />

      </Tabs>

      <Box sx={{ marginTop: 2, width: "100%", position: "relative" }}>
        {value === "View Assignments" && (
          <>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="primary" />
              </Box>
            ) : assignmentList.length > 0 ? (
              assignmentList.map((assignment, index) => (
                <ViewAssignmentsAccordion key={`view_assignments-${assignment.assignmentinfoid}`} index={index} assignment={assignment} />
              ))
            ) : (
              <Typography variant="h6" textAlign="center" mt={4}>
                No assignments found.
              </Typography>
            )}

            {/* Floating "+JOIN" Button */}
            <Fab 
              color="primary" 
              aria-label="join" 
              onClick={handleOpenJoinDialog} 
              sx={{ position: "fixed", bottom: 20, right: 20 }}
            >
              <AddIcon />
            </Fab>

            {/* Join Code Dialog */}
            <Dialog open={openJoinDialog} onClose={handleCloseJoinDialog}>
              <DialogTitle>Enter Join Code</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Join Code"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseJoinDialog} color="error">Cancel</Button>
                <Button onClick={handleSubmitJoinCode} color="primary" variant="contained">Submit</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>

      {value === "Manage Assignments" && (
        <Box sx={{ marginTop: 2, width: "100%" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : managableAssignments.length > 0 ? (
            <>
              {managableAssignments.map((assignment) => (
                <AccordionUsage key={`manage_assignments-${assignment.assignmentid}`} title={assignment.title} description={assignment.description} difficulty={assignment.difficulty} status={assignment.status} startdate={assignment.startdate} enddate={assignment.enddate} assignmentID={assignment.assignmentid}/>
              ))}
            </>
          ) : (
            <Typography variant="h6" textAlign="center" mt={4}>
              No assignments found.
            </Typography>
          )}
        </Box>
      )}

      {value === "Create Assignments" && <CreateAssignmentForm />}
      {value === "Check Plagiarism" && <div>Plagiarism Checker</div>}
    </Box>
  );
}
