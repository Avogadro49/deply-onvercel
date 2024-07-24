const express = require("express");
const CourseController = require("../controllers/CourseController");

const router = express.Router({ mergeParams: true });

router.route("/").get(CourseController.index);

module.exports = router;
