const path = require('path');
const ApiError = require('../utils/ApiError');
const HttpStatusCode = require('../constants/HttpStatusCode');
const PayloadErrors = require('../constants/PayloadErrors');

function authChecker(req, res, next) {
  if(req.headers.session_id === undefined){
    next(new ApiError(PayloadErrors.MISSING_SESSION_ID_ERROR_MESSAGE, HttpStatusCode.BAD_REQUEST, PayloadErrors.MISSING_SESSION_ID_UI_ERROR_MESSAGE, __filename))  
  }
  next()
}
module.exports = authChecker
