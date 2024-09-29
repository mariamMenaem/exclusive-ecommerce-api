const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Color = sequelize.define(
  "Color",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    timestamps: true,
  }
);
module.exports = Color;
