const express = require('express')
const FilesRouter = require('./files')
const UsersRouter = require('./users')
const router = express.Router();

router.use("/files", FilesRouter);
router.use("/users", UsersRouter);

module.exports = router
