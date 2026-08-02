import ContactMessage from '../models/ContactMessage.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.create(req.body);
    return successResponse(res, 201, 'Message sent successfully', contactMessage);
  } catch (error) {
    next(error);
  }
};