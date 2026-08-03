import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['camera', 'drone', 'audio', 'lighting'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'in-use', 'maintenance'],
      default: 'available',
    },
    assignedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Equipment', equipmentSchema);
