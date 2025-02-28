import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";

/**
 * FormDialog Component for Editing Assignments
 * @param {Object} props - Contains assignment details and update function
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Function} props.onClose - Function to close dialog
 * @param {Object} props.assignment - Assignment data to be edited
 * @param {Function} props.onSave - Function to save updated assignment
 */
export function FormDialogEditAssignment({ open, onClose, assignment, onSave }) {
  const formatDate = (isoString) => {
    if (!isoString) return ""; // Handle empty values

    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    const hours = String(date.getHours()).padStart(2, "0"); // Convert to 24-hour format
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure 2 digits

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  const [formData, setFormData] = React.useState({
    title: assignment?.title || "",
    description: assignment?.description || "",
    difficulty: assignment?.difficulty || "Medium",
    startDate: formatDate(assignment?.startdate),
    endDate: formatDate(assignment?.enddate),
  });


  // Handles form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      fetch(`http://localhost:8080/api/assignment/${assignment.assignmentid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Assignment updated successfully", data);
      })
      .catch((error) => {
        console.error("Error updating assignment:", error);
      });



    } catch (error) {
      
    }
    onSave(formData); // Calls the onSave function with updated data
    onClose(); // Closes the dialog
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Assignment</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />

          <TextField
            fullWidth
            margin="dense"
            label="Difficulty"
            name="difficulty"
            select
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            {["Easy", "Medium", "Hard"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="dense"
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
            required
            style={{padding:"0.05rem"}}
          />

          <TextField
            margin="dense"
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange}
            required
            style={{padding:"0.05rem"}}
          />

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function FormDialogSubmitAssignment({ open, onClose, assignmentID }) {
  const [file, setFile] = React.useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const userID = sessionStorage.getItem("userID");
    const formData = new FormData();
    formData.append("otherfields", JSON.stringify({
      "userID" : userID
    }));
    formData.append("assignment", file);

    try {
      const response = await fetch(`http://localhost:8080/api/assignment/${assignmentID}/submit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Assignment submitted successfully!");
        onClose();
      } else {
        alert("Failed to submit assignment.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submit Assignment</DialogTitle>
      <DialogContent>
        <Input type="file" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
