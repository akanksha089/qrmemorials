const Model = require("../models/quizModel");
const insertSchema = Model.insertSchema;
const QueryModel = require("../models/queryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const db = require("../config/mysql_database");

const table_name = Model.table_name;
const module_title = Model.module_title;
const module_single_title = Model.module_single_title;
const module_add_text = Model.module_add_text;
const module_edit_text = Model.module_edit_text;
const module_slug = Model.module_slug;
const module_layout = Model.module_layout;

// Show add form
exports.addForm = catchAsyncErrors(async (req, res, next) => {
  const [courses] = await db.query("SELECT * FROM courses WHERE status = 1 ORDER BY id DESC");

  res.render(`${module_slug}/add`, {
    layout: module_layout,
    title: `${module_add_text} ${module_single_title}`,
    module_slug,
    courses,
  });
});

// Create quiz with questions
exports.createRecord = catchAsyncErrors(async (req, res, next) => {
  try {
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    const insertData = {
      title: req.body.title,
      course_id: req.body.courseId,
      quiz_time: req.body.quiz_time,
      created_at,
      updated_at: created_at,
    };

    const result = await QueryModel.saveData("quizzes", insertData);

    const quizId = result.insertId || result.id;
    if (!quizId) {
      throw new Error("Quiz insert failed — quizId is missing.");
    }

    const questions = JSON.parse(req.body.questions_json || '[]');

    for (const q of questions) {
      const questionData = {
        quiz_id: quizId,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        created_at,
        updated_at: created_at,
      };
      await QueryModel.saveData("quiz_questions", questionData);
    }
    console.log("Submitted questions:", req.body.questions);
    req.flash("msg_response", {
      status: 200,
      message: `Successfully added ${module_single_title}`,
    });

    res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
  } catch (error) {
    return next(
      new ErrorHandler(
        error.details ? error.details.map((d) => d.message) : error.message,
        400
      )
    );
  }
});

// Show edit form
exports.editForm = catchAsyncErrors(async (req, res, next) => {
  const quiz = await QueryModel.findById("quizzes", req.params.id, next);
  const [courses] = await db.query("SELECT * FROM courses WHERE status = 1 ORDER BY id DESC");
  const [questions] = await db.query("SELECT * FROM quiz_questions WHERE quiz_id = ?", [req.params.id]);

  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  res.render(`${module_slug}/edit`, {
    layout: module_layout,
    title: `${module_edit_text} ${module_single_title}`,
    blog: quiz,
    questions,
    module_slug,
    courses,
  });
});



exports.updateRecord = catchAsyncErrors(async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    // 1. Update quiz info
    const updateQuizData = {
      title: req.body.title,
      course_id: req.body.courseId,
      quiz_time: req.body.quiz_time,
      updated_at,
    };

    await QueryModel.findByIdAndUpdateData("quizzes", quizId, updateQuizData, next);

    // 2. Parse incoming questions
    const questions = JSON.parse(req.body.questions_json || '[]');

    // 3. Fetch existing question IDs from DB
    const [existingQuestions] = await db.query("SELECT id FROM quiz_questions WHERE quiz_id = ?", [quizId]);
    const existingIds = existingQuestions.map(q => q.id.toString());

    // 4. Track incoming question IDs
    const incomingIds = questions.filter(q => q.id).map(q => q.id.toString());

    // 5. Identify removed questions
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));

    // 6. Delete removed questions
    if (idsToDelete.length > 0) {
      await db.query("DELETE FROM quiz_questions WHERE id IN (?)", [idsToDelete]);
    }

    // 7. Insert new and update existing questions
    for (const q of questions) {
      const questionData = {
        quiz_id: quizId,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        updated_at,
      };

      if (q.id) {
        // Update existing question
        await QueryModel.findByIdAndUpdateData("quiz_questions", q.id, questionData, next);
      } else {
        // Insert new question
        questionData.created_at = updated_at;
        await QueryModel.saveData("quiz_questions", questionData);
      }
    }

    req.flash("msg_response", {
      status: 200,
      message: "Quiz updated successfully",
    });

    res.redirect(`/${process.env.ADMIN_PREFIX}/quizzes`);
  } catch (error) {
    console.error("Update error:", error);
    return next(new ErrorHandler(error.message || "Failed to update quiz", 500));
  }
});







