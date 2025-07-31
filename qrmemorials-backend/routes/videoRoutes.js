const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadVideoToVimeo , getPackageVideos} = require('../contollers/videoController');
const {  isApiAuthenticatedUser } = require("../middleware/auth");
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory

router.post('/videos/upload', upload.single('video'), isApiAuthenticatedUser, uploadVideoToVimeo);
router.get('/packages/:packageId/videos', isApiAuthenticatedUser, getPackageVideos);

module.exports = router;
