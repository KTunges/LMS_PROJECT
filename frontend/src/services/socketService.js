import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token, userId) {
    if (this.socket) {
      if (this.socket.connected) return;
      this.socket.connect();
    } else {
      this.socket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        if (userId) {
          this.identify(userId);
        }
      });
    }
  }

  identify(userId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('identify', userId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  offNotification(callback) {
    if (this.socket) {
      this.socket.off('new_notification', callback);
    }
  }
}

export default new SocketService();
