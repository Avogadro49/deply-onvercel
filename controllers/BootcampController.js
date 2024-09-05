const Bootcamp = require("../models/Bootcamp");
const Course = require("../models/Course");
const bootCampResource = require("../resources/BootcampResources");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../utils/ErrorResponse");
const { param } = require("../routes/bootcampsRoutes");

class BootcampController {
  //? @desc Get All Bootcamps
  //? @route GET /api/v1/bootcamps
  //? @access Public
  static index = asyncMiddleware(async (req, res, next) => {
    let query;
    //Create query strings
    const reqQuery = { ...req.query };
    // Convert the request query parameters to a JSON string

    const removeFields = ["select", "sort", "page", "limit", "include"];

    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // Replace keywords (gt, gte, lt, lte, lt) with their MongoDB operators counterparts ($gt, $gte, $lt, $lte, $lt)
    // prettier-ignore
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => ['$', match].join(""));
    // Find Resource

    if (req.query.include) {
      const relationships = req.query.include.split(",");
      if (relationships.includes("courses")) {
        query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");
      } else {
        query = Bootcamp.find(JSON.parse(queryStr));
      }
    } else {
      query = Bootcamp.find(JSON.parse(queryStr));
    }

    //Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Pagination
    const _page = 1;
    const page = parseInt(req.query.page) || _page;
    const limit = parseInt(req.query.limit) || process.env.PREPAGE;
    const startIndex = parseInt(page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    // const bootcamps = await query;

    //Pagination Result
    let pagination = {};

    if (endIndex < total) {
      pagination = {
        ...pagination,
        next: {
          page: page + 1,
          limit: parseInt(limit),
        },
      };
    }

    if (startIndex > 0) {
      pagination = {
        ...pagination,
        prev: {
          page: page - 1,
          limit: parseInt(limit),
        },
      };
    }

    const bootcamps = await query;
    //Response
    res.status(200).json({
      success: true,
      total: total,
      pagination,
      data: bootcamps.map((bootcamp) => bootCampResource(bootcamp)),
    });
  });

  //? @desc Get single Bootcamp
  //? @route GET /api/v1/bootcamps/:id
  //? @access Public
  static show = asyncMiddleware(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with this id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({ success: true, data: bootCampResource(bootcamp) });
  });

  //? @desc Create new Bootcamp
  //? @route POST /api/v1/bootcamps
  //? @access Public
  static store = asyncMiddleware(async (req, res, next) => {
    const createdBootcamp = { ...req.body, user_id: req.user.id };

    // Check if the user has already published a bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user_id: req.user.id });

    if (publishedBootcamp && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a bootcamp`,
          400
        )
      );
    }
    const bootcamp = await Bootcamp.create(createdBootcamp);

    res.status(201).json({ success: true, data: bootcamp });
  });

  //? @desc Update Bootcamp
  //? @route PUT /api/v1/bootcamps/:id
  //? @access Private
  static update = asyncMiddleware(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidation: true,
    });
    if (!bootcamp) {
      return res.status(400).json({ message: "false" });
    }
    res.status(200).json({ success: true, data: bootcamp });
  });

  //? @desc Delete Bootcamp
  //? @route DELETE /api/v1/bootcamps/:id
  //? @access Private
  static destroy = asyncMiddleware(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse("Bootcamp not found", 404));
    }

    res.status(200).json({ success: true, message: "successful deleted" });
  });
}

module.exports = BootcampController;
