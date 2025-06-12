const Joi = require('joi');

const table_name = "questions";

const module_title = "Questions";
const module_single_title = "Question";
const module_add_text = "Add";
const module_edit_text = "Edit";
const module_slug = "questions";
const module_layout = "layouts/main";

const insertSchema = Joi.object({
    questionText: Joi.string().required()
});

module.exports = {table_name, insertSchema,module_title,module_single_title,module_add_text,module_edit_text,module_slug,module_layout}