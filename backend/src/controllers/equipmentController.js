import Equipment from '../models/Equipment.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAllEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find()
      .populate('assignedBookingId', 'name eventDate serviceId packageName')
      .sort({ createdAt: -1 });
    return successResponse(res, 200, 'Equipment list retrieved successfully', equipment);
  } catch (error) {
    next(error);
  }
};

export const getEquipmentById = async (req, res, next) => {
  try {
    const item = await Equipment.findById(req.params.id).populate('assignedBookingId', 'name eventDate serviceId packageName');
    if (!item) {
      return errorResponse(res, 404, 'Equipment item not found');
    }
    return successResponse(res, 200, 'Equipment item retrieved successfully', item);
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
    const item = await Equipment.create({
      name,
      category,
      status: status || 'available',
      assignedBookingId: assignedBookingId || null,
      notes: notes || '',
    });
    return successResponse(res, 201, 'Equipment item created successfully', item);
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

    const item = await Equipment.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('assignedBookingId', 'name eventDate serviceId packageName');

    if (!item) {
      return errorResponse(res, 404, 'Equipment item not found');
    }

    return successResponse(res, 200, 'Equipment item updated successfully', item);
  } catch (error) {
    next(error);
  }
};

export const deleteEquipment = async (req, res, next) => {
  try {
    const item = await Equipment.findByIdAndDelete(req.params.id);
    if (!item) {
      return errorResponse(res, 404, 'Equipment item not found');
    }
    return successResponse(res, 200, 'Equipment item deleted successfully', item);
  } catch (error) {
    next(error);
  }
};
