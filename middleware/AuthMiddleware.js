const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncMiddleware");
const errorMiddleware = require("./errorMiddleware");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

class AuthController {
  static protectRoute = asyncHandler(async (req, res, next) => {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //   else if (req.cookies.token) {
    //     token = req.cookies.token;
    //   }
    if (!token) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      req.user = await User.findById(decoded.id);

      next();
    } catch (err) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }
  });

  static authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `User role ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    };
  };
}

//Protect Routes

// exports.protectRoute = asyncHandler(async (req, res, next) => {});

module.exports = AuthController;
