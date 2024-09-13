const express = require("express");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get('/logout', AuthController.logout);
router.post("/forgotpassword", AuthController.forgotPassword);
router.put("/resetpassword/:resettoken", AuthController.resetPassword);
router.put("/updatedetails", authMiddleware.protectRoute,  AuthController.updateDetails);
router.put("/updatepassword", authMiddleware.protectRoute,  AuthController.updatePassword);

module.exports = router;