// Delete quiz
exports.deleteRecord = catchAsyncErrors(async (req, res, next) => {
  await QueryModel.findByIdAndDelete("quizzes", req.params.id, next);
  await db.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [req.params.id]);

  req.flash("msg_response", {
    status: 200,
    message: `Successfully deleted ${module_single_title}`,
  });

  res.redirect(`/${process.env.ADMIN_PREFIX}/${module_slug}`);
});

// List all quizzes
exports.getAllRecords = catchAsyncErrors(async (req, res, next) => {
  const [quizzes] = await db.query(
    `SELECT q.*, c.title AS course_title 
     FROM quizzes q 
     LEFT JOIN courses c ON q.course_id = c.id 
     ORDER BY q.id DESC`
  );

  const message = req.flash("msg_response");

  res.render(`${module_slug}/index`, {
    layout: module_layout,
    title: module_title,
    blogs: quizzes,
    message,
    module_slug,
  });
});



exports.getAllQuizzesApi = catchAsyncErrors(async (req, res, next) => {
  const [quizzes] = await db.query(
    `SELECT 
    q.id,
    q.title,
    q.course_id,
    q.created_at,
    q.updated_at,
    c.title AS course_title,
    c.slug AS course_slug,
    COUNT(qq.id) AS question_count
 FROM quizzes q
 LEFT JOIN courses c ON q.course_id = c.id
 LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
 GROUP BY q.id
 ORDER BY q.id DESC`
  );

  res.status(200).json({
    success: true,
    quizzes,
  });
});

exports.showDetails = catchAsyncErrors(async (req, res, next) => {
  const quizId = req.params.id;

  const quiz = await QueryModel.findById('quizzes', quizId, next);

  const [courseRow] = await db.query(`SELECT title FROM courses WHERE id = ?`, [quiz.course_id]);
  const course_title = courseRow.length > 0 ? courseRow[0].title : 'Unknown';

  const [questions] = await db.query(`SELECT * FROM quiz_questions WHERE quiz_id = ?`, [quizId]);

  res.render('quizzes/detail', {
    layout: module_layout,
    title: `${quiz.title} - Details`,
    blog: {
      ...quiz,
      questions,
      course_title
    },
    module_slug,
  });
});


// GET quizzes and their questions by course slug
exports.getQuizzesByCourseSlug = catchAsyncErrors(async (req, res, next) => {
  const courseSlug = req.params.slug;

  // 1. Get course by slug
  const [courseRows] = await db.query("SELECT * FROM courses WHERE slug = ? LIMIT 1", [courseSlug]);
  const course = courseRows[0];

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }

  // 2. Get quizzes for the course
  const [quizzes] = await db.query("SELECT * FROM quizzes WHERE course_id = ?", [course.id]);

  // 3. For each quiz, get its questions
  const quizzesWithQuestions = [];

  for (const quiz of quizzes) {
    const [questions] = await db.query("SELECT * FROM quiz_questions WHERE quiz_id = ?", [quiz.id]);
    quizzesWithQuestions.push({
      ...quiz,
      questions,
    });
  }

  res.json({
    success: true,
    data: {
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
      },
      quizzes: quizzesWithQuestions,
    },
  });
});


// controller/quizController.js

exports.submitQuizAttempt = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const {
    quiz_id,
    quiz_title,
    total_questions,
    attempted,
    correct,
    wrong,
  } = req.body;

  if (!quiz_title || !quiz_id || !total_questions || attempted == null || correct == null || wrong == null) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  // Calculate score (percentage)
  const score = Math.round((correct / total_questions) * 100);
  
  // Determine certificate eligibility
  const certificate_awarded = score >= 75 ? 1 : 0;
  
  // Set certificate expiration (1 year from now) if eligible
  const certificate_expiration = certificate_awarded ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null;

  // Insert into quiz_attempts table
  await db.query(`
    INSERT INTO quiz_attempts (
      user_id,
      quiz_title,
      quiz_id,
      score,
      attempt_date,
      certificate_awarded,
      certificate_expiration,
      total_questions,
      attempted,
      correct,
      wrong
    ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
  `, [
    userId,
    quiz_title,
    quiz_id,
    score,
    certificate_awarded,
    certificate_expiration,
    total_questions,
    attempted,
    correct,
    wrong
  ]);

  return res.status(201).json({
    success: true,
    message: "Quiz attempt submitted successfully.",
    data: {
      quiz_id,
      quiz_title,
      score,
      certificate_awarded,
      certificate_expiration
    }
  });
});



