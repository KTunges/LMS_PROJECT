const { Notification } = require('../models');

/**
 * Creates a notification in DB and emits it via Socket.io
 * @param {Object} io - The Socket.io instance
 * @param {number} userId - Target user ID
 * @param {string} title - Notification title
 * @param {string} content - Notification content
 */
const sendNotification = async (io, userId, title, content) => {
  try {
    const notif = await Notification.create({
      user_id: userId,
      title,
      content,
      is_read: false
    });

    if (io) {
      io.to(`user_${userId}`).emit('new_notification', notif);
    }

    return notif;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

module.exports = { sendNotification };
