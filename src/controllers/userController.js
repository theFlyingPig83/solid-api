module.exports = {
  list: async (req, res) => {
    try {
      const users = ['Elton', 'John'];
      res.send(users)
    } catch (error) {
      console.log(error)
    }
  }
}