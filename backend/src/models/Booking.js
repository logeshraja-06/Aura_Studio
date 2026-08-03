import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true },
    tierName: String,
    packageName: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventDate: String,
    location: String,
    guestCount: String,
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    // Payment Tracking Fields
    totalAmount: { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },

    // Staff / Crew Assignment
    assignedCrew: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Lead Photographer' },
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
