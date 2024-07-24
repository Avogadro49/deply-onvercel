const ErrorResponse = require("../utils/ErrorResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Course = require("../models/Course");

//? @desc Get All Courses
//? @route GET /api/v1/courses
//? @route GET /api/v1/courses/:bootcampId/courses
//? @access Public

class CourseController {
  static index = asyncMiddleware(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find().populate("bootcamp");
    }
    const course = await query;
    res.status(200).json({
      success: true,
      count: course.length,
      data: course,
    });
    // let query;
    // //Create query strings
    // const reqQuery = { ...req.query };
    // // Convert the request query parameters to a JSON string

    // const removeFields = ["select", "sort", "page", "limit"];

    // removeFields.forEach((param) => delete reqQuery[param]);

    // let queryStr = JSON.stringify(reqQuery);

    // // Replace keywords (gt, gte, lt, lte, lt) with their MongoDB operators counterparts ($gt, $gte, $lt, $lte, $lt)
    // // prettier-ignore
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => ['$', match].join(""));
    // // Parse the modified query string back into a JSON object and use it to create a query with Bootcamp.find
    // query = Bootcamp.find(JSON.parse(queryStr));

    // //Select Fields
    // if (req.query.select) {
    //   const fields = req.query.select.split(",").join(" ");
    //   query = query.select(fields);
    // }

    // //Sort
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // //Pagination
    // const _page = 1;
    // const page = parseInt(req.query.page) || _page;
    // const limit = parseInt(req.query.limit) || process.env.PREPAGE;
    // const startIndex = parseInt(page - 1) * limit;
    // const endIndex = page * limit;
    // const total = await Bootcamp.countDocuments();

    // query = query.skip(startIndex).limit(limit);

    // // Executing query
    // const bootcamps = await query;

    // //Pagination Result
    // let pagination = {};

    // if (endIndex < total) {
    //   pagination = {
    //     ...pagination,
    //     next: {
    //       page: page + 1,
    //       limit: parseInt(limit),
    //     },
    //   };
    // }

    // if (startIndex > 0) {
    //   pagination = {
    //     ...pagination,
    //     prev: {
    //       page: page - 1,
    //       limit: parseInt(limit),
    //     },
    //   };
    // }

    // //Response
    // res.status(200).json({
    //   success: true,
    //   total: total,
    //   pagination,
    //   data: bootcamps.map((bootcamp) => bootCampResource(bootcamp)),
    // });
  });
}

module.exports = CourseController;
