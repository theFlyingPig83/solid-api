const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const HttpStatusCode = require('../constants/HttpStatusCode');
const FileErrors = require('../constants/FileErrors');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = path.resolve(__dirname, '..', '..', 'uploads')
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true })
  }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const csvFilter = function (req, file, cb) {
  if (file.mimetype !== 'text/csv') {
    cb(new ApiError(FileErrors.FILE_TYPE_NOT_ALLOWED, HttpStatusCode.BAD_REQUEST, FileErrors.FILE_TYPE_NOT_ALLOWED_UI_MESSAGE, __filename), false);
  } else {
    cb(null, true);
  }
};
module.exports = {
  uploadMiddleware: multer({ storage: storage, fileFilter: csvFilter })
};
