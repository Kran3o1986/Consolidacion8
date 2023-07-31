const jwt = require("jsonwebtoken");
const jwt_generationkey = require("../config/auth.config");

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({
        ok: false,
        status: 403,
        message: "Un token es requerido para la autorización",
      });
    }

    const decodedToken = jwt.verify(token, jwt_generationkey);

    console.log("auth correcto");
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      ok: false,
      status: 401,
      message: "Token no valido, acceso denegado",
    });
  }
};

module.exports = verifyToken;
