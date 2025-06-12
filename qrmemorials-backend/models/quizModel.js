// models/quizModel.js

const Joi = require('joi');
const table_name = "quizzes";

const module_title = "Quizzes";
const module_single_title = "Quiz";
const module_add_text = "Add";
const module_edit_text = "Edit";
const module_slug = "quizzes";
const module_layout = "layouts/main";

const insertSchema = Joi.object({
  courseId: Joi.number().required(),
  question: Joi.string().required().max(500),
  option_a: Joi.string().required().max(255),
  option_b: Joi.string().required().max(255),
  option_c: Joi.string().required().max(255),
  option_d: Joi.string().required().max(255),
  correct_answer: Joi.string().valid('a', 'b', 'c', 'd').required(),
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
