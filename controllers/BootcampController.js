const Bootcamp = require("../models/Bootcamp");
const bootCampResource = require("../resources/BootcampResources");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../utils/ErrorResponse");

class BootcampController {
  //? @desc Get All Bootcamps
  //? @route GET /api/v1/bootcamps
  //? @access Public
  static index = asyncMiddleware(async (req, res, next) => {
    const bootcamps = (await Bootcamp.find()).map((bootcamp) =>
      bootCampResource(bootcamp)
    );
    res.status(200).json({ success: true, data: bootcamps });
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
