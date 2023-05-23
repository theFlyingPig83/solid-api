class ApiError extends Error {
  
  constructor(message, httpStatus, uiMessage, level, error) {
    super(message);
    this.uiMessage = uiMessage;
    this.level = level
    this.httpStatus = httpStatus
    this.error = error;
  }
}

module.exports = ApiError;