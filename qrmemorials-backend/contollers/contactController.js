const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Joi = require('joi');
const db = require('../config/mysql_database');
const ErrorHandler = require('../utils/errorHandler');
const QueryModel = require("../models/queryModel");
const Model = require("../models/contactModel");
const sendEmail = require('../utils/sendEmail');

const table_name = Model.table_name;

// Joi schema for validation
const contactSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required().max(255),
  phone: Joi.string().required().pattern(/^[0-9]+$/).min(10).max(15), 
  project: Joi.string().required(),
  subject: Joi.string().required(),
  message: Joi.string().required()
});


exports.submitContactForm = catchAsyncErrors(async (req, res, next) => {
 
  try {
    await contactSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: false });
  } catch (error) {
    console.error('Validation Error:', error.details.map(d => d.message).join(', '));
    return next(new ErrorHandler(error.details.map(d => d.message).join(', '), 400));
  }
 
 // Fetch the admin_mail from the settings stored in the database
 const [settings] = await db.query('SELECT admin_mail FROM settings WHERE id = ?', [1]);

 if (!settings) {
     return next(new ErrorHandler('Admin email not found', 500));
 }

 const adminMail =  settings[0].admin_mail;
// console.log("admin" ,adminMail)
  try {
    const [existingContact] = await db.query(
      'SELECT * FROM contacts WHERE email = ? OR phone = ?',
      [req.body.email, req.body.phone]
    );

    if (existingContact.length > 0) {
      const errors = [];

      if (existingContact[0].email === req.body.email) {
        errors.push('Email already exists');
      }
      if (existingContact[0].phone === req.body.phone) {
        errors.push('Phone number already exists');
      }

      return next(new ErrorHandler(errors.join(', '), 400));
    }
  } catch (error) {
    console.error('Error checking existing contact:', error.message);
    return next(new ErrorHandler('Error checking existing contact', 500));
  }

  const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  const insertData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    project: req.body.project,
    subject: req.body.subject,
    message: req.body.message,
    date: created_at,
  };

  try {
    const results = await QueryModel.saveData(table_name, insertData, next);
    await sendEmail({
      email: req.body.email,
      subject: `Contact Form Submission Confirmation - ${req.body.subject}`,
      message :   `Dear ${req.body.name},

      Thank you for reaching out! We have received your inquiry about the following project:
      
      Project: ${req.body.project}
      Subject: ${req.body.subject}
      Message: ${req.body.message}
      
      We will get back to you shortly.

      Best regards,
      Digtal Quiz Solution
    `

   });
   //console.log('process.env.ADMIN_EMAIL', process.env.ADMIN_EMAIL)
    await sendEmail({
      email: adminMail,
      subject: `New Contact Form Submission - ${req.body.subject}`,
      message :   `New contact form submission:\n\nName: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone}\nProject: ${req.body.project}\nSubject: ${req.body.subject}\nMessage: ${req.body.message}\n\nSubmission time: ${created_at}`

   });

    res.status(201).json({ success: true, message: "Successfully added contact", data: results });
  } catch (error) {
    console.error('Error create contact:', error.message, error.stack);
    return next(new ErrorHandler('Error create contact', 500));
  }
});
