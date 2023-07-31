module.exports = {
  HOST: "localhost",
  USER: "user_db_bootcamp",
  PASSWORD: "db_bootcamp",
  DB: "db_jwtbootcamp",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
