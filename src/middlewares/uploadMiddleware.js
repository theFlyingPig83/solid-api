const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = path.resolve(__dirname, '..', '..', 'uploads')

    cb(null, destination);
  },
  filename: function (req, file, cb) {
    // Utilize um nome de arquivo único
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const csvFilter = function (req, file, cb) {
  if (file.mimetype !== 'text/csv') {
    // Rejeitar arquivos que não sejam CSV
    cb(new Error('Only CSV files are allowed!'), false);
  } else {
    cb(null, true);
  }
};
module.exports = multer({ storage: storage, fileFilter: csvFilter});
