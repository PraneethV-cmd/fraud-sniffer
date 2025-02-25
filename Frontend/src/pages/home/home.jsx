import React from "react";
import "./home.css";
import ColorTabs from "../../components/tabs";
import TemporaryDrawer from "../../components/sidebar";
import Notifications from "../../components/notifications"; // Notifications Component

const Home = () => {
  return (
    <div className="main-container">
      {/* Sidebar for navigation */}
      <div className="sidebar">
        <TemporaryDrawer />
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="container">
            <ColorTabs />
        </div>
      </div>
    </div>
  );
};

export default Home;
