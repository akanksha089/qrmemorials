const Joi = require('joi');

const table_name = "contacts";

const module_title = "Contacts";
const module_single_title = "Contact";
const module_add_text = "Add";
const module_edit_text = "Edit";
const module_slug = "contacts";
const module_layout = "layouts/main";

const insertSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required().max(255),
  phone: Joi.string().required(),
  project: Joi.string().required(),
  subject: Joi.string().required(),
  message: Joi.string().required()
});

module.exports = {table_name, insertSchema,module_title,module_single_title,module_add_text,module_edit_text,module_slug,module_layout}