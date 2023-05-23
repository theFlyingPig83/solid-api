const express = require('express')
const mainRouter = require('./src/routes/index')
const app = express()
const port = process.env.PORT || 3000

app.use('/api', mainRouter)

app.listen(port, () => {
  console.log(`Server is listing on port: ${port}`)
})