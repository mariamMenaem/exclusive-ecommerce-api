// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();
const { Sequelize } = require("sequelize");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res
        .status(400)
        .json({ data: null, status: 400, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      status: 200,
      data: { token },
      message: "user created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      data: null,
      message: "server error: " + error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find user by email or phone
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ data: null, status: 400, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ data: null, status: 400, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with token
    res.json({
      status: 200,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
      message: "Token generated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      data: null,
      message: "server error: " + err.message,
    });
  }
};
