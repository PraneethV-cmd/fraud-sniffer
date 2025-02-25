import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography, MenuItem, List, ListItem, ListItemText, IconButton, FormControl, FormLabel, Tooltip, Link } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import JSZip from "jszip";

const difficulties = ["Easy", "Medium", "Hard"]; // Difficulty levels

export default function CreateAssignmentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const zipFiles = async () => {
    const zip = new JSZip();

    // Add each file to the zip archive
    files.forEach((file) => {
      zip.file(file.name, file);
    });

    // Generate the zip file as a Blob
    const blob = await zip.generateAsync({ type: "blob" });

    // Convert Blob to File object
    const zipFile = new File([blob], "assignment_files.zip", { type: "application/zip" });

    return zipFile;
  };

  function getStatus(startDate, endDate){
    const today = new Date();
    if(today < startDate) return "NOT STARTED";
    if(today > endDate) return "COMPLETED";
    return "ACTIVE";
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    let fileToUpload;
    if (files.length > 1) {
        fileToUpload = await zipFiles(); // Zip all files
    } else if(files.length == 1) {
        fileToUpload = files[0]; // Single file upload
    }

    // Create FormData object
    const formData = new FormData();
    if(files.length >= 1) formData.append("assignment", fileToUpload); // File
    formData.append("otherfields", JSON.stringify({
        userID: 2,
        title: title,
        description: description,
        startDate: startDate,
        endDate: dueDate,
        difficulty: difficulty,
        status: getStatus(startDate, dueDate)
    })); // Convert object to JSON string

    try {
        const response = await fetch("http://localhost:8080/api/assignment/create", {
            method: "POST",
            body: formData, // FormData instead of raw JSON
        });

        if (response.ok) {
            alert("Assignment uploaded successfully!");
            setFiles([]);
        } else {
            alert("Error uploading assignment");
        }
    } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, maxHeight: '80vh', overflow: 'auto' }} className="create-assignment-page">
      <Typography variant="h6" gutterBottom>
        Create New Assignment
      </Typography>
      <TextField
        label="Assignment Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Difficulty"
        fullWidth
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        sx={{ mb: 2 }}
      >
        {difficulties.map((level) => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </TextField>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Assignment Files</FormLabel>
        <TextField
          type="file"
          inputProps={{ multiple: true }}
          onChange={handleFileChange}
          inputRef={fileInputRef}
        />
      </FormControl>
      <Box sx={{ maxHeight: '200px', overflow: 'auto', mb: 2 }}>
        <List>
          {files.map((file, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(index)}>
                <DeleteIcon />
              </IconButton>
            }>
              <Tooltip title={URL.createObjectURL(file)} arrow>
                <Link href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                  <ListItemText primary={file.name} />
                </Link>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
      <TextField
        label="Start Date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Due Date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
