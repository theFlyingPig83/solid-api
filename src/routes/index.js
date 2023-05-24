const express = require('express')
const FilesRouter = require('./files')
const UsersRouter = require('./users');
const HttpStatusCode = require('../constants/HttpStatusCode');
const authChecker = require('../middlewares/authChecker');
const router = express.Router();

router.use("/files", authChecker, FilesRouter);
router.use("/users", authChecker, UsersRouter);
router.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).send('Page not found!')
})

module.exports = router
