const express = require("express");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/me", authMiddleware, AuthController.getProfile);
router.put("/organization", authMiddleware, AuthController.updateOrg);

module.exports = router;
module.exports.authMiddleware = authMiddleware;
