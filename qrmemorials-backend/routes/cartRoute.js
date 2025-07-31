const express = require('express');
const router = express.Router();
const {getCart, addToCart, removeFromCart } = require('../contollers/cartController');
const { isApiAuthenticatedUser } = require('../middleware/auth'); // If you want to protect the route

// router.get("/cart", isApiAuthenticatedUser, getCart);
router.get("/cart/all-cart", isApiAuthenticatedUser, getCart);
router.post("/cart/add",isApiAuthenticatedUser, addToCart);
router.delete("/cart/delete/:cartId", isApiAuthenticatedUser, removeFromCart);

module.exports = router;
