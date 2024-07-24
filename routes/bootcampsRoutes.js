const express = require("express");
const BootcampController = require("../controllers/BootcampController");

//Include other resource routers
const courseRouter = require("./coursesRoutes");

const router = express.Router();

//Re-Route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(BootcampController.index).post(BootcampController.store);

router
  .route("/:id")
  .get(BootcampController.show)
  .put(BootcampController.update)
  .delete(BootcampController.destroy);

module.exports = router;
