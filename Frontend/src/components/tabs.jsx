import React, { useContext, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AccordionUsage from "./accordionManageAssignments";
import ViewAssignmentsAccordion from "./accordionViewAssignments";
import CreateAssignmentForm from "./CreateAssignmentForm";
import { Context } from "../context/context";

export default function ColorTabs() {
  const {
    value, setValue,
    assignmentList, setAssignmentList,
    managableAssignments, setManagableAssignments,
    loading, setLoading
  } = useContext(Context);

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
        setAssignmentList(participantData);
        setManagableAssignments(ownerData);
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
            assignmentList.map((assignment, index) => (
              <ViewAssignmentsAccordion key={`view_assignments-${assignment.assignmentinfoid}`} index={index} assignment={assignment} />
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
            <>
              {managableAssignments.map((assignment) => (
                <AccordionUsage key={`manage_assignments-${assignment.assignmentid}`} title={assignment.title} description={assignment.description} difficulty={assignment.difficulty} status={assignment.status} startdate={assignment.startdate} enddate={assignment.enddate}/>
              ))}
            </>
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
