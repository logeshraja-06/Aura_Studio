import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

const seedAdminUser = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      console.error('Cannot seed admin user: MongoDB connection failed.');
      process.exit(1);
    }

    const email = (process.env.ADMIN_EMAIL || 'admin@aurastudio.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'aura2026';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin account [${email}] already exists. Updating password...`);
      const salt = await bcrypt.genSalt(10);
      existingAdmin.passwordHash = await bcrypt.hash(password, salt);
      await existingAdmin.save();
      console.log(`Updated admin [${email}] password successfully.`);
    } else {
      console.log(`Seeding super admin user [${email}]...`);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await Admin.create({
        name: 'Studio Director',
        email,
        passwordHash,
        role: 'admin',
      });
      console.log(`Super Admin user [${email}] created successfully!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdminUser();
