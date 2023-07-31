const middlewares = {};

middlewares.verifyToken = require("./auth");
middlewares.verifySignUp = require("./verifySignUp");

module.exports = middlewares;
