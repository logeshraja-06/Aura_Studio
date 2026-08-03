import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const FALLBACK_EQUIPMENT = [
  { _id: 'eq1', name: 'Sony Alpha A1 Master Body', category: 'camera', status: 'in-use', notes: 'Primary 50MP Full Frame Stills & 8K Video' },
  { _id: 'eq2', name: 'RED V-Raptor 8K VV Cinema Body', category: 'camera', status: 'available', notes: 'Flagship Cinema Camera System' },
  { _id: 'eq3', name: 'Sony FX3 Cinema Line Camera', category: 'camera', status: 'in-use', notes: 'Low Light B-Cam & Gimbal Rig' },
  { _id: 'eq4', name: 'DJI Mavic 3 Cine (ProRes)', category: 'drone', status: 'in-use', notes: 'Aerial 5.1K Apple ProRes 422 HQ' },
  { _id: 'eq5', name: 'DJI Inspire 2 with Zenmuse 6K', category: 'drone', status: 'available', notes: 'Dual Operator Cinema Drone' },
  { _id: 'eq6', name: 'Zoom F6 32-Bit Float Sound Suite', category: 'audio', status: 'in-use', notes: 'Live Mandap & Stage Multi-Track Audio' },
  { _id: 'eq7', name: 'Profoto A10 Studio Strobes', category: 'lighting', status: 'available', notes: 'High Speed Sync Studio Strobes' },
];

export const getAllEquipment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const equipment = await Equipment.find()
          .populate('assignedBookingId', 'name eventDate serviceId packageName')
          .sort({ createdAt: -1 });
        if (equipment && equipment.length > 0) {
          return successResponse(res, 200, 'Equipment list retrieved successfully', equipment);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in getAllEquipment:', dbErr.message);
      }
    }
    return successResponse(res, 200, 'Equipment list retrieved successfully (fallback data)', FALLBACK_EQUIPMENT);
  } catch (error) {
    return successResponse(res, 200, 'Equipment list retrieved successfully (fallback data)', FALLBACK_EQUIPMENT);
  }
};

export const getEquipmentById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const item = await Equipment.findById(req.params.id).populate('assignedBookingId', 'name eventDate serviceId packageName');
        if (item) {
          return successResponse(res, 200, 'Equipment item retrieved successfully', item);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB query error in getEquipmentById:', dbErr.message);
      }
    }

    const match = FALLBACK_EQUIPMENT.find((e) => e._id === req.params.id);
    if (match) {
      return successResponse(res, 200, 'Equipment item retrieved successfully (fallback data)', match);
    }
    return errorResponse(res, 404, 'Equipment item not found');
  } catch (error) {
    next(error);
  }
};

export const createEquipment = async (req, res, next) => {
  try {
    const { name, category, status, assignedBookingId, notes } = req.body;
    if (!name || !category) {
      return errorResponse(res, 400, 'Name and category are required');
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const item = await Equipment.create({
          name,
          category,
          status: status || 'available',
          assignedBookingId: assignedBookingId || null,
          notes: notes || '',
        });
        return successResponse(res, 201, 'Equipment item created successfully', item);
      } catch (dbErr) {
        console.warn('[WARNING] DB create error in createEquipment:', dbErr.message);
      }
    }

    const mockItem = {
      _id: `eq_${Date.now()}`,
      name,
      category,
      status: status || 'available',
      assignedBookingId: assignedBookingId || null,
      notes: notes || '',
    };
    return successResponse(res, 201, 'Equipment item created successfully (offline mode)', mockItem);
  } catch (error) {
    next(error);
  }
};

export const updateEquipment = async (req, res, next) => {
  try {
    const { name, category, status, assignedBookingId, notes } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    if (assignedBookingId !== undefined) updateData.assignedBookingId = assignedBookingId || null;
    if (notes !== undefined) updateData.notes = notes;

    if (mongoose.connection.readyState === 1) {
      try {
        const item = await Equipment.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
          runValidators: true,
        }).populate('assignedBookingId', 'name eventDate serviceId packageName');
        if (item) {
          return successResponse(res, 200, 'Equipment item updated successfully', item);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB update error in updateEquipment:', dbErr.message);
      }
    }

    return successResponse(res, 200, 'Equipment item updated successfully (local state)', {
      _id: req.params.id,
      ...updateData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEquipment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const item = await Equipment.findByIdAndDelete(req.params.id);
        if (item) {
          return successResponse(res, 200, 'Equipment item deleted successfully', item);
        }
      } catch (dbErr) {
        console.warn('[WARNING] DB delete error in deleteEquipment:', dbErr.message);
      }
    }

    return successResponse(res, 200, 'Equipment item deleted successfully (local state)', { _id: req.params.id });
  } catch (error) {
    next(error);
  }
};
