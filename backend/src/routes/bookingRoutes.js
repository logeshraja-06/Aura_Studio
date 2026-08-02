import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { validateBookingRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Rate limiter: max 10 booking submissions per 15 minutes per IP
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many booking requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Client routes
router.post('/', bookingLimiter, validateBookingRequest, createBooking);

// Admin routes
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', updateBookingStatus);

export default router;