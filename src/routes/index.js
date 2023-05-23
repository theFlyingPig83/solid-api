const express = require('express')
const FilesRouter = require('./files')
const UsersRouter = require('./users');
const HttpStatusCode = require('../Enums/HttpStatusCode');
const router = express.Router();

router.use("/files", FilesRouter);
router.use("/users", UsersRouter);
router.use('*', (req, res) => { 
  res.status(HttpStatusCode.NOT_FOUND).send('Page not found!')
})

module.exports = router
