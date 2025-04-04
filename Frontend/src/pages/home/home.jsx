import React, { useContext, useState, useEffect } from "react";
import "./home.css";
import ColorTabs from "../../components/tabs";
import TemporaryDrawer from "../../components/sidebar";
import Notifications from "../../components/notifications";
import Profile from "../../components/profile/UserProfile";
import { Context } from "../../context/context";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const {
    setValue,
    setAssignmentList,
    setManagableAssignments,
    setLoading,
    setUserData
  } = useContext(Context);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userID = sessionStorage.getItem("userID");
    if(userID === null) navigate("/login")
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

    fetch(`http://localhost:8080/api/user/${userID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then((response) => response.json())
    .then((data) => {
      setUserData(data);
    })
  }, []);

  useEffect(() => {
    if (activeTab == "Plagiarism Check") {
      setValue("Check Plagiarism");
    } else if (activeTab == "Home") {
      setValue("View Assignments");
    } else if (activeTab == "Assignments") {
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

      <style jsx>{`
        .main-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(180deg, #f0f4f8 0%, #d9e2ec 100%);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease-in-out;
        }

        .main-container:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
        }

        .sidebar {
          position: relative;
          padding: 15px;
          background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%); /* Vibrant purple gradient */
          border-radius: 12px;
          backdrop-filter: blur(10px); /* Retains the frosted glass effect */
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2); /* Slightly stronger shadow for depth */
          border: 1px solid rgba(255, 255, 255, 0.5); /* Brighter border for contrast */
          transition: all 0.3s ease;
        }

        @keyframes glow {
          0% { box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 6px 25px rgba(142, 45, 226, 0.5); } /* Purple glow */
          100% { box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2); }
        }

        .sidebar:hover {
          background:linear-gradient(135deg, #5b0fff 0%, #9b3fff 100%);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          transform: scale(1.02);
        }

        /* Optional: Add a subtle animation */
        @keyframes slideIn {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .sidebar {
          animation: glow 2s infinite ease-in-out; /* Continuous subtle glow effect */
        }
      `}</style>
    </div>
  );
};

export default Home;