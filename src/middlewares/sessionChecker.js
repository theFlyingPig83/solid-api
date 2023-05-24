const path = require('path');
const ApiError = require('../utils/ApiError');
const HttpStatusCode = require('../constants/HttpStatusCode');
const PayloadErrors = require('../constants/PayloadErrors');
const SessionErrors = require('../constants/SessionErrors');

function sessionChecker(req, res, next) {
  if(req.headers.session_id === undefined){
    return next(new ApiError(SessionErrors.MISSING_SESSION_ID_ERROR_MESSAGE, HttpStatusCode.BAD_REQUEST, SessionErrors.MISSING_SESSION_ID_UI_ERROR_MESSAGE, __filename))  
  }
  next()
}
module.exports = sessionChecker
