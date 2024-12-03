// src/middlewares/errorHandler.js

const HttpStatusCode = require('../constants/HttpStatusCode');
const ServerErrors = require('../constants/ServerErrors');

const errorHandler = (err, req, res, next) => {
  if (err.httpStatus === undefined) {
    // Log the error message instead of the entire error object
    console.error('Untracked error:', err.message);
    res.status(HttpStatusCode.INTERNAL_ERROR).json({
      error: ServerErrors.INTERNAL_ERROR_MESSAGE,
      uiMessage: ServerErrors.INTERNAL_ERROR_UI_MESSAGE,
    });
  } else {
    console.error(`${new Date()} - ERROR: ${err.message}`);
    res.status(err.httpStatus).json({
      error: err.message,
      uiMessage: err.uiMessage,
    });
  }
};

module.exports = {
  errorHandler,
};
