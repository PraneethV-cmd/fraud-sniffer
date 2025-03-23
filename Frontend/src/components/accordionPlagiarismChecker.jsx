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

export default function AccordionPlagiarismChecker({ assignment, index }) {
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

  const handleCheckPlagiarism = async () => {
    const submittedFile = submissions.filter(submission => submission.submissionfilename !== "no_file");

    if (submittedFile.length <= 0) {
      alert("No submissions found for this assignment!");
      return;
    } else if (submittedFile.length === 1) {
      alert("Only one submission found. Plagiarism check requires at least 2 submissions!");
      return;
    }

    console.log("Checking Plagiarism for assignment: ", assignmentData.assignmentid);

    // Open result page in a new tab
    const plagiarismUrl = `http://127.0.0.1:5000/?uploadFolder=../Backend/uploads/${assignmentData.assignmentid}`;
    window.open(plagiarismUrl, "_blank");

    try {
      const response = await fetch(plagiarismUrl, {
        headers: { "Accept": "application/json" },
      });
      const resultData = await response.json();
      
      if (response.ok) {
        console.log("Plagiarism Results:", resultData);
        
        // Send plagiarism results to backend to store in DB
        // await fetch("http://127.0.0.1:5000/update_plagiarism", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     assignment_id: assignmentData.assignmentid,
        //     plagiarism_results: resultData.results,
        //   }),
        // });

        // Update state to show plagiarism scores in table
        setAssignmentData(prevData => {
          const similarityMap = {};

          // Compute similarity scores for each file
          resultData.internal_similarities.forEach(({ file1, file2, similarity }) => {
            if (!similarityMap[file1]) similarityMap[file1] = [];
            if (!similarityMap[file2]) similarityMap[file2] = [];

            similarityMap[file1].push(similarity);
            similarityMap[file2].push(similarity);
          });

          // Calculate average similarity per file
          const averageSimilarityScores = Object.fromEntries(
            Object.entries(similarityMap).map(([filename, scores]) => [
              filename,
              scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
            ])
          );

          return {
            ...prevData,
            plagiarism_results: resultData.results.map(res => ({
              filename: res.filename,
              ai_score: (res.ai_score * 100).toFixed(2),  // Convert to percentage
              similarity_scores: res.plagiarism_results,
              average_similarity: (averageSimilarityScores[res.filename] * 100 || 0).toFixed(2) // Ensure valid percentage
            })),
          };
        });


      } else {
        alert("Error fetching plagiarism results!");
      }
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      alert("Failed to fetch plagiarism data.");
    }
  };

  return (
    <div>
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ flexGrow: 1, fontSize: "1.2rem", fontWeight: 600 }}>
            {assignmentData.title}
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleCheckPlagiarism}
            sx={{ minWidth: "40px", marginLeft: "10px" }}
          >
            ▶️ Run Plagiarism
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
                    <TableCell><b>AI Plagiarism Score</b></TableCell>
                    <TableCell><b>Plagiarism Score</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => {
                    const plagiarismData = assignmentData.plagiarism_results?.find(res => res.filename === submission.submissionfilename);
                    return (
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
                        <TableCell>
                          {plagiarismData ? `${plagiarismData.ai_score}%` : "Pending"}
                        </TableCell>

                        <TableCell>
                          {plagiarismData ? `${plagiarismData.average_similarity}%` : "Pending"}
                        </TableCell>
                        <TableCell>{submission.submissionstatus}</TableCell>
                      </TableRow>
                    );
                  })}
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

    </div>
  );
}
