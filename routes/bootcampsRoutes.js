const express = require("express");
const BootcampController = require("../controllers/BootcampController");
const AuthController = require("../middleware/AuthMiddleware");

//Include other resource routers
const courseRouter = require("./coursesRoutes");

const router = express.Router();

//Re-Route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(BootcampController.index)
  .post(
    AuthController.protectRoute,
    AuthController.authorize("publisher", "user"),
    BootcampController.store
  );

router
  .route("/:id")
  .get(BootcampController.show)
  .put(
    AuthController.protectRoute,
    AuthController.authorize("publisher", "user"),
    BootcampController.update
  )
  .delete(
    AuthController.protectRoute,
    AuthController.authorize("publisher", "user"),
    BootcampController.destroy
  );

module.exports = router;
