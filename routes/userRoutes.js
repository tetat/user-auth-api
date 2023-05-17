const express = require("express");

const userController = require("../controller/userController");
const { isNotUser, isUser } = require("../middleware/userMiddleware");

const router = express.Router();

router.get("/users", isUser, userController.all_user);
router.post("/signup", userController.sign_up);
router.get("/signup", isNotUser, userController.signup_get);
router.post("/login", userController.log_in);
router.get("/login", isNotUser, userController.login_get);
router.get("/logout", isUser, userController.log_out);

module.exports = router;
