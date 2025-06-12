const Joi = require("joi");

const table_name = "packages";

const module_title = "Packages";
const module_single_title = "Packages";
const module_add_text = "Add";
const module_edit_text = "Edit";
const module_slug = "packages";
const module_layout = "layouts/main";

const insertSchema = Joi.object({
  title: Joi.string().required().max(255),
   price: Joi.number().precision(2).required(),
   features: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    })
  ).required(),
    image: Joi.string().required() // or optional depending on use case
});

module.exports = {
  table_name,
  insertSchema,
  module_title,
  module_single_title,
  module_add_text,
  module_edit_text,
  module_slug,
  module_layout,
};
