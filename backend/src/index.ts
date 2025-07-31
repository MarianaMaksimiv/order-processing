import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { orderService } from './services/orderService';
import { PRODUCTS } from './data/products';
import { CreateOrderRequest, ServerToClientEvents } from './types';

const app = express();
const server = createServer(app);
const io = new Server<ServerToClientEvents>(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"]
  }
});

const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

app.get('/api/orders', (req, res) => {
  const orders = orderService.getAllOrders();
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerName, productId }: CreateOrderRequest = req.body;

    if (!customerName || !productId) {
      return res.status(400).json({ error: 'Customer name and product ID are required' });
    }

    const order = orderService.createOrder({ customerName, productId });

    // Emit new order to all connected clients
    io.emit('orderCreated', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.delete('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;

    const deleted = orderService.deleteOrder(orderId);

    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Emit order deletion to all connected clients
    io.emit('orderDeleted', orderId);

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current orders to newly connected client
  const orders = orderService.getAllOrders();
  socket.emit('ordersList', orders);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Set up status update callback
orderService.onStatusUpdate((orderId, status) => {
  io.emit('orderStatusUpdate', { orderId, status });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});