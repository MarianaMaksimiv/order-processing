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
  createdAt: Date;
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

export interface ServerToClientEvents {
  orderCreated: (order: Order) => void;
  orderDeleted: (orderId: string) => void;
  orderStatusUpdate: (payload: { orderId: string; status: OrderStatus }) => void;
  ordersList: (orders: Order[]) => void;
}