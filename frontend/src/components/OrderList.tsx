import React from 'react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onDeleteOrder?: (orderId: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onDeleteOrder }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Processing':
        return 'status-processing';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = (orderId: string) => {
    if (onDeleteOrder) {
      onDeleteOrder(orderId);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="order-list">
        <h2>Orders</h2>
        <p className="no-orders">No orders yet. Create your first order above!</p>
      </div>
    );
  }

  return (
    <div className="order-list">
      <h2>Orders ({orders.length})</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            {/* Delete button for completed orders */}
            {order.status === 'Completed' && onDeleteOrder && (
              <button
                className="delete-button"
                onClick={() => handleDelete(order.id)}
                title="Delete order"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
            
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`status ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="order-details">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Product:</strong> {order.productName}</p>
              <p><strong>Price:</strong> ${order.price}</p>
              <p><strong>Created:</strong> {formatDate(order.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 