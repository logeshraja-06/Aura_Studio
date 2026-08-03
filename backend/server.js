import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5001;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use by another process.`);
    console.error(`Please stop the process using port ${PORT} or set another PORT in .env.`);
    process.exit(1);
  }
});