const User = require("../models/user");
const Color = require("../models/Color");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Size = require("../models/Size");
const Wishlist = require("../models/Wishlist");

// Define associations after models are initialized
// User.associate({ Product, Wishlist });
// Product.associate({ User, Wishlist });

Product.hasMany(ProductVariant);
ProductVariant.belongsTo(Product);

// Color to ProductVariant (One-to-Many)
Color.hasMany(ProductVariant);
ProductVariant.belongsTo(Color, { allowNull: true });

// Size to ProductVariant (One-to-Many)
Size.hasMany(ProductVariant);
ProductVariant.belongsTo(Size, { allowNull: true });

Product.belongsToMany(User, { through: Wishlist, foreignKey: "productId" });
User.belongsToMany(Product, { through: Wishlist, foreignKey: "userId" });
