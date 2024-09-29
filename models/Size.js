const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Size = sequelize.define(
  "Size",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = Size;
