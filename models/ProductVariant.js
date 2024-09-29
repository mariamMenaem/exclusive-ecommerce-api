const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // other fields like SKU, discount, etc.
  },
  {
    timestamps: true,
  }
);
module.exports = ProductVariant;
