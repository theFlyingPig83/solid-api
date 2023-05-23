const UsersCSVHandler = require("../utils/usersCSVHandler")
const User = require('../models/user')
const HttpStatusCode = require("../constants/HttpStatusCode")
module.exports = {
  create: async (req, res) => {
    try {

      const uploadedCSVPath = './test/mocks/valid.csv' //req.filePath
      const parsedUsers = await UsersCSVHandler.parseUsers(uploadedCSVPath)
      const result = await User.createUsers(parsedUsers)

      res.send(result)

    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_ERROR).send({error})
    }
  }
}