const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.get("/users", userController.all_user);
router.post("/signup", userController.sign_up);
router.post("/login", () => {});

module.exports = router;
