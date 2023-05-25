const express = require('express')
const mainRouter = require('./src/routes/index');
const { errorHandler } = require('./src/middlewares/errorHandler');
const cors = require('cors');
const HttpStatusCode = require('./src/constants/HttpStatusCode');
const { PAGE_NOT_FOUND } = require('./src/constants/ServerErrors');
const server = express()
const port = process.env.PORT || 5050

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/api', mainRouter)

server.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).send(PAGE_NOT_FOUND)
})

server.use(errorHandler)

server.listen(port, () => {
  console.log(`Server is listing on port: ${port}`)
})

module.exports = server