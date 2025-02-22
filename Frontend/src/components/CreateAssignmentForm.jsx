import React, { useState, useRef } from "react";
import { Box, Button, TextField, Typography, MenuItem, List, ListItem, ListItemText, IconButton, FormControl, FormLabel, Tooltip, Link } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const difficulties = ["Easy", "Medium", "Hard"]; // Difficulty levels

export default function CreateAssignmentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ title, description, startDate, dueDate, difficulty, files });
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    // Reset the file input value to ensure it updates correctly
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    // Reset the file input value to ensure it updates correctly
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
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