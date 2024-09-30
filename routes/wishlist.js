// routes/auth.js
const express = require("express");
const router = express.Router();
const authMw = require("../middleware/authMiddleware");
const {
  addtowishlist,
  getUserWishlist,
} = require("../controllers/wishlistController");

router.post("/add", authMw, addtowishlist);
router.get("/", authMw, getUserWishlist);

module.exports = router;
