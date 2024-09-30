const Product = require("../models/Product");
const User = require("../models/user");
const Wishlist = require("../models/Wishlist");

exports.addtowishlist = async (req, res, next) => {
  const { productId } = req.body;
  const { userId } = req.user;

  console.log("req.userId: " + req.user, "userId: " + userId);

  try {
    // Check if the user and product exist
    const user = await User.findByPk(userId);
    const product = await Product.findByPk(productId);

    if (!user || !product) {
      return res.status(404).json({ error: "User or product not found" });
    }

    // Add the product to the wishlist
    await Wishlist.create({ userId, productId });

    res.json({ message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.getUserWishlist = async (req, res, next) => {
  const { userId } = req.user;

  try {
    // Fetch the user's wishlist with the associated products
    const user = await User.findByPk(userId, {
      include: {
        model: Product,
        through: { attributes: [] }, // Don't include wishlist fields in response
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.Products); // Return products in the wishlist
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
