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

export const lookupBookingStatus = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return errorResponse(res, 400, 'Please provide an email or phone number to look up your booking');
    }

    const query = {};
    if (email) query.email = email.toLowerCase().trim();
    if (phone) query.phone = phone.trim();

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    if (!bookings || bookings.length === 0) {
      return errorResponse(res, 404, 'No booking record found for the provided details');
    }

    // Return client-safe payload (excluding sensitive internal notes)
    const sanitized = bookings.map((b) => ({
      id: b._id,
      name: b.name,
      packageName: b.packageName || b.serviceId,
      eventDate: b.eventDate,
      location: b.location,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return successResponse(res, 200, 'Booking status retrieved successfully', sanitized);
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

export const updateBookingPaymentAndCrew = async (req, res, next) => {
  try {
    const { totalAmount, advanceAmount, assignedCrew } = req.body;
    const updateData = {};

    if (totalAmount !== undefined) updateData.totalAmount = Number(totalAmount) || 0;
    if (advanceAmount !== undefined) updateData.advanceAmount = Number(advanceAmount) || 0;

    const tot = updateData.totalAmount !== undefined ? updateData.totalAmount : 0;
    const adv = updateData.advanceAmount !== undefined ? updateData.advanceAmount : 0;
    updateData.balanceDue = Math.max(0, tot - adv);

    if (assignedCrew !== undefined) updateData.assignedCrew = assignedCrew;

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    return successResponse(res, 200, 'Booking payments and crew updated', booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }
    return successResponse(res, 200, 'Booking deleted successfully', booking);
  } catch (error) {
    next(error);
  }
};
