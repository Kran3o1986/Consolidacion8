const { Router } = require("express");
const bootcampController = require("../controllers/bootcamp.controller");
const middlewares = require("../middleware");

const bootcampRouter = new Router();

bootcampRouter.get("/bootcamp", bootcampController.findAll);
bootcampRouter.get(
  "/bootcamp/:id",
  middlewares.verifyToken,
  bootcampController.findById
);

bootcampRouter.post(
  "/bootcamp",
  middlewares.verifyToken,
  bootcampController.createBootcamp
);
bootcampRouter.post(
  "/bootcamp/adduser",
  middlewares.verifyToken,
  bootcampController.addUser
);

module.exports = bootcampRouter;
