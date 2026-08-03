import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';

export const protectAdmin = (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Unauthorized: Access token missing or invalid');
  }

  try {
    const secret = process.env.JWT_SECRET || 'aura_cinematic_luxury_studio_jwt_secret_key_2026';
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Unauthorized: Token expired or invalid signature');
  }
};

export const requireAdminRole = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return errorResponse(res, 403, 'Forbidden: Super Admin privilege required');
  }
  next();
};
