import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography, MenuItem, List, ListItem, ListItemText, IconButton, FormControl, FormLabel, Tooltip, Link } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import JSZip from "jszip";
import styled from 'styled-components';

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
      <button className="btn">
        <span>
          Submit 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth={0} id="SVGRepo_bgCarrier" /><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" /><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z" /> </g></svg>
        </span>
        <span>
          Sure ?
        </span>
        <span>
          Done ! 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth={0} id="SVGRepo_bgCarrier" /><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" /><g id="SVGRepo_iconCarrier"> <path strokeLinecap="round" strokeWidth={2} stroke="#ffffff" d="M8.00011 13L12.2278 16.3821C12.6557 16.7245 13.2794 16.6586 13.6264 16.2345L22.0001 6" /> <path fill="#ffffff" d="M11.1892 12.2368L15.774 6.63327C16.1237 6.20582 16.0607 5.5758 15.6332 5.22607C15.2058 4.87635 14.5758 4.93935 14.226 5.36679L9.65273 10.9564L11.1892 12.2368ZM8.02292 16.1068L6.48641 14.8263L5.83309 15.6248L2.6 13.2C2.15817 12.8687 1.53137 12.9582 1.2 13.4C0.868627 13.8419 0.95817 14.4687 1.4 14.8L4.63309 17.2248C5.49047 17.8679 6.70234 17.7208 7.381 16.8913L8.02292 16.1068Z" clipRule="evenodd" fillRule="evenodd" /> </g></svg>
        </span>
      </button>
    </Box>
  );
}
