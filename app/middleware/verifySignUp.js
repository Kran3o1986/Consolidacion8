const bycrypt = require("bcryptjs");
const db = require("../models");
const User = db.users;

const verifySignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Todos los campos son requeridos",
      });
    }

    const userCheck = await User.findOne({
      where: {
        email,
      },
    });

    if (!userCheck) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "El email ingresado no tiene un usuario asociado",
      });
    }

    const passwordCheck = await bycrypt.compare(password, userCheck.password);

    if (!passwordCheck) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "La contraseña introducida es incorrecta",
      });
    }

    req.user = {
      firstName: userCheck.firstName,
      lastName: userCheck.lastName,
      email,
    };

    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al verificar la cuenta del usuario",
    });
  }
};

module.exports = verifySignUp;
