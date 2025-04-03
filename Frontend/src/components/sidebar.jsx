"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faHome,
  faTasks,
  faClipboardCheck,
  faBell,
  faUser,
  faSignOutAlt,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { Typography, Avatar, Divider, Tooltip } from "@mui/material"

const menuItems = [
  { text: "Home", icon: faHome, color: "#4caf50" },
  { text: "Assignments", icon: faTasks, color: "#2196f3" },
  { text: "Plagiarism Check", icon: faClipboardCheck, color: "#ff9800" },
  { text: "Notifications", icon: faBell, color: "#e91e63" },
  { text: "Profile", icon: faUser, color: "#9c27b0" },
  { text: "Logout", icon: faSignOutAlt, color: "#f44336" },
]

export default function CustomDrawer({ onMenuClick }) {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("Home")
  const [userName, setUserName] = useState("Student")
  const navigate = useNavigate()

  // Get user name from session storage if available
  useEffect(() => {
    const storedName = sessionStorage.getItem("userName")
    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const handleMenuClick = (text) => {
    setActiveItem(text)

    if (text === "Logout") {
      sessionStorage.clear()
      navigate("/login")
    }
    onMenuClick(text)
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Custom styles
  const styles = {
    menuButton: {
      color: "#fff",
      fontSize: "24px",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.1)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      minWidth: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    drawerPaper: {
      width: 280,
      background: "linear-gradient(135deg, rgba(30, 30, 45, 0.95) 0%, rgba(42, 42, 70, 0.95) 100%)",
      backdropFilter: "blur(10px)",
      height: "100vh",
      color: "#fff",
      boxShadow: "2px 0 15px rgba(0,0,0,0.3)",
      overflowX: "hidden",
    },
    header: {
      padding: "24px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      marginBottom: "10px",
      background: "rgba(0,0,0,0.2)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      position: "relative",
      overflow: "hidden",
    },
    headerBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundImage:
        'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fillOpacity="0.4" fillRule="evenodd"/%3E%3C/svg%3E\')',
      backgroundSize: "cover",
      zIndex: -1,
    },
    avatar: {
      width: 70,
      height: 70,
      backgroundColor: "#5e35b1",
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      border: "3px solid rgba(255,255,255,0.2)",
    },
    userName: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      marginBottom: "4px",
      letterSpacing: "0.5px",
    },
    userRole: {
      fontSize: "0.85rem",
      opacity: 0.7,
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    menuList: {
      padding: "10px 15px",
    },
    menuItem: (isActive, color) => ({
      margin: "8px 0",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.3s ease",
      position: "relative",
      backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
      "&:before": isActive
        ? {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            backgroundColor: color,
            borderRadius: "0 4px 4px 0",
          }
        : {},
    }),
    menuButton: (isActive, color) => ({
      color: "#fff",
      padding: "12px 20px",
      transition: "all 0.2s ease",
      borderRadius: "12px",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
        transform: "translateX(5px)",
      },
    }),
    menuIcon: (color) => ({
      marginRight: 15,
      width: "20px",
      color: color,
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
    }),
    menuText: {
      fontWeight: 500,
      letterSpacing: "0.5px",
    },
    footer: {
      padding: "15px 20px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      position: "absolute",
      bottom: 0,
      width: "100%",
      textAlign: "center",
      fontSize: "0.8rem",
      color: "rgba(255,255,255,0.5)",
    },
    divider: {
      backgroundColor: "rgba(255,255,255,0.1)",
      margin: "10px 0",
    },
    sectionTitle: {
      fontSize: "0.75rem",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: "1px",
      padding: "0 20px",
      marginTop: "15px",
      marginBottom: "5px",
    },
  }

  const DrawerList = (
    <Box sx={styles.drawerPaper} role="presentation">
      {/* Header with user info */}
      <Box sx={styles.header}>
        <Box sx={styles.headerBackground} />
        <Avatar sx={styles.avatar}>{getInitials(userName)}</Avatar>
        <Typography sx={styles.userName}>{userName}</Typography>
        <Typography sx={styles.userRole}>Student</Typography>
      </Box>

      {/* Menu items */}
      <Typography sx={styles.sectionTitle}>Main Navigation</Typography>

      <List sx={styles.menuList}>
        {menuItems.slice(0, 3).map(({ text, icon, color }) => (
          <Tooltip title={text} placement="right" key={text}>
            <ListItem
              disablePadding
              sx={styles.menuItem(activeItem === text, color)}
              onClick={() => {
                handleMenuClick(text)
                toggleDrawer(false)()
              }}
            >
              <ListItemButton sx={styles.menuButton(activeItem === text, color)}>
                <FontAwesomeIcon icon={icon} style={styles.menuIcon(color)} />
                <ListItemText primary={text} primaryTypographyProps={{ sx: styles.menuText }} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider sx={styles.divider} />
      <Typography sx={styles.sectionTitle}>User</Typography>

      <List sx={styles.menuList}>
        {menuItems.slice(3).map(({ text, icon, color }) => (
          <Tooltip title={text} placement="right" key={text}>
            <ListItem
              disablePadding
              sx={styles.menuItem(activeItem === text, color)}
              onClick={() => {
                handleMenuClick(text)
                toggleDrawer(false)()
              }}
            >
              <ListItemButton sx={styles.menuButton(activeItem === text, color)}>
                <FontAwesomeIcon icon={icon} style={styles.menuIcon(color)} />
                <ListItemText primary={text} primaryTypographyProps={{ sx: styles.menuText }} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Footer */}
      <Box sx={styles.footer}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
          <FontAwesomeIcon icon={faGraduationCap} />
          <Typography variant="body2" fontWeight="bold">
            Classroom Manager
          </Typography>
        </Box>
        <Typography variant="caption">© {new Date().getFullYear()} All Rights Reserved</Typography>
      </Box>
    </Box>
  )

  return (
    <div>
      <Button onClick={toggleDrawer(true)} sx={styles.menuButton} aria-label="Open menu">
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: styles.drawerPaper,
        }}
        transitionDuration={{ enter: 400, exit: 300 }}
        SlideProps={{
          easing: {
            enter: "cubic-bezier(0.2, 1, 0.3, 1)",
            exit: "cubic-bezier(0.2, 1, 0.3, 1)",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  )
}

