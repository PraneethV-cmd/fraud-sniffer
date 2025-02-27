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
      <Accordion key={index} sx={{ backgroundColor: "#f5f5f5", boxShadow: 2, borderRadius: "8px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#1976D2" }} />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "#e3f2fd",
            borderBottom: "1px solid #ddd",
            padding: "12px 16px",
          }}
        >
          <Typography component="span" sx={{ flexGrow: 1, fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>
            {assignment.title} (Difficulty: {assignment.difficulty})
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: "16px", backgroundColor: "#fff" }}>
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>Description:</strong> {assignment.description}
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>Status:</strong> {assignment.status}
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>Start Date:</strong> {new Date(assignment.startdate).toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>End Date:</strong> {new Date(assignment.enddate).toLocaleString()}
          </Typography>

          {/* File Download Section */}
          {assignment.filepath && assignment.filepath !== "" && assignment.filepath !== "no_file" && (
            <Typography variant="body2" sx={{ marginTop: "8px", fontSize: "0.95rem", color: "#1976D2", fontWeight: "bold" }}>
              📄 Resource: {" "}
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
        <Box sx={{ display: "flex", padding: "1rem", gap: 1, justifyContent: "flex-end", backgroundColor: "#e3f2fd", borderTop: "1px solid #ddd" }}>
          <Button variant="contained" size="small" sx={{ backgroundColor: "#1976D2", color: "#fff" }} onClick={() => setOpen(true)}>
            Submit Assignment
          </Button>
        </Box>
      </Accordion>

      {/* Upload Assignment Dialog */}
      <FormDialogSubmitAssignment open={open} onClose={() => setOpen(false)} assignmentID={assignment.assignmentID} />
    </div>
  );
}