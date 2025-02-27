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
      })
      .catch((error) => console.error("Error deleting assignment:", error));

    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <Accordion
        key={index}
        sx={{
          borderRadius: "10px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f5f5f5, #ffffff)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.2)",
          },
          "&.Mui-expanded": {
            border: "2px solid #4CAF50",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#4CAF50", fontSize: "2rem" }} />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
          sx={{
            padding: "1rem",
            fontWeight: "bold",
            color: "#333",
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <Typography component="span" sx={{ flexGrow: 1, fontSize: "1.2rem", fontWeight: 600 }}>
            {assignmentData.title} #{index}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
  sx={{
    padding: "1rem",
    background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  }}
>
  <Typography
    variant="body1"
    sx={{ fontWeight: "bold", color: "#333", fontSize: "1.1rem" }}
  >
    Description:
  </Typography>
  <Typography
    variant="body2"
    sx={{ color: "#555", paddingBottom: "0.5rem", fontSize: "1rem" }}
  >
    {assignmentData.description}
  </Typography>

  <Typography
    variant="body1"
    sx={{ fontWeight: "bold", color: "#333", fontSize: "1.1rem" }}
  >
    Difficulty:
  </Typography>
  <Typography
    variant="body2"
    sx={{ color: "#555", paddingBottom: "0.5rem", fontSize: "1rem" }}
  >
    {assignmentData.difficulty}
  </Typography>

  <Typography
    variant="body1"
    sx={{ fontWeight: "bold", color: "#333", fontSize: "1.1rem" }}
  >
    Status:
  </Typography>
  <Typography
    variant="body2"
    sx={{
      color:
        assignmentData.status === "Completed" ? "green" : "orange",
      fontWeight: "bold",
      paddingBottom: "0.5rem",
      fontSize: "1rem",
    }}
  >
    {assignmentData.status}
  </Typography>

  <Typography
    variant="body1"
    sx={{ fontWeight: "bold", color: "#333", fontSize: "1.1rem" }}
  >
    Start Date:
  </Typography>
  <Typography
    variant="body2"
    sx={{ color: "#555", paddingBottom: "0.5rem", fontSize: "1rem" }}
  >
    {new Date(assignmentData.startdate).toLocaleString()}
  </Typography>

  <Typography
    variant="body1"
    sx={{ fontWeight: "bold", color: "#333", fontSize: "1.1rem" }}
  >
    End Date:
  </Typography>
  <Typography
    variant="body2"
    sx={{ color: "#555", fontSize: "1rem" }}
  >
    {new Date(assignmentData.enddate).toLocaleString()}
  </Typography>
</AccordionDetails>


        <Box sx={{ display: "flex", padding: "1rem", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="contained" size="small" color="primary" onClick={handleEdit} sx={{ borderRadius: "20px" }}>
            ✏️ Edit
          </Button>
          <Button variant="contained" size="small" color="error" onClick={handleDeleteClick} sx={{ borderRadius: "20px" }}>
            ❌ Delete
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
