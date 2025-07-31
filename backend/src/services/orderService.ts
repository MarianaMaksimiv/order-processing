import { Order, OrderStatus, CreateOrderRequest } from '../types';
import { getProductById } from '../data/products';

class OrderService {
  private orders: Map<string, Order> = new Map();
  private statusTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  createOrder(request: CreateOrderRequest): Order {
    const product = getProductById(request.productId);
    if (!product) {
      throw new Error(`Product with id ${request.productId} not found`);
    }

    const order: Order = {
      id: this.generateOrderId(),
      customerName: request.customerName,
      productId: request.productId,
      productName: product.name,
      price: product.price,
      status: 'Pending',
      createdAt: new Date(),
    };

    this.orders.set(order.id, order);
    this.scheduleStatusUpdates(order.id);

    return order;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  deleteOrder(orderId: string): boolean {
    const order = this.orders.get(orderId);
    if (!order) {
      return false;
    }

    // Only allow deletion of completed orders
    if (order.status !== 'Completed') {
      throw new Error('Only completed orders can be deleted');
    }

    // Clear any pending timers
    const timer = this.statusTimers.get(orderId);
    if (timer) {
      clearTimeout(timer);
      this.statusTimers.delete(orderId);
    }

    this.orders.delete(orderId);
    return true;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }

    order.status = status;
    this.orders.set(orderId, order);
    return order;
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  private scheduleStatusUpdates(orderId: string): void {
    // After 2 seconds, change to "Processing"
    const processingTimer = setTimeout(() => {
      this.updateOrderStatus(orderId, 'Processing');
      this.emitStatusUpdate(orderId, 'Processing');
    }, 2000);

    // After 10 seconds total (8 more seconds), change to "Completed"
    const completedTimer = setTimeout(() => {
      this.updateOrderStatus(orderId, 'Completed');
      this.emitStatusUpdate(orderId, 'Completed');

      // Clean up timers
      this.statusTimers.delete(orderId);
    }, 10000);

    // Store timers for cleanup
    this.statusTimers.set(orderId, completedTimer);
  }

  private emitStatusUpdate(orderId: string, status: OrderStatus): void {
    // This will be called by the Socket.IO handler
    // The actual emission is handled in the main server file
    console.log(`Order ${orderId} status updated to: ${status}`);
  }

  // Method to be called by Socket.IO handler
  onStatusUpdate(callback: (orderId: string, status: OrderStatus) => void): void {
    this.emitStatusUpdate = callback;
  }
}

export const orderService = new OrderService();