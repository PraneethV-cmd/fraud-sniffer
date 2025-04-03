import React, { useContext, useState, useEffect } from "react";
import "./home.css";
import ColorTabs from "../../components/tabs";
import TemporaryDrawer from "../../components/sidebar";
import Notifications from "../../components/notifications";
import Profile from "../../components/profile/UserProfile";
import { Context } from "../../context/context";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const {
    setValue,
    setAssignmentList,
    setManagableAssignments,
    setLoading
  } = useContext(Context);

  useEffect(() => {
    const userID = sessionStorage.getItem("userID");
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=participant`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json" 
        },
      }).then((response) => response.json()),

      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=owner`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),

      fetch(`http://localhost:8080/api/assignment/view?userID=${userID}&type=getSubmissions`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => response.json()),
    ])
      .then(([participantData, ownerData, submissionData]) => {
        console.log("Participant:", participantData);

        // Merge submission details into ownerData
        const ownerDataWithSubmissions = ownerData.map(ownerAssignment => {
        // Find all submissions for this assignment
        const submissions = submissionData.filter(sub => sub.assignmentid === ownerAssignment.assignmentid);
          return { ...ownerAssignment, submissions }; // Add submissions array to assignment
        });

        console.log("Owner Data:", ownerDataWithSubmissions);

        setAssignmentList(participantData);
        setManagableAssignments(ownerDataWithSubmissions);
      })
      .catch((err) => {
        console.error("Error fetching assignments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(()=> {
    if(activeTab == "Plagiarism Check"){
      setValue("Check Plagiarism");
    }else if(activeTab == "Home"){
      setValue("View Assignments");
    }else if(activeTab == "Assignments"){
      setValue("Manage Assignments");
    }
  }, [activeTab]);
  
  // Function to handle menu item clicks
  const handleMenuClick = (menuItem) => {
    setActiveTab(menuItem);
  };

  return (
    <div className="main-container">
      {/* Sidebar for navigation */}
      <div className="sidebar">
        <TemporaryDrawer onMenuClick={handleMenuClick} />
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="container">
          {activeTab === "Home" && <ColorTabs />}  
          {activeTab === "Assignments" && <ColorTabs />}  
          {activeTab === "Plagiarism Check" && <ColorTabs />}  
          {activeTab === "Notifications" && <Notifications />} 
          {activeTab === "Profile" && <Profile />}  
        </div>
      </div>
    </div>
  );
};

export default Home;
