const User = require('../models/user')

module.exports = {
  list: async (req, res, next) => {
    try {
      const { q: query } = req.query
      const sessionId = req.headers.session_id;
      const users = await User.listAll({ query, sessionId })
      res.json(users)
    } catch (error) {
      next(error)
    }
  }
}