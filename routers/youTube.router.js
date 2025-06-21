const express = require("express");
const YouTubeController = require("../controllers/youTube.controllers");
const router = express.Router();

router.post("/getUrl", YouTubeController.getUrl);

module.exports = router;
