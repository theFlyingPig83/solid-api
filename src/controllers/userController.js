module.exports = {
  list: async (req, res) => {
    try {
      const users = ['Elton', 'John'];
      res.json(users)
    } catch (error) {
      next(error)
    }
  }
}