const { TokenExpiredError } = require("jsonwebtoken");
const { ValidationError, UniqueViolationError, ForeignKeyViolationError } = require("objection");


class SendError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  if (err) {
    if (err instanceof ValidationError) {
      let msg = err.message.split(",")[0];
      return res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: msg,
      });
    }

    if (err instanceof UniqueViolationError) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `${err.columns} already used`,
      });
    }

    if (err instanceof ForeignKeyViolationError) {
      let msg = err.constraint.split("_");
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `${msg[1]} not available`,
      });
    }

    if (err instanceof TokenExpiredError) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: err.message,
      });
    }

    if (err instanceof SendError) {
      return res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
      });
    }

    console.log(err);
    return res.status(501).json({
      success: false,
      statusCode: 501,
      message: "Not Implemented",
    });
  }
}

module.exports = {
  SendError,
  errorHandler,
}