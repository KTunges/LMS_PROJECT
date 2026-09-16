const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');

const getModel = (modelName = 'gemini-3.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

const aiController = {
  // 1. Chatbot (RAG based on lesson content)
  chat: async (req, res) => {
    try {
      const { message, context, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: 'Server missing GEMINI_API_KEY' });
      }

      const model = getModel();
      
      let systemPrompt = "Bạn là một trợ lý AI học tập nhiệt tình, thông minh của hệ thống LMS. Nhiệm vụ của bạn là giải đáp thắc mắc của học viên.";
      if (context) {
        systemPrompt += `\n\nDưới đây là ngữ cảnh của bài học hiện tại mà học viên đang hỏi:\n\"\"\"${context}\"\"\"\n\nHãy trả lời dựa trên ngữ cảnh này nếu phù hợp.`;
      }

      // Convert history to Gemini format (optional, keeping it simple for now)
      let formattedHistory = [];
      if (history && Array.isArray(history)) {
        formattedHistory = history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        }));
      }
      
      const chat = model.startChat({
        history: [
           { role: 'user', parts: [{ text: systemPrompt }] },
           { role: 'model', parts: [{ text: 'Đã rõ, tôi sẽ đóng vai trợ lý AI học tập và sử dụng ngữ cảnh bài học bạn cung cấp.' }] },
           ...formattedHistory
        ]
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return res.json({
        success: true,
        data: { reply: text }
      });
    } catch (error) {
      console.error('AI Chat Error Trace:', error);
      return res.status(500).json({ success: false, message: 'Lỗi khi gọi AI Chatbot', error: error.message, stack: error.stack });
    }
  },

  // 2. Summarize (Tóm tắt bài học)
  summarize: async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: 'Server missing GEMINI_API_KEY' });
      }

      const model = getModel();
      const prompt = `Hãy tóm tắt ngắn gọn, súc tích nội dung bài học sau thành 5-7 gạch đầu dòng những ý chính quan trọng nhất. Yêu cầu định dạng bằng Markdown đẹp mắt:\n\n${text}`;
      
      const result = await model.generateContent(prompt);
      const summary = await result.response.text();

      return res.json({
        success: true,
        data: { summary }
      });
    } catch (error) {
      console.error('AI Summarize Error:', error);
      return res.status(500).json({ success: false, message: 'Lỗi khi gọi AI Tóm tắt', error: error.message });
    }
  },

  // 3. Quiz Generator
  generateQuiz: async (req, res) => {
    try {
      const { text, numQuestions = 5 } = req.body;
      if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: 'Server missing GEMINI_API_KEY' });
      }

      const model = getModel();
      const prompt = `
Dựa vào nội dung văn bản dưới đây, hãy tạo ra đúng ${numQuestions} câu hỏi trắc nghiệm (multiple choice).
YÊU CẦU BẮT BUỘC: Bạn CHỈ ĐƯỢC PHÉP trả về một mảng JSON thuần túy (không bọc trong \`\`\`json, không kèm text nào khác) với cấu trúc như sau:
[
  {
    "question": "Nội dung câu hỏi?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]

Văn bản:
"""
${text}
"""
`;
      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();
      
      // Cleanup markdown block if AI still includes it
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let quizData = [];
      try {
        quizData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Lỗi parse JSON từ AI:", responseText);
        return res.status(500).json({ success: false, message: 'AI trả về định dạng không đúng', raw: responseText });
      }

      return res.json({
        success: true,
        data: quizData
      });
    } catch (error) {
      console.error('AI Quiz Gen Error:', error);
      return res.status(500).json({ success: false, message: 'Lỗi khi tạo Quiz tự động', error: error.message });
    }
  }
};

module.exports = aiController;
