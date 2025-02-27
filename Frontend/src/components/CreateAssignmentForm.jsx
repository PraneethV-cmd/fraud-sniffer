import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import JSZip from "jszip";

const difficulties = ["Easy", "Medium", "Hard"];

export default function CreateAssignmentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmCreateAssignment, setConfirmCreateAssignment] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const zipFiles = async () => {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.name, file));
    const blob = await zip.generateAsync({ type: "blob" });
    return new File([blob], "assignment_files.zip", { type: "application/zip" });
  };

  function getStatus(startDate, endDate) {
    const today = new Date();
    if (today < new Date(startDate)) return "NOT STARTED";
    if (today > new Date(endDate)) return "COMPLETED";
    return "ACTIVE";
  }

  const handleSubmit = async () => {
    setConfirmCreateAssignment(false);
    setLoading(true);

    let fileToUpload = files.length > 1 ? await zipFiles() : files.length === 1 ? files[0] : null;
    const formData = new FormData();
    if (fileToUpload) formData.append("assignment", fileToUpload);
    formData.append("otherfields", JSON.stringify({
      userID: 2,
      title,
      description,
      startDate,
      endDate: dueDate,
      difficulty,
      status: getStatus(startDate, dueDate),
    }));

    try {
      const response = await fetch("http://localhost:8080/api/assignment/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setPopupMessage("✅ Assignment uploaded successfully!");
        setFiles([]);
      } else {
        setPopupMessage("❌ Error uploading assignment.");
      }
    } catch (error) {
      setPopupMessage("❌ Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <Box component="form" sx={{ mt: 4, p: 3, maxWidth: 600, mx: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, fontFamily: "Roboto" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Create New Assignment
      </Typography>
      <TextField label="Assignment Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Description" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
      <TextField select label="Difficulty" fullWidth value={difficulty} onChange={(e) => setDifficulty(e.target.value)} sx={{ mb: 2 }}>
        {difficulties.map((level) => (
          <MenuItem key={level} value={level}>{level}</MenuItem>
        ))}
      </TextField>
      <TextField label="Start Date" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Due Date" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} value={dueDate} onChange={(e) => setDueDate(e.target.value)} sx={{ mb: 2 }} />
      
      <TextField type="file" inputProps={{ multiple: true }} fullWidth onChange={handleFileChange} inputRef={fileInputRef} sx={{ mb: 2 }} />
      {files.length > 0 && (
        <Box sx={{ maxHeight: "150px", overflow: "auto", mb: 2 }}>
          {files.map((file, index) => (
            <Typography key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {file.name}
              <Button color="error" size="small" onClick={() => handleFileDelete(index)}>Remove</Button>
            </Typography>
          ))}
        </Box>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={() => setConfirmCreateAssignment(true)} 
        disabled={loading}
        sx={{ mb: 2, py: 1.5, fontSize: "1rem" }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Assignment"}
      </Button>

      <Dialog open={confirmCreateAssignment} onClose={() => setConfirmCreateAssignment(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to submit this assignment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCreateAssignment(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>Submission Status</DialogTitle>
        <DialogContent>
          <Typography>{popupMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPopup(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
