import mongoose from 'mongoose';
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

    const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@aurastudio.com').toLowerCase();
    const defaultPassword = process.env.ADMIN_PASSWORD || 'aura2026';

    let admin = null;
    let isMatch = false;

    // Query Mongoose if database is actively connected
    if (mongoose.connection.readyState === 1) {
      try {
        admin = await Admin.findOne({ email: email.toLowerCase() });
        if (admin) {
          isMatch = await bcrypt.compare(password, admin.passwordHash);
        }
      } catch (dbErr) {
        console.warn('[WARNING] Database query failed during login, trying fallback:', dbErr.message);
      }
    }

    // Fallback authentication for default admin credentials when DB is offline or user not yet in DB
    if (!admin && email.toLowerCase() === defaultEmail) {
      if (password === defaultPassword) {
        isMatch = true;
        admin = {
          _id: 'admin_master_id',
          name: 'Master Director',
          email: defaultEmail,
          role: 'admin',
        };
      }
    }

    if (!admin || !isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name || 'Master Director' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userPayload = {
      id: admin._id,
      name: admin.name || 'Master Director',
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

    if (mongoose.connection.readyState !== 1) {
      return errorResponse(res, 503, 'Database is offline. Staff registration requires active database connection.');
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
    if (mongoose.connection.readyState === 1 && req.admin?.id && req.admin.id !== 'admin_master_id') {
      const admin = await Admin.findById(req.admin.id).select('-passwordHash');
      if (admin) {
        return successResponse(res, 200, 'Current admin profile retrieved', admin);
      }
    }

    if (req.admin && req.admin.email) {
      return successResponse(res, 200, 'Current admin profile retrieved (session)', {
        id: req.admin.id || 'admin_master_id',
        name: req.admin.name || 'Master Director',
        email: req.admin.email,
        role: req.admin.role || 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      });
    }

    return errorResponse(res, 404, 'Admin user not found');
  } catch (error) {
    if (req.admin && req.admin.email) {
      return successResponse(res, 200, 'Current admin profile retrieved (session)', {
        id: req.admin.id || 'admin_master_id',
        name: req.admin.name || 'Master Director',
        email: req.admin.email,
        role: req.admin.role || 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      });
    }
    next(error);
  }
};
