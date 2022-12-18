const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");
const { documentController } = require("../../controllers/api");

router.post("/", upload.single("file"), documentController.createDocument);

module.exports = router;
