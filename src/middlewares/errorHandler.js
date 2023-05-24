const HttpStatusCode = require("../constants/HttpStatusCode");
const ServerErrors = require("../constants/ServerErrors");

const errorHandler = (err, req, res, next) => {

  if (err.httpStatus === undefined) {
    res.status(HttpStatusCode.INTERNAL_ERROR).json({ error: ServerErrors.INTERNAL_ERROR_MESSAGE, uiMessage: ServerErrors.INTERNAL_ERROR_UI_MESSAGE });
    console.error('Untracked error: ', err);
  } else {
    console.error(`${new Date()} -  ERROR: ${err.message}`)
    res.status(err.httpStatus).json({ error: err.message, uiMessage: err.uiMessage });
  }
};


module.exports = {
  errorHandler
}