import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FormDialogSubmitAssignment } from "./formDialog"; // Import form dialog for uploading homework

export default function ViewAssignmentsAccordion({ index, assignment }) {
  const [open, setOpen] = useState(false);

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
            {assignment.title} (Difficulty: {assignment.difficulty})
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>Description: {assignment.description}</Typography>
          <Typography>Status: {assignment.status}</Typography>
          <Typography>Start Date: {new Date(assignment.startdate).toLocaleString()}</Typography>
          <Typography>End Date: {new Date(assignment.enddate).toLocaleString()}</Typography>

          {/* File Download Section */}
          {assignment.filepath && assignment.filepath !== "" && assignment.filepath !== "no_file" && (
            <Typography variant="body2" sx={{ marginTop: "8px" }}>
              📄 Resource:{" "}
              <a
                href={`http://localhost:8080/api/download/${assignment.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976D2", fontWeight: "bold", textDecoration: "none" }}
              >
                {assignment.originalfilename || "Download File"}
              </a>
            </Typography>
          )}
        </AccordionDetails>

        {/* Submit Assignment Button */}
        <Box sx={{ display: "flex", padding: "1rem", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" size="small" color="primary" onClick={() => setOpen(true)}>
            Submit Assignment
          </Button>
        </Box>
      </Accordion>

      {/* Upload Assignment Dialog */}
      <FormDialogSubmitAssignment open={open} onClose={() => setOpen(false)} assignmentID={assignment.assignmentID} />
    </div>
  );
}
