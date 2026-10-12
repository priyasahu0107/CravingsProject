import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Order events
  joinOrder(orderId: string) {
    this.socket?.emit('joinOrder', orderId);
  }

  leaveOrder(orderId: string) {
    this.socket?.emit('leaveOrder', orderId);
  }

  onNewOrder(callback: (data: any) => void) {
    this.socket?.on('newOrder', callback);
  }

  onOrderStatusUpdated(callback: (data: any) => void) {
    this.socket?.on('orderStatusUpdated', callback);
  }

  onRiderAssigned(callback: (data: any) => void) {
    this.socket?.on('riderAssigned', callback);
  }

  onRiderLocationUpdated(callback: (data: any) => void) {
    this.socket?.on('riderLocationUpdated', callback);
  }

  // Rider location
  emitRiderLocationUpdate(data: { orderId: string; latitude: number; longitude: number }) {
    this.socket?.emit('riderLocationUpdate', data);
  }

  // Cleanup
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
}

export const socketService = new SocketService();
