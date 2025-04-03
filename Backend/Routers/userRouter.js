const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

router.get("/:userID", userController.getProfile);
router.post("/:userID", userController.updateProfile);

module.exports = router;