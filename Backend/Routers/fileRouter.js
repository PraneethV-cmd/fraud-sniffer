const express = require("express");
const router = express.Router();

const fileController = require("../Controllers/fileController");

router.get("/:filename", fileController);

module.exports = router;