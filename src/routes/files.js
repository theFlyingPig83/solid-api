const express = require('express');
const fileController = require('../controllers/fileController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const checkPayloadMiddleware = require('../middlewares/checkPayloadMiddleware');
const router = express.Router();

router.post("/", uploadMiddleware.single('file'),checkPayloadMiddleware, fileController.create);

module.exports = router;