const express = require("express");
const userRouter = express.Router();

const { login, signup, loginWithToken, addBalance } = require("../controller/userController");
const { verifyToken } = require("../middleware/auth");

userRouter.post("/login", login)
userRouter.post("/signup", signup);
userRouter.get("/loginWithToken", verifyToken, loginWithToken);
userRouter.post("/addBalance", verifyToken, addBalance);

// userRouter.route("/loginWithToken").get(verifyToken, loginWithToken);

module.exports = userRouter;
