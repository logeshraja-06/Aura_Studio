import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';

import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

// --- Core Middleware ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AURA backend is running' });
});

// --- Routes ---
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// --- Error Handler (must be last) ---
app.use(errorHandler);

export default app;
