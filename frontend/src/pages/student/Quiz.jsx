import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiXCircle, FiArrowLeft, FiAward } from 'react-icons/fi';
import { quizService } from '../../services';
import './Quiz.css';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const [questions, setQuestions] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuiz(quizId);
        if (res.data && res.data.success) {
          const qz = res.data.data;
          setQuizDetails(qz);
          setQuestions(qz.questions);
          setTimeLeft(qz.time_limit * 60);
        }
      } catch (error) {
        console.error("Failed to load quiz", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (quizId) fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && !isLoading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted && !isLoading && quizDetails) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, isLoading, quizDetails]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectAnswer = (answerId) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerId
    });
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    try {
      const res = await quizService.submitQuiz(quizId, selectedAnswers);
      if (res.data && res.data.success) {
        setScore(res.data.data.score);
        setResultData(res.data.data);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert("Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại!");
    }
  };

  if (isLoading) return <div className="quiz-container"><div style={{padding: 40}}>Đang tải bài kiểm tra...</div></div>;
  if (!quizDetails) return <div className="quiz-container"><div style={{padding: 40}}>Không tìm thấy bài kiểm tra.</div></div>;

  const currentQuestion = questions[currentQuestionIndex];

  if (isSubmitted) {
    return (
      <div className="quiz-container fade-in">
        <div className="quiz-result-card glass-card">
          <div className="result-icon">
            <FiAward size={64} color={score >= 80 ? '#10B981' : '#F59E0B'} />
          </div>
          <h2>Kết Quả Bài Thi</h2>
          <div className="score-circle" style={{ borderColor: score >= 80 ? '#10B981' : '#F59E0B' }}>
            {score}
            <span>Điểm</span>
          </div>
          <p className="result-message">
            {score >= 80 ? 'Tuyệt vời! Bạn đã hoàn thành xuất sắc bài kiểm tra.' : 'Cố gắng lên! Hãy ôn tập lại kiến thức nhé.'}
          </p>
          
          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-label">Số câu đúng</span>
              <span className="stat-value text-green">{resultData?.correctCount || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Số câu sai</span>
              <span className="stat-value text-red">{(resultData?.totalQuestions || 0) - (resultData?.correctCount || 0)}</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-secondary" onClick={() => navigate(-1)}>Trở về bài giảng</button>
            <button className="btn-primary" onClick={() => window.location.reload()}>Làm lại bài</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container fade-in">
      <div className="quiz-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>
        <h2 className="quiz-title">Bài Trắc Nghiệm Ôn Tập (Mã: {quizId})</h2>
        <div className={`quiz-timer ${timeLeft < 60 ? 'danger' : ''}`}>
          <FiClock size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="quiz-layout">
        <div className="quiz-main">
          <div className="question-card glass-card">
            <div className="question-number">Câu hỏi {currentQuestionIndex + 1} / {questions.length}</div>
            <h3 className="question-text">{currentQuestion.content}</h3>
            
            <div className="options-list">
              {currentQuestion.answers.map((ans) => (
                <div 
                  key={ans.id} 
                  className={`option-item ${selectedAnswers[currentQuestion.id] === ans.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(ans.id)}
                >
                  <div className="option-radio">
                    {selectedAnswers[currentQuestion.id] === ans.id && <div className="radio-dot"></div>}
                  </div>
                  <span className="option-text">{ans.content}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button 
              className="btn-secondary" 
              onClick={() => setCurrentQuestionIndex(prev => prev > 0 ? prev - 1 : prev)} 
              disabled={currentQuestionIndex === 0}
            >
              Câu trước
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button 
                className="btn-primary btn-submit" 
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < questions.length}
              >
                Nộp bài
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setCurrentQuestionIndex(prev => prev < questions.length - 1 ? prev + 1 : prev)}>Câu tiếp theo</button>
            )}
          </div>
        </div>

        <div className="quiz-sidebar glass-card">
          <h3>Bảng Câu Hỏi</h3>
          <div className="question-grid">
            {questions.map((q, index) => (
              <button 
                key={q.id} 
                className={`grid-item 
                  ${currentQuestionIndex === index ? 'current' : ''} 
                  ${selectedAnswers[q.id] !== undefined ? 'answered' : ''}
                `}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <div className="quiz-legend">
            <div className="legend-item">
              <span className="color-box answered"></span> Đã trả lời
            </div>
            <div className="legend-item">
              <span className="color-box current"></span> Đang xem
            </div>
            <div className="legend-item">
              <span className="color-box unread"></span> Chưa trả lời
            </div>
          </div>
          
          <button className="btn-submit-sidebar" onClick={handleSubmit}>
            Nộp bài ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
