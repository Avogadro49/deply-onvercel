const express = require("express");
const BootcampController = require("../controllers/BootcampController");

const router = express.Router();

router.route("/").get(BootcampController.index).post(BootcampController.store);

router
  .route("/:id")
  .get(BootcampController.show)
  .put(BootcampController.update)
  .delete(BootcampController.destroy);

module.exports = router;
