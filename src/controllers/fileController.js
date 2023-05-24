const UsersCSVHandler = require("../utils/usersCSVHandler")
const User = require('../models/user')

module.exports = {
  create: async function create (req, res, next) {
    try {
      const uploadedCSVPath = req.file.path
      const sessionId = req.headers.session_id;
      const parsedUsers = await UsersCSVHandler.parseUsers(uploadedCSVPath)
      const result = await User.createUsers(parsedUsers, sessionId)
      res.send(result)
    } catch (error) {
      next(error)
    }
  }
}