const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const HttpStatusCode = require('../constants/HttpStatusCode');
const FileErrors = require('../constants/FileErrors');
const fs = require('fs');

const MAX_FILE_SIZE = 1024 * 1024; //1MB

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
  const fileSize = parseInt(req.headers["content-length"])
  if (file.mimetype !== 'text/csv') {
    cb(new ApiError(FileErrors.FILE_TYPE_NOT_ALLOWED, HttpStatusCode.BAD_REQUEST, FileErrors.FILE_TYPE_NOT_ALLOWED_UI_MESSAGE, __filename), false);
  } else if (fileSize > MAX_FILE_SIZE) {
    cb(new ApiError(FileErrors.FILE_SIZE_TOO_LARGE, HttpStatusCode.BAD_REQUEST, FileErrors.FILE_SIZE_TOO_LARGE_UI_MESSAGE, __filename), false);
  }
  else {
    cb(null, true);
  }
};
module.exports = {
  uploadMiddleware: multer({ storage: storage, fileFilter: csvFilter })
};
