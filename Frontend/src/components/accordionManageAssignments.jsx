import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FormDialogEditAssignment } from "./formDialog";

export default function AccordionUsage({ assignment, index, onDelete }) {
  const {
    title,
    description,
    difficulty,
    status,
    startdate,
    enddate,
    assignmentid,
    filepath,
    filename,
    originalfilename,
    join_code,
    submissions = [],
  } = assignment;

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false); // State for submission popup
  const [assignmentData, setAssignmentData] = useState({
    assignmentid,
    title,
    description,
    difficulty,
    status,
    startdate,
    enddate,
    join_code,
  });

  const handleViewSubmissions = () => {
    setSubmissionDialogOpen(true);
  };

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
    console.log("Assignment Data: ", assignmentData);
    fetch(`http://localhost:8080/api/assignment/${assignmentData.assignmentid}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete assignment");
        console.log("Assignment deleted successfully!");
        onDelete(assignment.assignmentid);
      })
      .catch((error) => console.error("Error deleting assignment:", error));

    setDeleteDialogOpen(false);
  };

  // Copy Join Code to clipboard
  const handleCopyjoin_code = () => {
    navigator.clipboard.writeText(assignmentData.join_code);
    alert("Join Code copied: " + assignmentData.join_code);
  };

  return (
    <div>
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ flexGrow: 1, fontSize: "1.2rem", fontWeight: 600 }}>
            {assignmentData.title}
          </Typography>
          <Typography>
            🔑 Join Code: <b>{assignmentData.join_code}</b>
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleCopyjoin_code}
            sx={{ minWidth: "40px", marginLeft: "10px" }}
          >
            <ContentCopyIcon fontSize="small" />
          </Button>
        </AccordionSummary>

        <AccordionDetails>
          <Typography variant="body1">
            <b>Description:</b> {assignmentData.description}
          </Typography>
          <Typography variant="body1">
            <b>Difficulty:</b> {assignmentData.difficulty}
          </Typography>
          <Typography variant="body1">
            <b>Status:</b> {assignmentData.status}
          </Typography>
          <Typography variant="body1">
            <b>Start Date:</b> {new Date(assignmentData.startdate).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <b>End Date:</b> {new Date(assignmentData.enddate).toLocaleString()}
          </Typography>

          {filepath && filename !== "no_file" && (
            <Typography>
              📄 Resource:{" "}
              <a href={`http://localhost:8080/api/download/${filename}?path=root`} target="_blank" rel="noopener noreferrer">
                {originalfilename || "Download File"}
              </a>
            </Typography>
          )}
        </AccordionDetails>

        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "1rem", gap: 1 }}>
          <Button variant="contained" size="small" color="secondary" onClick={handleViewSubmissions}>
            👁️ View Submissions
          </Button>
          <Button variant="contained" size="small" color="primary" onClick={handleEdit}>
            ✏️ Edit
          </Button>
          <Button variant="contained" size="small" color="error" onClick={handleDeleteClick} >
            ❌ Delete
          </Button>
        </Box>
      </Accordion>

      {/* Submission Details Popup */}
      <Dialog open={submissionDialogOpen} onClose={() => setSubmissionDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Submission Details</DialogTitle>
        <DialogContent>
          {submissions.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Participant ID</b></TableCell>
                    <TableCell><b>Participant Name</b></TableCell>
                    <TableCell><b>Submission Date</b></TableCell>
                    <TableCell><b>File</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.submissionid}>
                      <TableCell>{submission.participantid}</TableCell>
                      <TableCell>{submission.participantname}</TableCell>
                      <TableCell>
                        {submission.submissiondate
                          ? new Date(submission.submissiondate).toLocaleString()
                          : "Not Submitted"}
                      </TableCell>
                      <TableCell>
                        {submission.submissionfilename !== "no_file" ? (
                          <a
                            href={`http://localhost:8080/api/download/${submission.submissionfilename}?path=${assignmentData.assignmentid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {submission.submissionoriginalfilename}
                          </a>
                        ) : (
                          "No File"
                        )}
                      </TableCell>
                      <TableCell>{submission.submissionstatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No submissions found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmissionDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
