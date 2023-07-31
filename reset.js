const db = require("./app/models");

//Función para resetear la base de datos
const resetDb = async () => {
  await db.sequelize.sync({
    force: true,
  });

  console.log("Eliminando y resincronizando la base de datos.");
};

resetDb();
