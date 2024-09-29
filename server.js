// server.js
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const sequelize = require("./config/database");
const modelAssociation = require("./config/modelsAssociation");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Start server
const PORT = process.env.PORT || 5000;

module.exports = app;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
