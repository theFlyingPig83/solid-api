const express = require('express')
const FilesRouter = require('./files')
const UsersRouter = require('./users');
const HttpStatusCode = require('../constants/HttpStatusCode');
const sessionChecker = require('../middlewares/sessionChecker');
const router = express.Router();

router.use("/files", sessionChecker, FilesRouter);
router.use("/users", sessionChecker, UsersRouter);
router.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).send('Page not found!')
})

module.exports = router
