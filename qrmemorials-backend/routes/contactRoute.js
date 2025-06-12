const express = require('express');
const router = express.Router();
const contactController = require('../contollers/contactController'); // Ensure correct path

router.post('/contact', contactController.submitContactForm);

module.exports = router;
