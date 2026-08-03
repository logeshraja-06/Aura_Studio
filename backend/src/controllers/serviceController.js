import mongoose from 'mongoose';
import Service from '../models/Service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Local static fallback services list
const FALLBACK_SERVICES = [
  {
    id: "wedding-photography",
    title: "Wedding Photography",
    category: "Signature",
    tagline: "Timeless editorial portraits & emotional candid captures",
    description: "Our signature wedding photography captures raw emotion, delicate details, and ethereal moments with high-fashion lighting and artistic compositions.",
    priceStarting: "₹1,20,000",
    estimatedCost: "₹1,20,000 – ₹2,50,000",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "cinematic-films",
    title: "Cinematic Wedding Films",
    category: "Video",
    tagline: "Hollywood-grade 4K wedding cinema & teaser trailers",
    description: "We craft emotionally gripping, film-look wedding movies using cinema cameras, color grading masteries, and custom audio mixing tailored to your story.",
    priceStarting: "₹1,50,000",
    estimatedCost: "₹1,50,000 – ₹3,20,000",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "destination-wedding",
    title: "Destination Wedding Story",
    category: "Signature",
    tagline: "Multi-day luxury destination wedding experiences",
    description: "Comprehensive multi-day travel coverage in Rajasthan, Bali, Amalfi, or Paris, capturing welcome dinners, rituals, and sunset celebrations.",
    priceStarting: "₹6,50,000",
    estimatedCost: "₹6,50,000 – ₹12,00,000",
    image: "https://images.unsplash.com/photo-1545232979-fbfd42e000b9?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "muhurtham",
    title: "Muhurtham (Sacred Mandap)",
    category: "Traditional",
    tagline: "Sacred wedding vows, Thali Kattu & Oonjal rituals",
    description: "Reverent and artistically exquisite coverage of sacred Nadaswaram tunes, Oonjal swing ceremony, Kanyadaan, Thali Kattu (Mangalya Dharanam), and Saptapadi.",
    priceStarting: "₹1,40,000",
    estimatedCost: "₹1,40,000 – ₹2,80,000",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding Shoot",
    category: "Editorial",
    tagline: "Romance stories set in exotic scenic locations",
    description: "Intimate, relaxed couple portraits in scenic mountains, historic palaces, or European cities, capturing your passion before the wedding frenzy.",
    priceStarting: "₹75,000",
    estimatedCost: "₹75,000 – ₹1,50,000",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
  }
];

export const getAllServices = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const services = await Service.find();
        if (services && services.length > 0) {
          return successResponse(res, 200, 'Services retrieved successfully', services);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in getAllServices, using fallback:', dbErr.message);
      }
    }
    return successResponse(res, 200, 'Services retrieved successfully (static fallback)', FALLBACK_SERVICES);
  } catch (error) {
    return successResponse(res, 200, 'Services retrieved successfully (static fallback)', FALLBACK_SERVICES);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const service = await Service.findOne({ id: req.params.id });
        if (service) {
          return successResponse(res, 200, 'Service retrieved successfully', service);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in getServiceById, using fallback:', dbErr.message);
      }
    }

    const fallbackMatch = FALLBACK_SERVICES.find((s) => s.id === req.params.id);
    if (fallbackMatch) {
      return successResponse(res, 200, 'Service retrieved successfully (static fallback)', fallbackMatch);
    }

    return errorResponse(res, 404, 'Service not found');
  } catch (error) {
    const fallbackMatch = FALLBACK_SERVICES.find((s) => s.id === req.params.id);
    if (fallbackMatch) {
      return successResponse(res, 200, 'Service retrieved successfully (static fallback)', fallbackMatch);
    }
    return errorResponse(res, 404, 'Service not found');
  }
};
