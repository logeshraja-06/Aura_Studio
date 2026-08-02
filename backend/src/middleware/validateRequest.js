import { errorResponse } from '../utils/apiResponse.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-()]{7,15}$/;

/**
 * Validates incoming booking/inquiry form requests before passing to controller.
 */
export const validateBookingRequest = (req, res, next) => {
  const { name, email, phone, eventDate } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return errorResponse(res, 400, 'Full name is required');
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return errorResponse(res, 400, 'A valid email address is required');
  }

  if (!phone || !PHONE_REGEX.test(phone.toString().trim())) {
    return errorResponse(res, 400, 'A valid phone number is required (7 to 15 digits)');
  }

  if (!eventDate || typeof eventDate !== 'string' || !eventDate.trim()) {
    return errorResponse(res, 400, 'Event date is required');
  }

  next();
};

/**
 * Validates incoming general contact form requests before passing to controller.
 */
export const validateContactRequest = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return errorResponse(res, 400, 'Full name is required');
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return errorResponse(res, 400, 'A valid email address is required');
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return errorResponse(res, 400, 'Message body is required');
  }

  next();
};
