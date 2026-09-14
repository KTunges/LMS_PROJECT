const { Notification } = require('../models');

// GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 20
    });
    
    const unreadCount = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifId = req.params.id;
    
    await Notification.update(
      { is_read: true },
      { where: { id: notifId, user_id: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
