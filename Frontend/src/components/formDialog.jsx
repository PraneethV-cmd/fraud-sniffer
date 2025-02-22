import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";

/**
 * FormDialog Component for Editing Assignments
 * @param {Object} props - Contains assignment details and update function
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Function} props.onClose - Function to close dialog
 * @param {Object} props.assignment - Assignment data to be edited
 * @param {Function} props.onSave - Function to save updated assignment
 */
export default function FormDialog({ open, onClose, assignment, onSave }) {
  const [formData, setFormData] = React.useState({
    title: assignment?.title || "",
    description: assignment?.description || "",
    difficulty: assignment?.difficulty || "Medium",
    status: assignment?.status || "Active",
    startdate: assignment?.startdate || "",
    enddate: assignment?.enddate || "",
  });

  // Handles form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = (event) => {
    event.preventDefault();
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
            fullWidth
            margin="dense"
            label="Status"
            name="status"
            select
            value={formData.status}
            onChange={handleChange}
            required
          >
            {["Active", "Completed", "Pending"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Start Date"
            name="startdate"
            type="datetime-local"
            value={formData.startdate}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="dense"
            label="End Date"
            name="enddate"
            type="datetime-local"
            value={formData.enddate}
            onChange={handleChange}
            required
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
