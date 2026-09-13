import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiPlus, FiTrash2, FiPlay, FiPause, FiHelpCircle } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import api from '../../services/api';

const InteractiveQuestionModal = ({ lesson, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    video_timestamp: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, [lesson.id]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/teacher/lessons/${lesson.id}/questions`);
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const startAddQuestion = () => {
    if (!playedSeconds) {
      toast.warning('Hãy phát video đến đoạn bạn muốn thêm câu hỏi!');
      return;
    }
    setPlaying(false);
    setNewQuestion({
      content: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      video_timestamp: Math.floor(playedSeconds)
    });
    setIsAdding(true);
  };

  const handleSaveQuestion = async () => {
    if (!newQuestion.content || newQuestion.options.some(opt => !opt.trim())) {
      toast.warning('Vui lòng nhập đủ câu hỏi và 4 đáp án!');
      return;
    }

    try {
      const payload = {
        content: newQuestion.content,
        video_timestamp: newQuestion.video_timestamp,
        options: newQuestion.options,
        correct_answer: newQuestion.options[newQuestion.correct_answer] // string
      };
      const res = await api.post(`/teacher/lessons/${lesson.id}/questions`, payload);
      if (res.data.success) {
        toast.success('Thêm câu hỏi thành công');
        setIsAdding(false);
        fetchQuestions();
      }
    } catch (error) {
      toast.error('Lỗi khi thêm câu hỏi');
    }
  };

  const handleDelete = async (qId) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    try {
      await api.delete(`/teacher/questions/${qId}`);
      toast.success('Đã xóa câu hỏi');
      fetchQuestions();
    } catch (error) {
      toast.error('Lỗi xóa câu hỏi');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--theme-card-bg, #fff)', 
        color: 'var(--theme-text-main, #000)',
        width: '900px', maxWidth: '95vw', maxHeight: '90vh',
        borderRadius: '16px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--theme-border-color, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiHelpCircle color="#3b82f6" /> Quản lý Câu hỏi: {lesson.title}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--theme-text-muted)' }}>
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '600px' }}>
          {/* Left: Video */}
          <div style={{ flex: 3, background: '#000', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {lesson.url ? (
              <div style={{ flex: 1, position: 'relative' }}>
                <ReactPlayer
                  ref={playerRef}
                  url={lesson.url}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={playing}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onProgress={handleProgress}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1, origin: window.location.origin }
                    }
                  }}
                  onError={(e) => console.error("Video Error:", e)}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                Bài giảng chưa có Video URL hợp lệ
              </div>
            )}
            
            <div style={{ padding: '16px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontSize: '14px' }}>
                Thời gian hiện tại: <strong style={{ color: '#3b82f6' }}>{formatTime(playedSeconds)}</strong>
              </div>
              <button 
                onClick={startAddQuestion}
                disabled={!lesson.url}
                style={{
                  background: '#3b82f6', color: '#fff', border: 'none', 
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: lesson.url ? 1 : 0.5
                }}>
                <FiPlus /> Thêm Câu hỏi tại đây
              </button>
            </div>
          </div>

          {/* Right: Questions or Form */}
          <div style={{ flex: 2, borderLeft: '1px solid var(--theme-border-color, #e2e8f0)', display: 'flex', flexDirection: 'column', background: 'var(--theme-bg-main, #f8fafc)' }}>
            {isAdding ? (
              <div style={{ padding: '24px', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#3b82f6' }}>
                  Thêm câu hỏi lúc {formatTime(newQuestion.video_timestamp)}
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Nội dung câu hỏi</label>
                  <textarea 
                    value={newQuestion.content}
                    onChange={e => setNewQuestion({...newQuestion, content: e.target.value})}
                    rows={3}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--theme-border-color, #cbd5e1)', background: 'var(--theme-card-bg)', color: 'var(--theme-text-main)' }}
                    placeholder="Nhập câu hỏi..."
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Các đáp án (Chọn đáp án đúng)</label>
                  {newQuestion.options.map((opt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <input 
                        type="radio" 
                        name="correct_answer" 
                        checked={newQuestion.correct_answer === i}
                        onChange={() => setNewQuestion({...newQuestion, correct_answer: i})}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                      <input 
                        type="text" 
                        value={opt}
                        onChange={e => {
                          const newOpts = [...newQuestion.options];
                          newOpts[i] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOpts});
                        }}
                        placeholder={`Đáp án ${i + 1}`}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--theme-border-color, #cbd5e1)', background: 'var(--theme-card-bg)', color: 'var(--theme-text-main)' }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--theme-border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--theme-text-main)' }}>Hủy</button>
                  <button onClick={handleSaveQuestion} style={{ flex: 1, padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Lưu Câu hỏi</button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Danh sách câu hỏi ({questions.length})</h3>
                {loading ? <p>Đang tải...</p> : (
                  questions.length === 0 ? (
                    <p style={{ color: 'var(--theme-text-muted)', fontSize: '14px', fontStyle: 'italic' }}>Chưa có câu hỏi nào. Hãy phát video và thêm câu hỏi.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {questions.map(q => (
                        <div key={q.id} style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border-color)', borderRadius: '12px', padding: '16px', position: 'relative' }}>
                          <div style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                            {formatTime(q.video_timestamp)}
                          </div>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>{q.content}</p>
                          
                          <button 
                            onClick={() => handleDelete(q.id)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveQuestionModal;
