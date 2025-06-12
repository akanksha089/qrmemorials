const express = require('express');
const router = express.Router();
const cartController = require('../contollers/cartController');
const { isApiAuthenticatedUser } = require('../middleware/auth'); // If you want to protect the route

router.post("/cart/add",isApiAuthenticatedUser, cartController.addToCart);
router.get("/cart", isApiAuthenticatedUser, cartController.getCart);
router.delete("/cart/delete/:cartId", isApiAuthenticatedUser, cartController.removeFromCart);

module.exports = router;
