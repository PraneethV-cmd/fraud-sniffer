import React, { useEffect, useState } from "react";
import CreateAssignmentForm from "./CreateAssignmentForm";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccordionUsage from "./accordion";

export default function ColorTabs() {
  const [value, setValue] = useState("View Assignments");
  const [assignmentList, setAssignmentList] = useState([]);
  const [managableAssignments, setManagableAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userID = sessionStorage.getItem("userID");
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=participant`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),

      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=owner`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),
    ])
      .then(([participantData, ownerData]) => {
        console.log("Participant:", participantData);
        console.log("Owner:", ownerData);
        setAssignmentList(participantData.rows);
        setManagableAssignments(ownerData.rows);
      })
      .catch((err) => {
        console.error("Error fetching assignments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = (assignmentID) => {
    alert(`Edit assignment ${assignmentID}`);
    // TODO: Implement edit functionality
  };

  const handleDelete = (assignmentID) => {
    alert(`Delete assignment ${assignmentID}`);
    // TODO: Implement delete functionality
  };

  return (
    <Box sx={{ width: "100%", padding: "20px", paddingLeft: "40px" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tab
          value="View Assignments"
          label="📚 View Assignments"
          sx={{ fontWeight: "bold", color: "#1976D2", textTransform: "none" }}
        />
        <Tab
          value="Manage Assignments"
          label="📔 Manage Assignments"
          sx={{ fontWeight: "bold", color: "#1976D2", textTransform: "none" }}
        />
        <Tab
          value="Create Assignments"
          label="✍️ Create Assignments"
          sx={{ fontWeight: "bold", color: "#1976D2", textTransform: "none" }}
        />
        <Tab
          value="Check Plagiarism"
          label="🔍 Check Plagiarism"
          sx={{ fontWeight: "bold", color: "#1976D2", textTransform: "none" }}
        />
      </Tabs>

      {value === "View Assignments" && (
        <Box sx={{ marginTop: 2, width: "100%" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : assignmentList.length > 0 ? (
            assignmentList.map((assignment) => (
              <Card
                key={`assignments-${assignment.assignmentinfoid}`}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  width: "100%",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976D2" }}>
                    {assignment.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {assignment.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic", marginTop: "8px" }}>
                    Difficulty: {assignment.difficulty} | Status: {assignment.status}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Date: {new Date(assignment.startdate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    End Date: {new Date(assignment.enddate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h6" textAlign="center" mt={4}>
              No assignments found.
            </Typography>
          )}
        </Box>
      )}

      {value === "Manage Assignments" && (
        <Box sx={{ marginTop: 2, width: "100%" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : managableAssignments.length > 0 ? (
            managableAssignments.map((assignment) => (
              <Card
                key={`manage_assignments-${assignment.assignmentid}`}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  width: "100%",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Flexbox container to align content and buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {/* Card Content (Left Side) */}
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976D2" }}>
                      {assignment.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {assignment.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic", marginTop: "8px" }}>
                      Difficulty: {assignment.difficulty} | Status: {assignment.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Start Date: {new Date(assignment.startdate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      End Date: {new Date(assignment.enddate).toLocaleString()}
                    </Typography>
                  </CardContent>

                  {/* Edit & Delete Buttons (Right Side) */}
                  <Box sx={{ display: "flex", gap: 1, paddingRight: 2 }}>
                    <IconButton color="primary" onClick={() => handleEdit(assignment.assignmentid)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(assignment.assignmentid)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))
          ) : (
            <Typography variant="h6" textAlign="center" mt={4}>
              No assignments found.
            </Typography>
          )}
        </Box>
      )}

      
      {value === "Create Assignments" && <CreateAssignmentForm />}
      {value === "Check Plagiarism" && <div>Plagiarism Checker</div>}
    </Box>
  );
}
