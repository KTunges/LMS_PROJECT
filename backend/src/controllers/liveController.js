const { LiveSession, ChatMessage, Course, User } = require('../models');

const liveController = {
  // GET /api/live/sessions/active
  getActiveSessions: async (req, res) => {
    try {
      const sessions = await LiveSession.findAll({
        where: { status: 'live' },
        include: [
          { model: Course, as: 'course', attributes: ['id', 'name'] },
          { model: User, as: 'teacher', attributes: ['id', 'full_name', 'avatar'] }
        ],
        order: [['started_at', 'DESC']]
      });
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // POST /api/live/sessions
  createSession: async (req, res) => {
    try {
      const { title, course_id } = req.body;
      const teacher_id = req.user.id;

      // Check if teacher already has a live session
      const existingSession = await LiveSession.findOne({
        where: { teacher_id, status: 'live' }
      });

      if (existingSession) {
        return res.status(400).json({ success: false, message: 'Bạn đang có một phiên trực tuyến chưa kết thúc.' });
      }

      const session = await LiveSession.create({
        title,
        course_id,
        teacher_id,
        status: 'live',
        started_at: new Date()
      });

      res.status(201).json({ success: true, data: session });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // PUT /api/live/sessions/:id/end
  endSession: async (req, res) => {
    try {
      const { id } = req.params;
      const session = await LiveSession.findOne({ where: { id, teacher_id: req.user.id } });

      if (!session) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phiên' });
      }

      session.status = 'ended';
      session.ended_at = new Date();
      await session.save();

      // Broadcast to socket that session ended
      const io = req.app.get('io');
      if (io) {
        io.to(`session_${id}`).emit('session-ended', { message: 'Phiên học đã kết thúc.' });
      }

      res.json({ success: true, message: 'Đã kết thúc phiên học.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // GET /api/live/sessions/:id/messages
  getSessionMessages: async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await ChatMessage.findAll({
        where: { session_id: id },
        include: [{ model: User, as: 'user', attributes: ['id', 'full_name', 'role'] }],
        order: [['created_at', 'ASC']]
      });

      // Map to frontend expected format
      const formatted = messages.map(m => ({
        id: m.id,
        session_id: m.session_id,
        user_id: m.user_id,
        name: m.user.full_name,
        role: m.user.role,
        message: m.message,
        created_at: m.created_at
      }));

      res.json({ success: true, data: formatted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
};

module.exports = liveController;
