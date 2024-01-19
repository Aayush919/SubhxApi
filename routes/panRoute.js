const express = require('express');
const router = express.Router();
const multer = require("multer");
const { uploadPan } = require('../controller/panController');
const {isAuth}=require("../middlewares/auth.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([{ name: 'panPhoto', maxCount: 1 }]);

router.post("/uploadPan",uploadFields,uploadPan);

module.exports = router;
