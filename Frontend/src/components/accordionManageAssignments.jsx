import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FormDialogEditAssignment } from "./formDialog"; // Import the updated dialog

export default function AccordionUsage({ index, title, description, difficulty, status, startdate, enddate }) {
  const [open, setOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
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
    setAssignmentData(updatedData);
    console.log("Updated Assignment:", updatedData);
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
          {/* Title */}
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

        <Box sx={{ display: "flex", padding: "1rem", gap:1, justifyContent:"flex-end" }}>
            <Button variant="outlined" size="small" color="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="outlined" size="small" color="error">
              Delete
            </Button>
        </Box>

      </Accordion>

      {/* Edit Dialog */}
      <FormDialogEditAssignment open={open} onClose={() => setOpen(false)} assignment={assignmentData} onSave={handleSave} />
    </div>
  );
}
