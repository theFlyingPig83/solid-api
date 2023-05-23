class ApiError extends Error {
  
  constructor({ message, error, uiMessage, level }) {
    super(message);
    this.error = error;
    this.uiMessage = uiMessage;
    this.level = level
  }
}

module.exports = ApiError;