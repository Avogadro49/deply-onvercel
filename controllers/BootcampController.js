const Bootcamp = require("../models/Bootcamp");
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

    const removeFields = ["select"];

    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // Replace keywords (gt, gte, lt, lte, lt) with their MongoDB operators counterparts ($gt, $gte, $lt, $lte, $lt)
    // prettier-ignore
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => ['$', match].join(""));
    // Parse the modified query string back into a JSON object and use it to create a query with Bootcamp.find
    query = Bootcamp.find(JSON.parse(queryStr));

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

    // Executing query
    const bootcamps = await query;

    res.status(200).json({
      success: true,
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
    const bootcamp = await Bootcamp.create(req.body);
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
      return res.status(400).json({ message: "no Content" });
    }
    res.status(204).json({ success: true, message: bootcamp });
  });
}

module.exports = BootcampController;
