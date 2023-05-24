const path = require('path');
const ApiError = require('../utils/ApiError');
const HttpStatusCode = require('../constants/HttpStatusCode');
const PayloadErrors = require('../constants/PayloadErrors');

function payloadChecker(req, res, next) {
  if(req.headers.session_id === undefined){
    next(new ApiError(PayloadErrors.MISSING_SESSION_ID_ERROR_MESSAGE, HttpStatusCode.BAD_REQUEST, PayloadErrors.MISSING_SESSION_ID_UI_ERROR_MESSAGE, __filename))  
  }

  if (req.file === undefined) {
    next(new ApiError(PayloadErrors.MISSING_CSV_ERROR_MESSAGE, HttpStatusCode.BAD_REQUEST, PayloadErrors.MISSING_CSV_ERROR_UI_MESSAGE, __filename))
  }
  next()
}
module.exports = payloadChecker
