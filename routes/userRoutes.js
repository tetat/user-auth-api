const express = require("express");

const renderController = require("../controller/renderController");
const userController = require("../controller/userController");
const { isNotUser, isUser, isMe } = require("../middleware/userMiddleware");

const router = express.Router();

// for render
router.get("/demo", isUser, renderController.demo);
router.get("/signup", isNotUser, renderController.sign_up);
router.get("/login", isNotUser, renderController.log_in);

// rest api
router.post("/signup", userController.sign_up);
router.post("/login", userController.log_in);
router.get("/logout", isUser, userController.log_out);
router.get("/users", isUser, userController.users);
router.get("/users/:userName", isUser, userController.user);
router.patch("/update/:userName", isUser, isMe, userController.update_user);
router.delete("/delete/:userName", isUser, isMe, userController.delete_user);

module.exports = router;
