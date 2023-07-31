const { Router } = require("express");
const userController = require("../controllers/user.controller");
const middlewares = require("../middleware");

const userRouter = new Router();

userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", middlewares.verifySignUp, userController.signIn);

userRouter.get(
  "/user/:id",
  middlewares.verifyToken,
  userController.findUserById
);
userRouter.get("/user", middlewares.verifyToken, userController.findAll);

userRouter.put(
  "/user/:id",
  middlewares.verifyToken,
  userController.updateUserById
);

userRouter.delete(
  "/user/:id",
  middlewares.verifyToken,
  userController.deleteUserById
);

module.exports = userRouter;
