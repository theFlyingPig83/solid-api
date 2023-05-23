const HttpStatusCode = require("../constants/HttpStatusCode");
const ServerErrors = require("../constants/ServerErrors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.httpStatus === undefined) {
    res.status(HttpStatusCode.INTERNAL_ERROR).json({ error: ServerErrors.INTERNAL_ERROR_MESSAGE, uiMessage: ServerErrors.INTERNAL_ERROR_UI_MESSAGE });
  } else {
    res.status(err.httpStatus).json({ error: err.message, uiMessage: err.uiMessage });
  }
};


module.exports = errorHandler