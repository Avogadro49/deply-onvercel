const express = require("express");
const CourseController = require("../controllers/CourseController");

const router = express.Router({ mergeParams: true });

router.route("/").get(CourseController.index).post(CourseController.store);

router.route("/:id").get(CourseController.show);
module.exports = router;
