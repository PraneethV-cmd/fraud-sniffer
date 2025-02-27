const express = require("express");
const router = express.Router();
const upload = require("../Middleware/uploadMiddleware");
const manageAssignmentsController = require("../Controllers/manageAssignments");

//Filter API is not suggestable to create, we should filter records in frontend but not efficient to fetch for every filter call. 
// router.get("/filter", manageAssignmentsController.filter); 

router.get("/view", manageAssignmentsController.view);
router.get("/:assignmentID", manageAssignmentsController.get);
router.put("/:assignmentID", manageAssignmentsController.update);
router.delete("/:assignmentID", manageAssignmentsController.delete);

router.post("/create", upload.single("assignment"), async (req, res) => {
    try {
    
        let parsedBody;
        try {
            parsedBody = JSON.parse(req.body.otherfields);
        } catch (err) {
            return res.status(400).json({ error: "Invalid JSON format in otherfields" });
        }

        
        // Call the controller create method
        await manageAssignmentsController.create({
            ...req,
            body: parsedBody,
            file: req.file
        }, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/:assignmentID/submit", upload.single("assignment"), manageAssignmentsController.submit);
// router.get("/view/:id", manageAssignmentsController.downloadFile); - Created an alternative route download/filename

router.post("/join", manageAssignmentsController.joinAssignment);

module.exports = router;


