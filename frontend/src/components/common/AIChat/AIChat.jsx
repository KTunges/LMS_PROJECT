import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiX, FiCpu } from 'react-icons/fi';
import { aiService } from '../../../services';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AIChat.css';

const AIChat = ({ contextTitle = '', contextText = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Chào bạn! Mình là Trợ lý AI. Mình có thể giúp gì cho bạn trong bài học này?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chatContext = `Bài học hiện tại: ${contextTitle}\n\n${contextText}`;
      const res = await aiService.chat(userMsg.content, chatContext, messages.slice(1)); // Send previous msgs
      if (res.data?.success) {
        setMessages(prev => [...prev, { role: 'model', content: res.data.data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Có lỗi xảy ra khi kết nối với AI.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`ai-chat-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="ai-chat-btn pulse-glow" onClick={() => setIsOpen(true)}>
          <FiCpu size={24} />
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-header-title">
              <FiCpu /> Trợ lý AI
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
          </div>
          
          <div className="ai-chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role === 'user' ? 'user-msg' : 'model-msg'}`}>
                {msg.role === 'model' ? (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {isTyping && (
              <div className="ai-message model-msg typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-footer">
            <input 
              type="text" 
              placeholder="Hỏi AI về bài học này..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={isTyping || !input.trim()}>
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
