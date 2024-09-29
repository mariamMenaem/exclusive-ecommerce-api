const Color = require("../models/Color");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Size = require("../models/Size");

Product.hasMany(ProductVariant);
ProductVariant.belongsTo(Product);

// Color to ProductVariant (One-to-Many)
Color.hasMany(ProductVariant);
ProductVariant.belongsTo(Color, { allowNull: true });

// Size to ProductVariant (One-to-Many)
Size.hasMany(ProductVariant);
ProductVariant.belongsTo(Size, { allowNull: true });
