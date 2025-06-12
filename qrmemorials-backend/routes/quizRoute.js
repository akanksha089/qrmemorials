const express = require('express');
const router = express.Router();
const quizController = require('../contollers/quizController');
const { isApiAuthenticatedUser } = require('../middleware/auth'); // If you want to protect the route

router.get("/quizzes",  quizController.getAllRecords);
router.get("/quizzes/add",  quizController.addForm);
router.post("/quizzes/create",  quizController.createRecord);
router.get("/quizzes/edit/:id",  quizController.editForm);
router.post("/quizzes/update/:id",  quizController.updateRecord);
router.get("/quizzes/delete/:id",  quizController.deleteRecord);
router.get("/quizzes/view/:id", quizController.showDetails); // or whatever path you're using
router.get('/api-quizzes', isApiAuthenticatedUser, quizController.getAllQuizzesApi);
router.post('/quiz-submit', isApiAuthenticatedUser, quizController.submitQuizAttempt);
router.get('/quiz-results', isApiAuthenticatedUser, quizController.getUserQuizResults);
router.get('/course/:slug', quizController.getQuizzesByCourseSlug);
router.get('/certified-quizzes', isApiAuthenticatedUser, quizController.getCertifiedQuizResults);
router.get('/certified-quizzes/:quizId', isApiAuthenticatedUser, quizController.getCertificateByQuizId);


module.exports = router;
