import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faTasks, faClipboardCheck, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { text: "Home", icon: faHome },
  { text: "Assignments", icon: faTasks },
  { text: "Plagiarism Check", icon: faClipboardCheck },
  { text: "Notifications", icon: faBell },
  { text: "Profile", icon: faUser }
];

export default function CustomDrawer() {
  const [open, setOpen] = useState(false);
  
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 260,
        background: "rgba(30, 30, 45, 0.7)",
        backdropFilter: "blur(10px)",
        height: "100vh",
        color: "#fff",
        paddingTop: "20px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.2)"
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{
                color: "#fff",
                '&:hover': { backgroundColor: "#2a2a3d" },
                padding: "12px 20px"
              }}
            >
              <FontAwesomeIcon icon={icon} style={{ marginRight: 15 }} />
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} sx={{ color: "#fff", fontSize: "20px" }}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}