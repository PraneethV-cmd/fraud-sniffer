import React, { useState, useEffect } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from API (Replace with actual backend API)
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className="notifications">
      <h3>📢 New Assignment Notifications</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((note, index) => <li key={index}>{note.message}</li>)
        ) : (
          <p>No new notifications.</p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
