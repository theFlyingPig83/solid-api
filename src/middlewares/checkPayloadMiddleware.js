const path = require('path');

function checkPayload (req, res, next) {
  if(req.file === undefined){
    next(new Error('The required csv file is missing!'))
  }
  next()
}
module.exports = checkPayload
