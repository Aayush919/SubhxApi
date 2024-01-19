const express = require('express');
const router = express.Router();
const {uploadAdhar}=require("../controller/adharController.js")
const multer = require("multer");
const {isAuth}=require("../middlewares/auth.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([{ name: 'frontPhoto', maxCount: 1 }, { name: 'backPhoto', maxCount: 1 }]);

router.post("/uploadAdhar",uploadFields,uploadAdhar);

module.exports = router;
