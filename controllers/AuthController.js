const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const sendTokenResponse = require("../utils/sendTokenResponse");

class AuthController {
  //? @desc Register User
  //? @route GET /api/v1/auth/register
  //? @access Public
  static register = asyncMiddleware(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    //Create token
    sendTokenResponse(user, 201, res);
  });

  //? @desc Login User
  //? @route GET /api/v1/auth/login
  //? @access Public
  static login = asyncMiddleware(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate Email and Password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password"),
        400
      );
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  });
}

module.exports = AuthController;
