const Question = require('../models/questionModel');
const Quiz = require('../models/quizModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const db = require('../config/mysql_database');

// Table name for questions
const table_name = Question.table_name;
const module_single_title = Question.module_single_title;
const module_layout = Question.module_layout;
// Function to insert data into any table
const saveData = async (table_name, postData, next) => {
  try {
    // Insert data into the specified table
    const [insertData] = await db.query(`INSERT INTO ${table_name} SET ?`, postData);

    if (!insertData.insertId) {
      throw new ErrorHandler('Failed to insert data', 400);
    }

    // Retrieve the inserted record by its ID
    const [record] = await db.query(`SELECT * FROM ${table_name} WHERE id = ?`, [insertData.insertId]);

    if (!record || record.length === 0) {
      throw new ErrorHandler('No record found after insertion', 404);
    }

    return record[0]; // Return the first (and presumably only) record
  } catch (error) {
    return next(new ErrorHandler(error.message || 'Database operation failed', 500));
  }
};

// Create a new question and its answers
exports.createQuestion = catchAsyncErrors(async (req, res, next) => {
  try {
    // Validate input using Joi
    await Question.insertSchema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
  } catch (validationError) {
    return next(
      new ErrorHandler(
        validationError.details.map((d) => d.message),
        400
      )
    );
  }


  const { quizId, questionText, answerType, answers } = req.body;
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Basic input validation
  if (!quizId || !questionText || !Array.isArray(answers)) {
    return next(new ErrorHandler('Quiz ID, question, and answers are required', 400));
  }

  if (answers.length < 2 || answers.length > 4) {
    return next(new ErrorHandler('Each question must have between 2 and 4 answer options', 400));
  }

  const correctAnswersCount = answers.filter((ans) => ans.isCorrect).length;

  // Validate radio and checkbox answers
  if (answerType === 'radio' && correctAnswersCount !== 1) {
    return next(new ErrorHandler('Radio type questions must have exactly one correct answer', 400));
  }

  if (answerType === 'checkbox' && (correctAnswersCount < 1 || correctAnswersCount > 3)) {
    return next(new ErrorHandler('Checkbox type questions must have between 1 and 3 correct answers', 400));
  }

  try {
    // Ensure quiz exists before inserting a question
    const [quizzes] = await db.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);

    if (!quizzes || quizzes.length === 0) {
      return next(new ErrorHandler('Invalid quiz ID. The quiz does not exist.', 400));
    }

    // Insert question into the database
    const question = await saveData(
      table_name,
      {
        quizId: quizId, // Use the quizId from the request body
        questionText: questionText,
        answerType: answerType,
        created_at: createdAt,
        updated_at: createdAt,
      },
      next
    );

    // Insert answers into the database
    for (const answer of answers) {
      await saveData(
        'answers',
        {
          questionId: question.id,
          text: answer.text,
          isCorrect: answer.isCorrect,
          created_at: createdAt,
          updated_at: createdAt,
        },
        next
      );
    }
console.log('answeransweranswer', answers)
    // Response on success
    res.status(201).json({
      success: true,
      message: 'Question and answers added successfully',
      questionId: question.id,
      //answers: answers,
    });
    // res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
  } catch (error) {
    return next(new ErrorHandler(error.message || 'Failed to save question and answers', 500));
  }
});

exports.editQuestion = catchAsyncErrors(async (req, res, next) => {
  const blog = await QueryModel.findById(table_name, req.params.id, next);

  if (!blog) {
    return;
  }
  res.render(module_slug + "/edit", {
    layout: module_layout,
    title: module_single_title + " " + module_edit_text,
    blog,
    module_slug,
    activeCourses
  });
});

exports.updateQuestion = catchAsyncErrors(async (req, res, next) => {
  const { quizId, questionText, answerType, answers ,id} = req.body;

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');


 // Basic input validation
  if (!quizId || !questionText || !Array.isArray(answers)) {
    return next(new ErrorHandler('Quiz ID, question, and answers are required', 400));
  }

  if (answers.length < 2 || answers.length > 4) {
    return next(new ErrorHandler('Each question must have between 2 and 4 answer options', 400));
  }

  const correctAnswersCount = answers.filter((ans) => ans.isCorrect).length;

  // Validate radio and checkbox answers
  if (answerType === 'radio' && correctAnswersCount !== 1) {
    return next(new ErrorHandler('Radio type questions must have exactly one correct answer', 400));
  }

  if (answerType === 'checkbox' && (correctAnswersCount < 1 || correctAnswersCount > 3)) {
    return next(new ErrorHandler('Checkbox type questions must have between 1 and 3 correct answers', 400));
  }

  try {
    // Ensure quiz exists before inserting a question
    const [quizzes] = await db.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);

    if (!quizzes || quizzes.length === 0) {
      return next(new ErrorHandler('Invalid quiz ID. The quiz does not exist.', 400));
    }

    // Insert question into the database
    const question = await saveData(
      table_name,
      {
        quizId: quizId, // Use the quizId from the request body
        questionText: questionText,
        answerType: answerType,
        created_at: createdAt,
        updated_at: createdAt,
        user_id: req.user.id,
      },
      next
    );

    // Insert answers into the database
    for (const answer of answers) {
      await saveData(
        'answers',
        {
          questionId: question.id,
          text: answer.text,
          isCorrect: answer.isCorrect,
          created_at: createdAt,
          updated_at: createdAt,
        },
        next
      );
    }
    const blog = await QueryModel.findByIdAndUpdateData(
      table_name,
      req.params.id,
      updateData,
      next
    );
    // Response on success
    req.flash("msg_response", {
      status: 200,
      message: "Successfully updated " + module_single_title,
    });
    // res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
  } catch (error) {
    return next(new ErrorHandler(error.message || 'Failed to save question and answers', 500));
  }
 
});

exports.deleteQuestion = catchAsyncErrors(async (req, res, next) => {
  await QueryModel.findByIdAndDelete(table_name, req.params.id, next);

  req.flash("msg_response", {
    status: 200,
    message: "Successfully deleted " + module_single_title,
  });

  res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
});


exports.getSingleQuestion = catchAsyncErrors(async (req, res, next) => {
  const blog = await QueryModel.findById(table_name, req.params.id, next);

  if (!blog) {
    return;
  }
  res.render(module_slug + "/detail", {
    layout: module_layout,
    title: module_single_title,
    blog,
  });
});



exports.getQuestionsByQuizId = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 1;
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search || "";
  const filterQuery = req.query.filter || "";
  // Calculate offset for pagination
  const offset = (page - 1) * resultPerPage;
  const quizId = req.params.quizId;

  try {
    // Check if the quizId exists
    const [quizzes] = await db.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
    if (!quizzes || quizzes.length === 0) {
      return next(new ErrorHandler('Quiz not found', 404));
    }

    // Get all questions for the quizId
    const [questions] = await db.query('SELECT * FROM questions WHERE quizId = ?', [quizId]);

    if (questions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No questions found for this quiz',
        questions: [],
      });
    }

    // Fetch answers for each question
    for (let question of questions) {
      const [answers] = await db.query('SELECT * FROM answers WHERE questionId = ?', [question.id]);
      question.answers = answers; // Add the answers to each question object
    }

    // Respond with the list of questions and their answers
    res.status(200).json({
      success: true,
      message: 'Questions and answers fetched successfully',
      questions: questions,
    });
    res.render( "quizzes" + "/edit/:id", {
      layout: module_layout,
      title: "Quizzes",
      questions: questions,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || 'Failed to fetch questions and answers', 500));
  }
 
});
