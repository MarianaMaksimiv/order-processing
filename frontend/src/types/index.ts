export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  productId: number;
  productName: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed';

export interface CreateOrderRequest {
  customerName: string;
  productId: number;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
} 