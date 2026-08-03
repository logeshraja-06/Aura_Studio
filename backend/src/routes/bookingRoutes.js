import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createBooking,
  lookupBookingStatus,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updateBookingPaymentAndCrew,
  deleteBooking,
} from '../controllers/bookingController.js';
import { validateBookingRequest } from '../middleware/validateRequest.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

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

// Client public routes
router.post('/', bookingLimiter, validateBookingRequest, createBooking);
router.post('/lookup', lookupBookingStatus);

// Protected Admin routes
router.get('/', protectAdmin, getAllBookings);
router.get('/:id', protectAdmin, getBookingById);
router.patch('/:id/status', protectAdmin, updateBookingStatus);
router.patch('/:id/payment', protectAdmin, updateBookingPaymentAndCrew);
router.delete('/:id', protectAdmin, deleteBooking);

export default router;