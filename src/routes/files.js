const express = require('express');
const fileController = require('../controllers/fileController');
const multerUploadMiddleware = require('../middlewares/multerUpload');
const checkPayloadMiddleware = require('../middlewares/checkPayload');
const router = express.Router();

router.post("/", multerUploadMiddleware.single('file'), checkPayloadMiddleware, fileController.create);

module.exports = router;