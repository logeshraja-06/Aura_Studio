import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Equipment from '../models/Equipment.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleEquipment = [
  {
    name: 'Sony Alpha A1 Master Body',
    category: 'camera',
    status: 'in-use',
    notes: '50.1MP Flagship, 8K 30p / 4K 120p, High-Speed Dual Card Slots',
  },
  {
    name: 'RED V-Raptor 8K VV Cinema Body',
    category: 'camera',
    status: 'available',
    notes: '8K VV 120fps Cinema Spec, Multi-Format Sensor, Anamorphic ready',
  },
  {
    name: 'Sony FX3 Cinema Line Camera',
    category: 'camera',
    status: 'in-use',
    notes: 'Full-Frame 4K 120p, S-Cinetone, Active Cooling, XLR Handle',
  },
  {
    name: 'Leica M11 Rangefinder (Black Chrome)',
    category: 'camera',
    status: 'available',
    notes: '60MP BSI CMOS Sensor, Artisanal Editorial Portraits',
  },
  {
    name: 'DJI Mavic 3 Cine (Apple ProRes 422 HQ)',
    category: 'drone',
    status: 'in-use',
    notes: 'Dual Hasselblad L2D-20c system, 4/3 CMOS, 1TB Built-in SSD',
  },
  {
    name: 'DJI Inspire 2 with Zenmuse X7 6K',
    category: 'drone',
    status: 'available',
    notes: 'Super 35mm Cinema Camera, Dual Operator Remote Control',
  },
  {
    name: '32-Bit Float Sound Recorder & Wireless Lav Mics',
    category: 'audio',
    status: 'in-use',
    notes: 'Zoom F6 Multitrack, Sennheiser AVX Digital Wireless Set',
  },
  {
    name: 'Rode NTG5 Shotgun Microphone & Boom Suite',
    category: 'audio',
    status: 'available',
    notes: 'Ultra-lightweight moisture-resistant shotgun mic',
  },
  {
    name: 'Profoto A10 Off-Camera Studio Strobe Kit',
    category: 'lighting',
    status: 'in-use',
    notes: 'AirTTL Transceiver, High-Speed Sync, Round Head Diffuser',
  },
  {
    name: 'Aputure LS 600d Pro Daylight LED Monolight',
    category: 'lighting',
    status: 'available',
    notes: '600W COB Daylight LED with Weatherproof Control Box',
  },
  {
    name: 'Profoto B10X Duo Location Kit',
    category: 'lighting',
    status: 'available',
    notes: '250Ws Cordless Location Flashes with Continuous Video Light',
  },
  {
    name: 'Atlas Mercury 42mm Anamorphic T2.2 Lens',
    category: 'camera',
    status: 'available',
    notes: '1.5x Squeeze Full Frame Anamorphic Prime',
  },
];

const seedEquipmentData = async () => {
  try {
    await connectDB();

    // Check count or clear
    const count = await Equipment.countDocuments();
    if (count === 0) {
      console.log('Seeding Equipment collection...');
      await Equipment.insertMany(sampleEquipment);
      console.log('Equipment collection seeded successfully!');
    } else {
      console.log(`Equipment collection already contains ${count} items. Skipping initial seed.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding equipment data:', error);
    process.exit(1);
  }
};

seedEquipmentData();
