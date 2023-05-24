const express = require('express');
const fileController = require('../controllers/fileController');
const {uploadMiddleware} = require('../middlewares/multerUpload');
const payloadChecker = require('../middlewares/payloadChecker');
const router = express.Router();

router.post("/", uploadMiddleware.single('file'), payloadChecker, fileController.create);

module.exports = router;