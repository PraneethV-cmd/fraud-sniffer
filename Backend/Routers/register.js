const express = require('express');
const router = express.Router();

const register = require("../Controllers/register");

router.post("/", register);

module.exports = router;