module.exports = {
  create: async (req, res) => {
    try {
      const file = "this is a string";
      res.send(file)
    } catch (error) {
      console.log(error)
    }
  }
}