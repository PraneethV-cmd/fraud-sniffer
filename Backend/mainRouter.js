const express  = require("express");
const router = express.Router();

const manageAssignmentRouter = require("./Routers/manageAssignments");
const fileRouter = require("./Routers/fileRouter");
const login = require("./Routers/login");
const register = require("./Routers/register");
const profileController = require("./Controllers/profile");

router.use("/assignment", manageAssignmentRouter);
router.use("/download", fileRouter);
router.use("/login", login);
router.use("/register", register);
router.get("/profile/:userID", profileController.getUserProfile);

module.exports = router;
