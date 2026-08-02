import Service from '../models/Service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    return successResponse(res, 200, 'Services retrieved successfully', services);
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) {
      return errorResponse(res, 404, 'Service not found');
    }
    return successResponse(res, 200, 'Service retrieved successfully', service);
  } catch (error) {
    next(error);
  }
};
