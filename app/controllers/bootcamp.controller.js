const { users, bootcamps } = require("../models");
const db = require("../models");
const Bootcamp = db.bootcamps;
const User = db.users;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = async (req, res) => {
  try {
    const { title, description, cue } = req.body;

    if (!title.trim() || !description.trim() || !cue) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Todos los campos son requeridos",
      });
    }

    const newBootcamp = await Bootcamp.create({ title, cue, description });

    console.log(newBootcamp);

    res.status(201).json({
      ok: true,
      status: 201,
      message: `Se ha creado el bootcamp '${title}'`,
      data: newBootcamp,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al crear un nuevo bootcamp",
    });
  }
};

// Agregar un Usuario al Bootcamp
exports.addUser = async (req, res) => {
  try {
    const { bootcampId, userId } = req.body;

    const bootcamp = await Bootcamp.findByPk(bootcampId);
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    const checkIfAlreadyExists = user.dataValues.bootcamps.some(
      (item) => item.id == bootcampId
    );

    if (checkIfAlreadyExists) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "El usuario ya se encuentra ingresado en este bootcamp",
      });
    }

    if (!bootcamp) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `El bootcamp con id ${bootcampId} no existe`,
      });
    }

    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `El usuario con id ${userId} no existe`,
      });
    }

    bootcamp.addUser(user);

    console.log(
      `Se ha Agregado el usuario ${user.firstName} ${user.lastName} (id ${user.id}) al bootcamp ${bootcamp.title} (id ${bootcamp.id})`
    );

    res.status(200).json({
      ok: true,
      status: 200,
      message: `Se ha Agregado el usuario ${user.firstName} ${user.lastName} (id ${user.id}) al bootcamp ${bootcamp.title} (id ${bootcamp.id})`,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al asignar un usuario al bootcamp",
    });
  }
};

// buscar bootcamp por id
exports.findById = async (req, res) => {
  try {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!bootcamp) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `El bootcamp con id ${id} no existe`,
      });
    }

    res.status(200).json({ ok: true, status: 200, bootcamp });
  } catch (error) {
    return res.status(error.code || 500).json({
      ok: false,
      status: error.code || 500,
      message:
        error.message ||
        "Ocurrió un error a nivel de servidor al consultar un bootcamp",
    });
  }
};

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).json({ ok: true, status: 200, data: bootcamps });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      message: error.message || "Error a nivel del servidor",
    });
  }
};