exports.getUserQuizResults = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const [quizResults] = await db.query(`
    SELECT
      qa.quiz_id,
      q.title AS quiz_title,
      qa.attempt_date,
      qa.certificate_expiration,
      qa.total_questions,
      qa.attempted,
      qa.correct,
      qa.wrong,
      qa.score
    FROM
      quiz_attempts qa
    JOIN
      quizzes q ON qa.quiz_id = q.id
    WHERE
      qa.user_id = ?
    ORDER BY
      qa.attempt_date DESC
  `, [userId]);

  if (quizResults.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No quiz attempts found for this user.',
    });
  }

  // Calculate number of quizzes and certificates
  const totalQuizzes = quizResults.length;
  const certificatesEligible = quizResults.filter(q => q.score >= 75).length;
  const totalScore = quizResults.reduce((sum, q) => sum + q.score, 0);
  const avgScorePercent = (totalScore / totalQuizzes).toFixed(2); // in %

  const quizDetails = quizResults.map(quiz => ({
    quiz_id: quiz.quiz_id,
    quiz_title: quiz.quiz_title,
    attempt_date: quiz.attempt_date,
    certificate_expiration: quiz.certificate_expiration,
    total_questions: quiz.total_questions,
    attempted: quiz.attempted,
    correct: quiz.correct,
    wrong: quiz.wrong,
    score: quiz.score,
    certificate_eligible: quiz.score >= 75,
  }));

  res.status(200).json({
    success: true,
    data: {
      quizzes_attempted: totalQuizzes,
      certificates_awarded: certificatesEligible,
      average_score_percent: avgScorePercent,
      quiz_details: quizDetails
    }
  });
});

exports.getCertifiedQuizResults = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const [certifiedResults] = await db.query(`
    SELECT
      qa.quiz_id,
      q.title AS quiz_title,
      qa.attempt_date,
      qa.certificate_expiration,
      qa.total_questions,
      qa.attempted,
      qa.correct,
      qa.wrong,
      qa.score
    FROM
      quiz_attempts qa
    JOIN
      quizzes q ON qa.quiz_id = q.id
    WHERE
      qa.user_id = ?
      AND qa.score >= 75
    ORDER BY
      qa.attempt_date DESC
  `, [userId]);

  if (certifiedResults.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No certified quiz attempts found for this user.',
    });
  }

  const certifiedQuizDetails = certifiedResults.map(quiz => ({
    quiz_id: quiz.quiz_id,
    quiz_title: quiz.quiz_title,
    attempt_date: quiz.attempt_date,
    certificate_expiration: quiz.certificate_expiration,
    total_questions: quiz.total_questions,
    attempted: quiz.attempted,
    correct: quiz.correct,
    wrong: quiz.wrong,
    score: quiz.score,
    certificate_eligible: true
  }));

  res.status(200).json({
    success: true,
    data: {
      certified_quizzes_count: certifiedResults.length,
      certified_quiz_details: certifiedQuizDetails
    }
  });
});

exports.getCertificateByQuizId = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { quizId } = req.params;

  const [results] = await db.query(`
    SELECT
      qa.quiz_id,
      q.title AS quiz_title,
      qa.attempt_date,
      qa.certificate_expiration,
      qa.total_questions,
      qa.attempted,
      qa.correct,
      qa.wrong,
      qa.score
    FROM
      quiz_attempts qa
    JOIN
      quizzes q ON qa.quiz_id = q.id
    WHERE
      qa.user_id = ?
      AND qa.quiz_id = ?
    ORDER BY
      qa.attempt_date DESC
    LIMIT 1
  `, [userId, quizId]);

  if (results.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No attempt found for this quiz by the user.',
    });
  }

  const quiz = results[0];

  const isCertified = quiz.score >= 75;

  res.status(200).json({
    success: true,
    data: {
      quiz_id: quiz.quiz_id,
      quiz_title: quiz.quiz_title,
      attempt_date: quiz.attempt_date,
      certificate_expiration: quiz.certificate_expiration,
      total_questions: quiz.total_questions,
      attempted: quiz.attempted,
      correct: quiz.correct,
      wrong: quiz.wrong,
      score: quiz.score,
      certificate_eligible: isCertified
    }
  });
});

