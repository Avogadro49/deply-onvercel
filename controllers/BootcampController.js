const Bootcamp = require("../models/Bootcamp");

class BootcampController {
  //? @desc Get All Bootcamps
  //? @route GET /api/v1/bootcamps
  //? @access Public
  static async index(req, res, next) {
    try {
      const bootcamps = await Bootcamp.find();
      res.status(200).json({ success: true, data: bootcamps });
    } catch (err) {
      next(err);
    }
  }

  //? @desc Get single Bootcamp
  //? @route GET /api/v1/bootcamps/:id
  //? @access Public
  static async show(req, res, next) {
    try {
      const bootcamp = await Bootcamp.findById(req.params.id);

      if (!bootcamp) {
        return res.status(400).json({ message: "false" });
      }

      res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
      next(err);
    }
  }

  //? @desc Create new Bootcamp
  //? @route POST /api/v1/bootcamps
  //? @access Public
  static async store(req, res, next) {
    try {
      const bootcamp = await Bootcamp.create(req.body);
      res.status(201).json({ success: true, data: bootcamp });
    } catch (err) {
      res.status(404).json({ success: false });
      next(err);
    }
  }

  //? @desc Update Bootcamp
  //? @route PUT /api/v1/bootcamps/:id
  //? @access Private
  static async update(req, res, next) {
    try {
      const bootcamp = await Bootcamp.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidation: true,
        }
      );
      if (!bootcamp) {
        return res.status(400).json({ message: "false" });
      }
      res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
      next(err);
    }
  }

  //? @desc Delete Bootcamp
  //? @route DELETE /api/v1/bootcamps/:id
  //? @access Private
  static async destroy(req, res, next) {
    try {
      const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

      if (!bootcamp) {
        return res.status(400).json({ message: "no Content" });
      }
      res.status(204).json({ success: true, message: bootcamp });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BootcampController;
