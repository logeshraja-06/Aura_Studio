import express from 'express';
import rateLimit from 'express-rate-limit';
import { createContactMessage } from '../controllers/contactController.js';
import { validateContactRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Rate limiter: max 10 contact submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many contact submissions from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, validateContactRequest, createContactMessage);

export default router;
