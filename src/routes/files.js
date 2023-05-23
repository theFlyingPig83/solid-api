const express = require('express');
const fileController = require('../controllers/fileController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post("/", uploadMiddleware.single('file'), fileController.create);

module.exports = router;