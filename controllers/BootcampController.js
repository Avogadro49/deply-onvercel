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
    try {
      const features = new ApiFeatures(Bootcamp.find(), req.query)
        .filter()
        .includeRelationships()
        .select()
        .sort();

      await features.paginate();

      const bootcamps = await features.query;
      //Response
      res.status(200).json({
        success: true,
        pagination: features.pagination,
        data: bootcamps.map((bootcamp) => bootCampResource(bootcamp)),
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
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
