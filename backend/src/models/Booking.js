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
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
