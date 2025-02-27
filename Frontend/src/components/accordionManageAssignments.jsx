import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { FormDialogEditAssignment } from "./formDialog"; // Import the updated dialog

export default function AccordionUsage({ index, title, description, difficulty, status, startdate, enddate, assignmentID }) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    assignmentID,
    title,
    description,
    difficulty,
    status,
    startdate,
    enddate,
  });

  // Handle edit button click
  const handleEdit = () => {
    setOpen(true);
  };

  // Handle save after editing
  const handleSave = (updatedData) => {
    setAssignmentData((prev) => ({ ...prev, ...updatedData }));
    console.log("Updated Assignment:", updatedData);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    console.log("Deleting assignment with ID:", assignmentData.assignmentID);
    
    fetch(`http://localhost:8080/api/assignment/${assignmentData.assignmentID}`, {
      method: "DELETE",
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete assignment");
      console.log("Assignment deleted successfully!");
      // Perform any additional state updates or UI refresh logic here
    })
    .catch((error) => console.error("Error deleting assignment:", error));

    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <Accordion key={index}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
          sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
        >
          <Typography component="span" sx={{ flexGrow: 1 }}>
            {assignmentData.title} {index}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>Description: {assignmentData.description}</Typography>
          <Typography>Difficulty: {assignmentData.difficulty}</Typography>
          <Typography>Status: {assignmentData.status}</Typography>
          <Typography>Start Date: {new Date(assignmentData.startdate).toLocaleString()}</Typography>
          <Typography>End Date: {new Date(assignmentData.enddate).toLocaleString()}</Typography>
        </AccordionDetails>

        <Box sx={{ display: "flex", padding: "1rem", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" size="small" color="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={handleDeleteClick}>
            Delete
          </Button>
        </Box>
      </Accordion>

      {/* Edit Dialog */}
      <FormDialogEditAssignment open={open} onClose={() => setOpen(false)} assignment={assignmentData} onSave={handleSave} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this assignment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
