const express  = require("express");
const router = express.Router();

const manageAssignmentRouter = require("./Routers/manageAssignments");
const fileRouter = require("./Routers/fileRouter");

router.use("/assignment", manageAssignmentRouter);
router.use("/download", fileRouter);


module.exports = router;
