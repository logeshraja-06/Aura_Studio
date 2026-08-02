import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
  name: String,
  price: String,
  coverage: String,
  deliverables: String,
});

const serviceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: String,
    icon: String,
    tagline: String,
    description: String,
    image: String,
    priceStarting: String,
    estimatedCost: String,
    teamSize: String,
    equipment: [String],
    tiers: [tierSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
