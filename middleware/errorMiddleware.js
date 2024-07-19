const ErrorResponse = require("../utils/ErrorResponse");

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  console.log(err);

  //? Mongoose bad objectId
  if (err.name === "CastError") {
    const message = `Bootcamp not found with this id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //! Mongoose duplicate Error
  if (err.code === 11000) {
    const message = "Duplicated value entered";
    error = new ErrorResponse(message, 400);
  }

  //! Mongoose validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "server Error",
  });
};

module.exports = errorMiddleware;
