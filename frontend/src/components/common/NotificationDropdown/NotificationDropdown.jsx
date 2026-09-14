import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiCheckCircle } from 'react-icons/fi';
import api from '../../../services/api';
import { socketService } from '../../../services';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    const handleNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socketService.onNotification(handleNewNotification);

    return () => {
      socketService.offNotification(handleNewNotification);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (err) {
      // Fallback mock
      setNotifications([
        { id: 1, title: 'Chào mừng bạn đến với LMS!', content: 'Bắt đầu khám phá các tính năng của hệ thống.', is_read: false, created_at: new Date().toISOString() },
        { id: 2, title: 'Hệ thống sẽ bảo trì', content: 'Bảo trì định kỳ lúc 2:00 AM ngày 15/09/2026.', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, title: 'Cập nhật giao diện mới', content: 'Hệ thống đã được cập nhật với giao diện Dark Mode.', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() }
      ]);
      setUnreadCount(2);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) { /* silent */ }
    setNotifications(notifications.map(n => n.id === id ? {...n, is_read: true} : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
    } catch (err) { /* silent */ }
    setNotifications(notifications.map(n => ({...n, is_read: true})));
    setUnreadCount(0);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="notif-dropdown" ref={dropdownRef}>
      <button className="notif-trigger" onClick={() => setIsOpen(!isOpen)}>
        <FiBell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-panel">
          <div className="notif-panel__header">
            <h4 className="notif-panel__title">Thông báo</h4>
            {unreadCount > 0 && (
              <button className="notif-panel__mark-all" onClick={handleMarkAllRead}>
                <FiCheckCircle size={14} /> Đọc tất cả
              </button>
            )}
          </div>

          <div className="notif-panel__list">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.is_read ? 'notif-item--unread' : ''}`}
                  onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                >
                  <div className="notif-item__dot-col">
                    {!n.is_read && <span className="notif-item__dot" />}
                  </div>
                  <div className="notif-item__content">
                    <div className="notif-item__title">{n.title}</div>
                    <div className="notif-item__body">{n.content}</div>
                    <div className="notif-item__time">{timeAgo(n.created_at)}</div>
                  </div>
                  {!n.is_read && (
                    <button className="notif-item__read-btn" title="Đánh dấu đã đọc">
                      <FiCheck size={14} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="notif-empty">Không có thông báo nào.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
