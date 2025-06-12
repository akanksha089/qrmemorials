const express = require('express');
const orderController = require('../contollers/orderController');
const router = express.Router();
const { isApiAuthenticatedUser } = require('../middleware/auth'); // If you want to protect the route
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post('/create-order', orderController.createOrder); // <== This is your main POST Order API
router.get('/orders',isAuthenticatedUser ,authorizeRoles("admin"), orderController.getAllOrders);
router.post('/add-shipping', isApiAuthenticatedUser ,orderController.addShippingAddress);
router.get('/shipping',isAuthenticatedUser ,authorizeRoles("admin"), orderController.getAllShippingAddresses);

router.post('/add-billing', isApiAuthenticatedUser ,orderController.addBillingAddress);
router.get('/billing',isAuthenticatedUser ,authorizeRoles("admin"), orderController.getAllBillingAddresses);

module.exports = router;
