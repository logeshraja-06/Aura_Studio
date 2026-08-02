import Booking from '../models/Booking.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    return successResponse(res, 201, 'Booking submitted successfully', booking);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return successResponse(res, 200, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }
    return successResponse(res, 200, 'Booking retrieved successfully', booking);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, 400, 'Status must be one of: pending, confirmed, cancelled');
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    return successResponse(res, 200, `Booking status updated to ${status}`, booking);
  } catch (error) {
    next(error);
  }
};
