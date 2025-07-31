import React, { useState, useEffect } from 'react';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { socketService } from './services/socket';
import { api } from './services/api';
import { Order, CreateOrderRequest, OrderStatusUpdate } from './types';
import './App.css';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Load initial orders
    const loadOrders = async () => {
      try {
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to load orders');
      }
    };

    loadOrders();

    // Set up WebSocket listeners
    socketService.onOrdersList((ordersList) => {
      setOrders(ordersList);
    });

    socketService.onOrderCreated((newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });

    socketService.onOrderStatusUpdate((update: OrderStatusUpdate) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === update.orderId
            ? { ...order, status: update.status }
            : order
        )
      );
    });

    socketService.onOrderDeleted((orderId) => {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    });

    // Cleanup on unmount
    return () => {
      socketService.offOrdersList();
      socketService.offOrderCreated();
      socketService.offOrderStatusUpdate();
      socketService.offOrderDeleted();
      socketService.disconnect();
    };
  }, []);

  const handleSubmitOrder = async (orderData: CreateOrderRequest) => {
    setIsSubmitting(true);
    setError('');

    try {
      await api.createOrder(orderData);
      // The new order will be added via WebSocket
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await api.deleteOrder(orderId);
      // The order deletion will be handled via WebSocket
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Order Processing System</h1>
        <p>Create orders and watch them update in real-time!</p>
      </header>

      <main className="App-main">
        {error && <div className="error-message">{error}</div>}

        <OrderForm
          onSubmit={handleSubmitOrder}
          isSubmitting={isSubmitting}
        />

        <OrderList
          orders={orders}
          onDeleteOrder={handleDeleteOrder}
        />
      </main>
    </div>
  );
}

export default App;