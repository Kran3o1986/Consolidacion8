const bycrypt = require("bcryptjs");
const db = require("../models");
const jwt = require("jsonwebtoken");
const jwt_generationkey = require("../config/auth.config");
const User = db.users;
const Bootcamp = db.bootcamps;

// REGISTRAR USUARIOS
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
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
      attributes: ["email"],
    });

    if (userCheck) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "El email ingresado ya tiene un usuario registrado",
      });
    }

    const salt = await bycrypt.genSalt(7);
    const encryptedPW = await bycrypt.hash(password, salt);

    const creation = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPW,
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      data: {
        firstName,
        lastName,
        email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al ingresar un nuevo usuario",
    });
  }
};

//Login de usuarios
exports.signIn = async (req, res) => {
  try {
    const token = jwt.sign(req.user, jwt_generationkey, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      data: req.user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al iniciar sesión",
    });
  }
};

// obtener los bootcamp de un usuario
exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "firstName", "lastName", "email"],
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "El usuario consultado no existe",
      });
    }

    return res.status(200).json({ ok: true, status: 200, data: user });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al buscar un usuario",
    });
  }
};

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ ok: true, status: 200, users });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al obtener una lista de usuarios",
    });
  }
};

// Actualizar usuarios
exports.updateUserById = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const { id } = req.params;

    const updatedUser = await User.update(
      {
        firstName,
        lastName,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!updatedUser[0]) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `El usuario con id ${id} no existe`,
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: `Se ha actualizado exitosamente el usuario con id ${id}`,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al actualizar un usuario",
    });
  }
};

// Eliminar usuarios
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userEliminado = await User.destroy({
      where: {
        id: id,
      },
    });

    if (!userEliminado) {
      return res.status(404).json({
        ok: false,
        status: 400,
        message: `El usuario que intentó eliminar (id ${id}) no existe`,
      });
    }

    res.status(404).json({
      ok: true,
      status: 200,
      message: `Se ha eliminado satisfactoriamente al usuario con id ${id}`,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al eliminar un usuario",
    });
  }
};

