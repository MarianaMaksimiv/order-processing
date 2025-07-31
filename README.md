# Order Processing System

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Socket.IO client for real-time communication
- Modern CSS with responsive design and professional color scheme

### Backend
- Node.js with Express
- TypeScript for type safety
- Socket.IO for WebSocket communication
- Automatic order status progression

## Project Structure

```
order-processing/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API and Socket.IO services
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── services/        # Business logic services
│   │   ├── data/           # Static data (products)
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
└── package.json             # Root package.json for workspace
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both frontend and backend in development mode:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:4000
   - Frontend development server on http://localhost:3000 (or 3001 if 3000 is busy)

### Manual Setup (Alternative)

If you prefer to run services separately:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## How It Works

### Order Lifecycle
1. **Order Creation**: User submits an order with customer name and product selection
2. **Pending Status**: Order starts with "Pending" status
3. **Automatic Processing**: After 2 seconds, status automatically changes to "Processing"
4. **Completion**: After 8 more seconds (10 seconds total), status changes to "Completed"
5. **Deletion**: Completed orders can be removed using the delete icon

### Real-time Updates
- All status changes are broadcast to all connected clients via WebSockets
- No page refresh required to see updates
=

### API Endpoints

**GET /api/products**
- Returns list of available products

**GET /api/orders**
- Returns all orders

**POST /api/orders**
- Creates a new order
- Body: `{ customerName: string, productId: number }`

**DELETE /api/orders/:orderId**
- Deletes a completed order
- Only completed orders can be deleted

### WebSocket Events

**Client → Server:**
- `connection`: Client connects to server

**Server → Client:**
- `ordersList`: Initial list of all orders
- `orderCreated`: New order has been created
- `orderStatusUpdate`: Order status has changed
- `orderDeleted`: Order has been deleted

## Available Products

The system includes these predefined products:
- **Laptop** - $999
- **Phone** - $699
- **Headphones** - $199
- **Tablet** - $499



## Development

### Building for Production

**Build both applications:**
```bash
npm run build
```

**Build individually:**
```bash
npm run build:frontend
npm run build:backend
```

### Running Production Builds

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```
