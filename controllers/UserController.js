const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ApiFeatures = require("../utils/APIFeatures");

class UserController {
  // @desc      Get all users
  // @route     GET /api/v1/users
  // @access    Private/Admin
  static getUsers = asyncMiddleware(async (req, res, next) => {
    const fetures = new ApiFeatures(User.find(), req.query)
      .filter()
      .includeRelationships()
      .select()
      .sort();

    await fetures.paginate();

    const users = await fetures.query;

    const pagination = fetures.pagination;

    res.status(200).json({
      status: "success",
      results: users.lenght,
      pagination: pagination,
      data: users,
    });
  });

  // @desc      Get single user
  // @route     GET /api/v1/users/:id
  // @access    Private/Admin
  static getUser = asyncMiddleware(async (req, res, next) => {
    const user = await User.findById(req.param.id);

    if (!user) {
      return next(
        new ErrorResponse(`No user with the Id of ${req.param.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  });

  // @desc      create user
  // @route     POST /api/v1/users
  // @access    Private/Admin
  static createUser = asyncMiddleware(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: user,
    });
  });

  // @desc      update user
  // @route     POST /api/v1/users
  // @access    Private/Admin
  static updateUser = asyncMiddleware(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.param.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: user,
    });
  });

  // @desc      delete user
  // @route     POST /api/v1/users
  // @access    Private/Admin
  static deleteUser = asyncMiddleware(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.param.id);

    res.status(200).json({
      status: "success",
    });
  });
}

module.exports = UserController;
