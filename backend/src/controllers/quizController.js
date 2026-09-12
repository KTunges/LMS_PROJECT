const { Quiz, Question, Answer, LessonProgress } = require('../models');

// GET /api/quizzes/:quizId
exports.getQuizDetails = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [
            {
              model: Answer,
              as: 'answers',
              attributes: ['id', 'content'] // Exclude is_correct to prevent cheating!
            }
          ]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Bài kiểm tra không tồn tại' });
    }

    res.json({
      success: true,
      data: quiz
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes/:quizId/submit
exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // format: { questionId: answerId }
    const studentId = req.user.id;

    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Answer, as: 'answers' }]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Bài kiểm tra không tồn tại' });
    }

    let correctCount = 0;
    const resultDetails = []; // To return to user so they know what they got wrong
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach(q => {
      const studentAnswerId = answers[q.id];
      const correctAnswer = q.answers.find(a => a.is_correct);

      let isCorrect = false;
      if (correctAnswer && studentAnswerId === correctAnswer.id) {
        correctCount++;
        isCorrect = true;
      }

      resultDetails.push({
        questionId: q.id,
        isCorrect: isCorrect,
        correctAnswerId: correctAnswer ? correctAnswer.id : null,
        studentAnswerId: studentAnswerId
      });
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    // Save progress if they pass (optional logic, let's just mark complete if submitted for now)
    await LessonProgress.findOrCreate({
      where: { student_id: studentId, lesson_id: quiz.lesson_id },
      defaults: { is_completed: true }
    });
    // Actually, we should probably update it to completed if not already
    await LessonProgress.update(
      { is_completed: true },
      { where: { student_id: studentId, lesson_id: quiz.lesson_id } }
    );

    res.json({
      success: true,
      data: {
        score: score,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        details: resultDetails
      }
    });

  } catch (error) {
    next(error);
  }
};
