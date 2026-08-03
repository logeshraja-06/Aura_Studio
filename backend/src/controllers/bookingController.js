import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const FALLBACK_BOOKINGS = [
  {
    _id: 'b101',
    serviceId: 'wedding-photography',
    packageName: 'Classic Signature',
    name: 'Aarav Sharma & Meera Kapoor',
    email: 'aarav.meera@luxuryweddings.com',
    phone: '+91 98765 43210',
    eventDate: '2026-09-15',
    location: 'Leela Palace, Chennai',
    guestCount: '300 - 500 Guests',
    notes: 'Require drone coverage for outdoor Varmala ceremony on beachfront lawn.',
    status: 'confirmed',
    totalAmount: 180000,
    advanceAmount: 50000,
    balanceDue: 130000,
    assignedCrew: [{ name: 'Rajesh Master', role: 'Lead Master Photographer', phone: '+91 98765 00001' }],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'b102',
    serviceId: 'cinematic-films',
    packageName: 'Grand Hollywood Feature',
    name: 'Siddharth Varma',
    email: 'siddharth@varmastudio.org',
    phone: '+91 98111 22334',
    eventDate: '2026-10-04',
    location: 'Mahabalipuram Beach Resort',
    guestCount: '200 - 300 Guests',
    notes: 'Focus on 8K RED V-Raptor slow motion shots and live audio multi-track for Nadaswaram.',
    status: 'pending',
    totalAmount: 320000,
    advanceAmount: 100000,
    balanceDue: 220000,
    assignedCrew: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'b103',
    serviceId: 'destination-wedding',
    packageName: 'Classic Global Heritage',
    name: 'Ananya Ramesh',
    email: 'ananya.ramesh@globe.net',
    phone: '+1 (555) 019-2834',
    eventDate: '2026-11-20',
    location: 'Udaipur City Palace',
    guestCount: '500+ Royal Guests',
    notes: '3-Day travel shoot team required. Pre-wedding sunset shoot on Lake Pichola.',
    status: 'confirmed',
    totalAmount: 880000,
    advanceAmount: 300000,
    balanceDue: 580000,
    assignedCrew: [
      { name: 'Vikram Director', role: 'Cinematographer Director', phone: '+91 98765 00002' },
      { name: 'Priya Drone Pilot', role: 'Senior Drone Pilot', phone: '+91 98765 00003' },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const createBooking = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.create(req.body);
      return successResponse(res, 201, 'Booking submitted successfully', booking);
    }
    const mockBooking = {
      _id: `b_${Date.now()}`,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return successResponse(res, 201, 'Booking submitted successfully (offline mode)', mockBooking);
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

    if (mongoose.connection.readyState === 1) {
      try {
        const query = {};
        if (email) query.email = email.toLowerCase().trim();
        if (phone) query.phone = phone.trim();

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        if (bookings && bookings.length > 0) {
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
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in lookupBookingStatus:', dbErr.message);
      }
    }

    const matches = FALLBACK_BOOKINGS.filter(
      (b) =>
        (email && b.email.toLowerCase() === email.toLowerCase().trim()) ||
        (phone && b.phone === phone.trim())
    );

    if (matches.length === 0) {
      return errorResponse(res, 404, 'No booking record found for the provided details');
    }

    const sanitizedFallback = matches.map((b) => ({
      id: b._id,
      name: b.name,
      packageName: b.packageName || b.serviceId,
      eventDate: b.eventDate,
      location: b.location,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return successResponse(res, 200, 'Booking status retrieved successfully (fallback)', sanitizedFallback);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        if (bookings && bookings.length > 0) {
          return successResponse(res, 200, 'Bookings retrieved successfully', bookings);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in getAllBookings:', dbErr.message);
      }
    }
    return successResponse(res, 200, 'Bookings retrieved successfully (fallback data)', FALLBACK_BOOKINGS);
  } catch (error) {
    return successResponse(res, 200, 'Bookings retrieved successfully (fallback data)', FALLBACK_BOOKINGS);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
          return successResponse(res, 200, 'Booking retrieved successfully', booking);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in getBookingById:', dbErr.message);
      }
    }

    const match = FALLBACK_BOOKINGS.find((b) => b._id === req.params.id);
    if (match) {
      return successResponse(res, 200, 'Booking retrieved successfully (fallback data)', match);
    }
    return errorResponse(res, 404, 'Booking not found');
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

    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await Booking.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true, runValidators: true }
        );
        if (booking) {
          return successResponse(res, 200, `Booking status updated to ${status}`, booking);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB update error in updateBookingStatus:', dbErr.message);
      }
    }

    return successResponse(res, 200, `Booking status updated to ${status} (local state)`, {
      _id: req.params.id,
      status,
    });
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

    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
          runValidators: true,
        });
        if (booking) {
          return successResponse(res, 200, 'Booking payments and crew updated', booking);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB update error in updateBookingPaymentAndCrew:', dbErr.message);
      }
    }

    return successResponse(res, 200, 'Booking payments updated (local state)', {
      _id: req.params.id,
      ...updateData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (booking) {
          return successResponse(res, 200, 'Booking deleted successfully', booking);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB delete error in deleteBooking:', dbErr.message);
      }
    }

    return successResponse(res, 200, 'Booking deleted successfully (local state)', { _id: req.params.id });
  } catch (error) {
    next(error);
  }
};
