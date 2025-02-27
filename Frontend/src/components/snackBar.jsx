import React from "react";
import Snackbar from "@mui/material/Snackbar";

export default function AutohideSnackbar({ message, open, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      message={message}
    />
  );
}
