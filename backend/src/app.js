import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';

import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// --- Core Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      const configuredClientUrl = (process.env.CLIENT_URL || '').trim().replace(/\/+$/, '');
      const requestOrigin = origin.trim().replace(/\/+$/, '');

      // Allow if matches CLIENT_URL (ignoring trailing slash), localhost, or any vercel.app domain
      if (
        !configuredClientUrl ||
        requestOrigin === configuredClientUrl ||
        requestOrigin === 'http://localhost:5173' ||
        requestOrigin === 'http://localhost:5001' ||
        requestOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, origin);
      }

      return callback(null, origin);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AURA backend is running' });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/equipment', equipmentRoutes);

// --- Error Handler (must be last) ---
app.use(errorHandler);

export default app;
