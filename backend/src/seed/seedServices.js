import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedServices = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected.');

    // Path to frontend/src/data/services.json
    const servicesFilePath = path.resolve(__dirname, '../../../frontend/src/data/services.json');
    if (!fs.existsSync(servicesFilePath)) {
      console.error(`Error: services.json not found at ${servicesFilePath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(servicesFilePath, 'utf-8');
    const servicesData = JSON.parse(rawData);

    console.log(`Clearing existing Service collection...`);
    await Service.deleteMany({});

    console.log(`Inserting ${servicesData.length} services into MongoDB...`);
    const insertedServices = await Service.insertMany(servicesData);

    console.log(`Successfully seeded ${insertedServices.length} services into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error.message);
    process.exit(1);
  }
};

seedServices();
