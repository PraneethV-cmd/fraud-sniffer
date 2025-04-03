"use client"

import { useState, useRef, useContext } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Paper,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  Zoom,
  alpha,
} from "@mui/material"
import JSZip from "jszip"
import { Context } from "../context/context"
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Title as TitleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material"

const difficulties = [
  { value: "Easy", color: "#4caf50" },
  { value: "Medium", color: "#ff9800" },
  { value: "Hard", color: "#f44336" },
]

export default function CreateAssignmentForm() {
  const { setManagableAssignments } = useContext(Context)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [confirmCreateAssignment, setConfirmCreateAssignment] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files)
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const zipFiles = async () => {
    const zip = new JSZip()
    files.forEach((file) => zip.file(file.name, file))
    const blob = await zip.generateAsync({ type: "blob" })
    return new File([blob], "assignment_files.zip", { type: "application/zip" })
  }

  function getStatus(startDate, endDate) {
    const today = new Date()
    if (today < new Date(startDate)) return "NOT STARTED"
    if (today > new Date(endDate)) return "COMPLETED"
    return "ACTIVE"
  }

  const handleSubmit = async () => {
    setConfirmCreateAssignment(false)
    setLoading(true)

    const userID = sessionStorage.getItem("userID")

    const fileToUpload = files.length > 1 ? await zipFiles() : files.length === 1 ? files[0] : null
    const formData = new FormData()
    if (fileToUpload) formData.append("assignment", fileToUpload)
    formData.append(
      "otherfields",
      JSON.stringify({
        userID: userID,
        title,
        description,
        startDate,
        endDate: dueDate,
        difficulty,
        status: getStatus(startDate, dueDate),
      }),
    )

    try {
      const response = await fetch("http://localhost:8080/api/assignment/create", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newAssignment = await response.json()
        console.log("New Assignment:", newAssignment)
        setManagableAssignments(newAssignment)
        setPopupMessage("Assignment uploaded successfully!")
        resetForm()
      } else {
        setPopupMessage("Error uploading assignment.")
      }
    } catch (error) {
      setPopupMessage("Upload failed. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setLoading(false)
      setShowPopup(true)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStartDate("")
    setDueDate("")
    setDifficulty("")
    setFiles([])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  const getDifficultyColor = (level) => {
    const found = difficulties.find((d) => d.value === level)
    return found ? found.color : "#757575"
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "xls":
      case "xlsx":
        return "📊"
      case "ppt":
      case "pptx":
        return "📑"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️"
      case "zip":
      case "rar":
        return "🗜️"
      default:
        return "📁"
    }
  }

  const isFormValid = title && description && startDate && dueDate && difficulty

  // Custom styles
  const styles = {
    formContainer: {
      mt: 4,
      p: 4,
      maxWidth: 700,
      mx: "auto",
      borderRadius: 3,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: "1px solid rgba(230, 230, 230, 0.5)",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
      },
    },
    formTitle: {
      fontWeight: 700,
      color: "#5e35b1",
      mb: 3,
      position: "relative",
      display: "inline-block",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: -8,
        left: 0,
        width: "60px",
        height: "4px",
        background: "linear-gradient(90deg, #5e35b1, #3949ab)",
        borderRadius: "10px",
      },
    },
    inputField: {
      mb: 3,
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        "& fieldset": {
          borderColor: "rgba(94, 53, 177, 0.2)",
          borderWidth: "2px",
          transition: "border-color 0.3s ease",
        },
        "&:hover fieldset": {
          borderColor: "rgba(94, 53, 177, 0.5)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#5e35b1",
        },
      },
      "& .MuiInputLabel-root": {
        color: "rgba(94, 53, 177, 0.7)",
        "&.Mui-focused": {
          color: "#5e35b1",
        },
      },
      "& .MuiInputAdornment-root": {
        color: "rgba(94, 53, 177, 0.7)",
      },
    },
    dateField: {
      mb: 3,
      width: "48%",
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        "& fieldset": {
          borderColor: "rgba(94, 53, 177, 0.2)",
          borderWidth: "2px",
        },
        "&:hover fieldset": {
          borderColor: "rgba(94, 53, 177, 0.5)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#5e35b1",
        },
      },
      "& .MuiInputLabel-root": {
        color: "rgba(94, 53, 177, 0.7)",
        "&.Mui-focused": {
          color: "#5e35b1",
        },
      },
    },
    dropArea: (isDragActive) => ({
      border: `2px dashed ${isDragActive ? "#5e35b1" : "rgba(94, 53, 177, 0.3)"}`,
      borderRadius: "16px",
      padding: "30px 20px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: isDragActive ? "rgba(94, 53, 177, 0.05)" : "transparent",
      mb: 3,
      "&:hover": {
        backgroundColor: "rgba(94, 53, 177, 0.05)",
        borderColor: "rgba(94, 53, 177, 0.5)",
      },
    }),
    uploadIcon: {
      fontSize: "48px",
      color: "#5e35b1",
      mb: 1,
      opacity: 0.8,
    },
    fileList: {
      maxHeight: "200px",
      overflow: "auto",
      mb: 3,
      padding: "10px",
      borderRadius: "12px",
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      border: "1px solid rgba(0, 0, 0, 0.05)",
    },
    fileItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 12px",
      borderRadius: "8px",
      mb: 1,
      backgroundColor: "white",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateX(5px)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
    fileIcon: {
      marginRight: "10px",
      fontSize: "1.5rem",
    },
    fileName: {
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: "0.9rem",
    },
    deleteButton: {
      color: "#f44336",
      padding: "4px",
      "&:hover": {
        backgroundColor: "rgba(244, 67, 54, 0.1)",
      },
    },
    submitButton: {
      py: 1.5,
      px: 4,
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "12px",
      background: "linear-gradient(45deg, #5e35b1, #3949ab)",
      boxShadow: "0 4px 12px rgba(94, 53, 177, 0.3)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(45deg, #4527a0, #303f9f)",
        boxShadow: "0 6px 16px rgba(94, 53, 177, 0.4)",
        transform: "translateY(-2px)",
      },
      "&:active": {
        transform: "translateY(1px)",
        boxShadow: "0 2px 8px rgba(94, 53, 177, 0.4)",
      },
      "&.Mui-disabled": {
        background: "linear-gradient(45deg, #9e9e9e, #757575)",
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    dialogPaper: {
      borderRadius: "16px",
      padding: "10px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    },
    dialogTitle: {
      color: "#5e35b1",
      fontWeight: "bold",
      textAlign: "center",
      borderBottom: "2px solid rgba(94, 53, 177, 0.1)",
      paddingBottom: "10px",
    },
    dialogContent: {
      padding: "20px 24px",
    },
    dialogActions: {
      padding: "16px 24px",
      justifyContent: "center",
    },
    cancelButton: {
      color: "#f44336",
      borderColor: "rgba(244, 67, 54, 0.5)",
      borderRadius: "10px",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "rgba(244, 67, 54, 0.05)",
        borderColor: "#f44336",
      },
    },
    confirmButton: {
      backgroundColor: "#5e35b1",
      borderRadius: "10px",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#4527a0",
      },
    },
    successIcon: {
      backgroundColor: "#4caf50",
      color: "white",
      borderRadius: "50%",
      padding: "8px",
      fontSize: "2rem",
      marginBottom: "16px",
    },
    errorIcon: {
      backgroundColor: "#f44336",
      color: "white",
      borderRadius: "50%",
      padding: "8px",
      fontSize: "2rem",
      marginBottom: "16px",
    },
    decorativeElement: {
      position: "absolute",
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      background: "linear-gradient(45deg, rgba(94, 53, 177, 0.05), rgba(57, 73, 171, 0.05))",
      filter: "blur(40px)",
      zIndex: "0",
    },
  }

  return (
    <Paper elevation={3} sx={styles.formContainer}>
      {/* Decorative elements */}
      <Box sx={{ ...styles.decorativeElement, top: "-100px", right: "-50px" }}></Box>
      <Box sx={{ ...styles.decorativeElement, bottom: "-80px", left: "-60px" }}></Box>

      <Typography variant="h5" sx={styles.formTitle}>
        Create New Assignment
      </Typography>

      <Box component="form" sx={{ position: "relative", zIndex: 1 }}>
        <TextField
          label="Assignment Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={styles.inputField}
          InputProps={{
            startAdornment: <TitleIcon sx={{ mr: 1, color: "rgba(94, 53, 177, 0.7)" }} />,
          }}
          placeholder="Enter a descriptive title"
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={styles.inputField}
          InputProps={{
            startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: "rgba(94, 53, 177, 0.7)" }} />,
          }}
          placeholder="Provide detailed instructions for students"
        />

        <TextField
          select
          label="Difficulty"
          fullWidth
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          sx={styles.inputField}
          InputProps={{
            startAdornment: <FlagIcon sx={{ mr: 1, color: "rgba(94, 53, 177, 0.7)" }} />,
          }}
        >
          {difficulties.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: level.color,
                    mr: 1,
                    boxShadow: `0 0 0 2px ${alpha(level.color, 0.2)}`,
                  }}
                />
                {level.value}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Start Date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={styles.dateField}
            InputProps={{
              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "rgba(94, 53, 177, 0.7)" }} />,
            }}
          />

          <TextField
            label="Due Date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            sx={styles.dateField}
            InputProps={{
              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "rgba(94, 53, 177, 0.7)" }} />,
            }}
          />
        </Box>

        <Box
          sx={styles.dropArea(dragActive)}
          onClick={() => fileInputRef.current.click()}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
          <CloudUploadIcon sx={styles.uploadIcon} />
          <Typography variant="h6" sx={{ mb: 1, color: "#5e35b1", fontWeight: 600 }}>
            Upload Files
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Drag and drop files here or click to browse
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.disabled" }}>
            Supports multiple files
          </Typography>
        </Box>

        {files.length > 0 && (
          <Box sx={styles.fileList}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: "#5e35b1", fontWeight: 600 }}>
              <AttachFileIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 0.5 }} />
              Attached Files ({files.length})
            </Typography>

            {files.map((file, index) => (
              <Box key={index} sx={styles.fileItem}>
                <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                  <Typography sx={styles.fileIcon}>{getFileIcon(file.name)}</Typography>
                  <Typography sx={styles.fileName}>{file.name}</Typography>
                </Box>
                <Tooltip title="Remove file" arrow TransitionComponent={Zoom}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileDelete(index)
                    }}
                    sx={styles.deleteButton}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 3, borderColor: "rgba(94, 53, 177, 0.1)" }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmCreateAssignment(true)}
            disabled={loading || !isFormValid}
            sx={styles.submitButton}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Creating..." : "Create Assignment"}
          </Button>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmCreateAssignment}
        onClose={() => setConfirmCreateAssignment(false)}
        PaperProps={{ sx: styles.dialogPaper }}
      >
        <DialogTitle sx={styles.dialogTitle}>Confirm Assignment Creation</DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to create this assignment?
          </Typography>

          <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)", p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#5e35b1" }}>
              {title}
            </Typography>

            {difficulty && (
              <Chip
                label={difficulty}
                size="small"
                sx={{
                  mt: 1,
                  backgroundColor: alpha(getDifficultyColor(difficulty), 0.1),
                  color: getDifficultyColor(difficulty),
                  fontWeight: "bold",
                }}
              />
            )}

            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {files.length} file(s) attached
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={() => setConfirmCreateAssignment(false)} variant="outlined" sx={styles.cancelButton}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={styles.confirmButton}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={showPopup} onClose={() => setShowPopup(false)} PaperProps={{ sx: styles.dialogPaper }}>
        <DialogTitle sx={styles.dialogTitle}>Assignment Status</DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
            {popupMessage.includes("success") ? (
              <CheckIcon sx={styles.successIcon} />
            ) : (
              <CloseIcon sx={styles.errorIcon} />
            )}
            <Typography variant="body1" align="center">
              {popupMessage}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={() => setShowPopup(false)} variant="contained" sx={styles.confirmButton}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

