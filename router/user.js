const express = require('express');
const router = express.Router()
const { getUserById, updateUserAddress, removeAddress, uploadImage, updateProfile } = require('../controller/user');
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const authenticateToken = require('../middleware/jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

router.get('/:id', authenticateToken, getUserById)
    .post("/ProfileUpdate", authenticateToken, updateProfile)
    .patch('/', authenticateToken, updateUserAddress)
    .patch('/removeAddress', authenticateToken, removeAddress)
    .post("/avatar", authenticateToken, upload.single("avatar"), uploadImage)


module.exports = router


