const express = require('express')
const FilesRouter = require('./files')
const UsersRouter = require('./users');
const sessionChecker = require('../middlewares/sessionChecker');
const router = express.Router();

router.use("/files", sessionChecker, FilesRouter);
router.use("/users", sessionChecker, UsersRouter);

module.exports = router
