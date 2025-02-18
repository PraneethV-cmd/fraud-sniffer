const express = require("express");
const router = express.Router();

const manageAssignmentsController = require("../Controllers/manageAssignments");

router.get("/filter", manageAssignmentsController.filter);

router.get("/:assignmentID", manageAssignmentsController.get);
router.put("/", manageAssignmentsController.create);
router.post("/:assignmentID", manageAssignmentsController.update);
router.delete("/:assignmentID", manageAssignmentsController.delete);


module.exports = router;