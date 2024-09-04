const express = require("express");
const CourseController = require("../controllers/CourseController");
const AuthController = require("../middleware/AuthMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(CourseController.index)
  .post(
    AuthController.protectRoute,
    AuthController.authorize("publisher", "user"),
    CourseController.store
  );

router
  .route("/:id")
  .get(CourseController.show)
  .put(
    AuthController.protectRoute,
    AuthController.authorize("publisher", "user"),
    CourseController.update
  )
  .delete(
    AuthController.protectRoute,
    AuthController.authorize("publisher", "user"),
    CourseController.destroy
  );
module.exports = router;
