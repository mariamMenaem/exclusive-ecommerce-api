// models/index.js
const sequelize = require("../config/database");
const Color = require("./Color");
const Product = require("./Product");
const ProductVariant = require("./ProductVariant");
const Size = require("./Size");
const User = require("./user");
const Wishlist = require("./Wishlist");

const db = {
  User,
  Product,
  ProductVariant,
  Wishlist,
  Color,
  Size,
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
