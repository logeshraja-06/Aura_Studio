import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aura_cinematic_luxury_studio_jwt_secret_key_2026';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userPayload = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };

    return successResponse(res, 200, 'Authentication successful', {
      token,
      user: userPayload,
    });
  } catch (error) {
    next(error);
  }
};

export const registerStaff = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Name, email, and password are required');
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse(res, 400, 'An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const staff = await Admin.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'staff',
    });

    return successResponse(res, 201, 'Staff account created successfully', {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin) {
      return errorResponse(res, 404, 'Admin user not found');
    }
    return successResponse(res, 200, 'Current admin profile retrieved', admin);
  } catch (error) {
    next(error);
  }
};
