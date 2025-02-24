const express = require("express");
const router = express.Router();
const upload = require("../Middleware/uploadMiddleware");
const manageAssignmentsController = require("../Controllers/manageAssignments");

router.get("/filter", manageAssignmentsController.filter);
router.get("/view", manageAssignmentsController.view);
router.get("/:assignmentID", manageAssignmentsController.get);
router.put("/:assignmentID", manageAssignmentsController.update);
router.delete("/:assignmentID", manageAssignmentsController.delete);

router.post("/create", upload.single("assignment"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded or invalid file type!" });
        }
        
        let parsedBody;
        try {
            parsedBody = JSON.parse(req.body.otherfields);
        } catch (err) {
            return res.status(400).json({ error: "Invalid JSON format in otherfields" });
        }

        // Remove assignmentID from input as it's auto-generated
        const { assignmentId, ...assignmentData } = parsedBody;
        
        // Call the controller create method
        const result = await manageAssignmentsController.create({
            ...req,
            body: assignmentData,
            file: req.file
        }, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/:assignmentID/upload", upload.single("assignment"), manageAssignmentsController.uploadFile);
router.get("/view/:id", manageAssignmentsController.downloadFile);

module.exports = router;


