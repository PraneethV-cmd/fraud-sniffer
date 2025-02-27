const manageAssignmentsModel = require("../Models/manageAssignments");
const fs = require("fs");

const manageAssignmentsController = {
    get: async (req, res) => {
        try {
            const assignmentID = req.params.assignmentID;
            const response = await manageAssignmentsModel.get(assignmentID);

            if (!response || !response.body) {
                return res.status(404).json({ error: "Assignment not found" });
            }

            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("Error fetching assignment:", err);
            res.status(500).json({ error: "Server error" });
        }
    },

    create: async (req, res) => {
        try {
            const { userID, title, startDate, endDate, description, difficulty } = req.body;

            let fileInfo = {};
            if (req.file) {
                fileInfo = {
                    filename: req.file.filename,
                    originalFilename: req.file.originalname,
                    filePath: req.file.path,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size,
                    isZip: req.file.originalname.endsWith(".zip"),
                };
            }
            const response = await manageAssignmentsModel.create(
                userID,
                title,
                description,
                startDate,
                endDate,
                difficulty,
                fileInfo.filename || null,
                fileInfo.originalFilename || null,
                fileInfo.filePath || null,
                fileInfo.fileType || null,
                fileInfo.fileSize || null,
                fileInfo.isZip || false
            );

            if (!response) {
                return res.status(500).json({ error: "Assignment creation failed" });
            }

            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("Assignment creation error:", err);
            res.status(500).json({ error: "Server error" });
        }
    },

    update: async (req, res) => {
        try {
            const assignmentID = req.params.assignmentID;
            const { startDate, endDate, title, description, difficulty } = req.body;

            const response = await manageAssignmentsModel.update(
                assignmentID,
                title,
                description,
                startDate,
                endDate,
                difficulty
            );

            if (!response) {
                return res.status(500).json({ error: "Update failed" });
            }

            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("Update error:", err);
            res.status(500).json({ error: "Server error" });
        }
    },

    delete: async (req, res) => {
        try {
            const assignmentID = req.params.assignmentID;
            const response = await manageAssignmentsModel.delete(assignmentID);

            if (!response) {
                return res.status(500).json({ error: "Delete failed" });
            }

            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("Delete error:", err);
            res.status(500).json({ error: "Server error" });
        }
    },

    //Not requires as far now.
    
    // filter: async (req, res) => {
    //     try {
    //         const { title, difficulty, status, startDate, endDate } = req.query;
    //         const response = await manageAssignmentsModel.filter(
    //             title,
    //             difficulty,
    //             status,
    //             startDate,
    //             endDate
    //         );

    //         if (!response) {
    //             return res.status(500).json({ error: "Filtering failed" });
    //         }

    //         res.status(response.code).json(response.body.message);
    //     } catch (err) {
    //         console.error("Filtering error:", err);
    //         res.status(500).json({ error: "Server error" });
    //     }
    // },

    view: async (req, res) => {
        try {
            const { userID, type } = req.query;
            if (!userID) {
                return res.status(400).json({ error: "userID is required" });
            }

            const response = await manageAssignmentsModel.view(userID, type);

            if (!response) {
                return res.status(500).json({ error: "View failed" });
            }

            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("View error:", err);
            res.status(500).json({ error: "Server error" });
        }
    },

    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const fileInfo = {
                filename: req.file.filename,
                originalFilename: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                isZip: req.file.originalname.endsWith(".zip"),
            };

            const response = await manageAssignmentsModel.create(fileInfo);

            if (!response || !response.fileId) {
                return res.status(500).json({ error: "File upload failed" });
            }

            res.status(201).json({
                message: "File uploaded successfully",
                fileId: response.fileId,
                ...fileInfo,
            });
        } catch (err) {
            console.error("Upload error:", err);
            res.status(500).json({ error: "File upload error" });
        }
    },

    downloadFile: async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Requested ID:", id);
            const file = await manageAssignmentsModel.get(id);
            if (!file) {
                console.error(`File not found in DB for ID: ${id}`);
                return res.status(404).json({ error: "File not found" });
            }
            console.log("File Retrieved:", file);
            if (!fs.existsSync(file.filePath)) {
                console.error(`File missing on server: ${file.filePath}`);
                return res.status(404).json({ error: "File not found on server" });
            }
            res.download(file.filePath, file.originalFilename);
        } catch (err) {
            console.error("Download error:", err);
            res.status(500).json({ error: "Downloading failed" });
        }
    }
};

module.exports = manageAssignmentsController;

