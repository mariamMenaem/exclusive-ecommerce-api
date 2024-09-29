// models/index.js
const sequelize = require("../config/database");
const User = require("./user");

const db = {
  User,
  sequelize,
};

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
})();

module.exports = db;
