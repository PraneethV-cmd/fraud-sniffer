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
      <Accordion
        key={index}
        sx={{
          background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
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
            padding: "14px 18px",
          }}
        >
          <Typography
            component="span"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#333",
            }}
          >
            {assignment.title} (Difficulty: {assignment.difficulty})
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: "1.2rem",
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "inset 0px 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>Description:</strong> {assignment.description}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              color: assignment.status === "Completed" ? "green" : "orange",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            <strong>Status:</strong> {assignment.status}
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>Start Date:</strong> {new Date(assignment.startdate).toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#444", marginBottom: "8px" }}>
            <strong>End Date:</strong> {new Date(assignment.enddate).toLocaleString()}
          </Typography>

          {/* File Download Section */}
          {assignment.filepath && assignment.filepath !== "" && assignment.filename !== "no_file" && (
            <Typography
              variant="body2"
              sx={{
                marginTop: "8px",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              📄 Resource:{" "}
              <a
                href={`http://localhost:8080/api/download/${assignment.filename}?path=root`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976D2",
                  fontWeight: "bold",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.color = "#0d47a1")}
                onMouseOut={(e) => (e.target.style.color = "#1976D2")}
              >
                {assignment.originalfilename || "Download File"}
              </a>
            </Typography>
          )}

          {assignment.submissionfilepath && assignment.submissionfilepath !== "" && assignment.submissionfilename !== "no_file" && (
            <Typography
              variant="body2"
              sx={{
                marginTop: "8px",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              📄 Submitted :{" "}
              <a
                href={`http://localhost:8080/api/download/${assignment.submissionfilename}?path=${assignment.assignmentid}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976D2",
                  fontWeight: "bold",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.color = "#0d47a1")}
                onMouseOut={(e) => (e.target.style.color = "#1976D2")}
              >
                {assignment.submissionoriginalfilename || "Download File"}
              </a> 
              <span style={{ fontWeight: "0.005rem" }}>
                {` at ${new Date(assignment.submissiondate).toLocaleString("en-US", {
                  timeZoneName: "short"
                }).split(' ')[0]} ${new Date(assignment.submissiondate).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true
                })}`}
              </span>

            </Typography>
          )}
        </AccordionDetails>

        {/* Submit Assignment Button */}
        <Box
          sx={{
            display: "flex",
            padding: "1rem",
            gap: 1,
            justifyContent: "flex-end",
            backgroundColor: "#e3f2fd",
            borderTop: "1px solid #ddd",
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#1976D2",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              transition: "0.3s ease",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
            onClick={() => assignment.submissionstatus === "PENDING" && setOpen(true)}
          >
            {assignment.submissionstatus === "PENDING" ? "Submit Assignment" : "Submitted"}
          </Button>
        </Box>
      </Accordion>

      {/* Upload Assignment Dialog */}
      <FormDialogSubmitAssignment open={open} onClose={() => setOpen(false)} assignmentID={assignment.assignmentid} />
    </div>
  );
}
