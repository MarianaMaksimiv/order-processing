import { io, Socket } from 'socket.io-client';
import { Order, OrderStatusUpdate } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io('http://localhost:4000');
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onOrdersList(callback: (orders: Order[]) => void): void {
    if (this.socket) {
      this.socket.on('ordersList', callback);
    }
  }

  onOrderCreated(callback: (order: Order) => void): void {
    if (this.socket) {
      this.socket.on('orderCreated', callback);
    }
  }

  onOrderStatusUpdate(callback: (update: OrderStatusUpdate) => void): void {
    if (this.socket) {
      this.socket.on('orderStatusUpdate', callback);
    }
  }

  onOrderDeleted(callback: (orderId: string) => void): void {
    if (this.socket) {
      this.socket.on('orderDeleted', callback);
    }
  }

  offOrdersList(): void {
    if (this.socket) {
      this.socket.off('ordersList');
    }
  }

  offOrderCreated(): void {
    if (this.socket) {
      this.socket.off('orderCreated');
    }
  }

  offOrderStatusUpdate(): void {
    if (this.socket) {
      this.socket.off('orderStatusUpdate');
    }
  }

  offOrderDeleted(): void {
    if (this.socket) {
      this.socket.off('orderDeleted');
    }
  }
}

export const socketService = new SocketService(); 