module.exports = {
  list: async (req, res, next) => {
    try {
      const users = ['Elton', 'John'];
      res.json(users)
    } catch (error) {
      next(error)
    }
  }
}