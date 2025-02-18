const express  = require("express");
const router = express.Router();

const manageAssignmentRouter = require("./Routers/manageAssignments");

router.use("/assignment", manageAssignmentRouter);

module.exports = router;