const { Sequelize } = require("sequelize");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Color = require("../models/Color");
const Size = require("../models/Size");

exports.createProduct = async (req, res) => {
  const { name, description, price, variants } = req.body;

  try {
    const product = await Product.create({ name, description, price });

    // Process each variant
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        const { stock, price, colorId, sizeId } = variant;

        // Create the product variant
        await ProductVariant.create({
          stock,
          price,
          ProductId: product.id,
          ColorId: colorId || null, // Allow for optional color
          SizeId: sizeId || null, // Allow for optional size
        });
      }
    }

    res.status(201).json({ message: "Product created successfully!", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating product." });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch product by ID and include related variants, colors, and sizes
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductVariant,
          include: [
            { model: Color, attributes: ["id", "name"] }, // Include color details
            { model: Size, attributes: ["id", "name"] }, // Include size details
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Group variants by color
    const groupedVariants = product.ProductVariants.reduce((acc, variant) => {
      const colorName = variant.Color.name;
      const colorHexCode = variant.Color.hexCode;

      if (!acc[colorName]) {
        acc[colorName] = {
          color: {
            id: variant.Color.id,
            name: colorName,
            hexCode: colorHexCode,
          },
          sizes: [],
        };
      }

      acc[colorName].sizes.push({
        id: variant.Size.id,
        name: variant.Size.name,
        stock: variant.stock,
        price: variant.price,
      });

      return acc;
    }, {});

    // Convert groupedVariants to an array
    const variantArray = Object.values(groupedVariants);

    // Create the response object
    const productDetails = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      variants: variantArray,
    };
    res.status(200).json(productDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching product details." });
  }
};

exports.getAllProducts = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch product by ID and include related variants, colors, and sizes
    const products = await Product.findAll({
      include: [
        {
          model: ProductVariant,
          include: [
            { model: Color, attributes: ["id", "name", "code"] }, // Include color details
            { model: Size, attributes: ["id", "name"] }, // Include size details
          ],
        },
      ],
    });

    if (!products) {
      return res.status(404).json({ error: "Product not found." });
    }

    const transformedProducts = transformProducts(products);

    // Group variants by color
    // const groupedVariants = product.ProductVariants.reduce((acc, variant) => {
    //   const colorName = variant.Color.name;
    //   const colorHexCode = variant.Color.hexCode;

    //   if (!acc[colorName]) {
    //     acc[colorName] = {
    //       color: {
    //         id: variant.Color.id,
    //         name: colorName,
    //         hexCode: colorHexCode,
    //       },
    //       sizes: [],
    //     };
    //   }

    //   acc[colorName].sizes.push({
    //     id: variant.Size.id,
    //     name: variant.Size.name,
    //     stock: variant.stock,
    //     price: variant.price,
    //   });

    //   return acc;
    // }, {});

    // Convert groupedVariants to an array
    // const variantArray = Object.values(groupedVariants);

    // Create the response object
    // const productDetails = {
    //   id: product.id,
    //   name: product.name,
    //   price: product.price,
    //   description: product.description,
    //   variants: variantArray,
    // };
    res.status(200).json(transformedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching product details." });
  }
};

function transformProducts(products) {
  return products.map((product) => {
    // Create an object to hold the transformed product
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      variants: [],
    };

    // Create a map to group sizes by color
    const colorMap = {};

    product.ProductVariants.forEach((variant) => {
      const colorId = variant.Color.id;
      const sizeInfo = {
        id: variant.Size.id,
        name: variant.Size.name,
        stock: variant.stock,
        price: variant.price,
      };

      // Check if the color already exists in the map
      if (!colorMap[colorId]) {
        // If not, add it with the color details and an empty sizes array
        colorMap[colorId] = {
          color: {
            id: variant.Color.id,
            name: variant.Color.name,
          },
          sizes: [],
        };
      }

      // Push the size info into the respective color's sizes array
      colorMap[colorId].sizes.push(sizeInfo);
    });

    // Convert the color map to an array of colors with sizes
    transformedProduct.variants = Object.values(colorMap);

    return transformedProduct;
  });
}
