const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/AuthMiddleware");
const User = require("../models/User");

const router = express.Router();

router.use(authMiddleware.protectRoute);
router.use(authMiddleware.authorize("admin"));

router.route("/").get(UserController.getUsers).post(UserController.createUser);

router
  .route("/:id")
  .get(UserController.getUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
