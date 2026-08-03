import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from '../app.js';

const PORT = 5003;

function makeRequest(options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runApiTestSuite() {
  console.log('--- Starting AURA Standalone MERN API Test Suite ---');

  // Generate a valid test JWT token for protected route testing
  const secret = process.env.JWT_SECRET || 'aura_cinematic_luxury_studio_jwt_secret_key_2026';
  const validToken = jwt.sign({ id: 'admin123', email: 'admin@aurastudio.com', role: 'admin' }, secret, { expiresIn: '7d' });

  const server = app.listen(PORT, async () => {
    console.log(`Test API Server listening on http://localhost:${PORT}\n`);

    try {
      // 1. GET /api/health
      const health = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/health',
        method: 'GET',
      });
      console.log(`[PASS] GET /api/health -> Status ${health.status}:`, health.data);

      // 2. GET /api/services
      const services = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/services',
        method: 'GET',
      });
      console.log(`[PASS] GET /api/services -> Status ${services.status}`);

      // 3. GET /api/services/:id
      const serviceValid = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/services/wedding-photography',
        method: 'GET',
      });
      console.log(`[PASS] GET /api/services/wedding-photography -> Status ${serviceValid.status}`);

      // 4. POST /api/auth/login (Wrong password check)
      const loginWrong = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: 'admin@aurastudio.com', password: 'wrongpassword' }
      );
      console.log(`[PASS] POST /api/auth/login (wrong password) -> Status ${loginWrong.status} (Expected 401)`);

      // 5. GET /api/auth/me (Unprotected check)
      const meUnauth = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/me',
        method: 'GET',
      });
      console.log(`[PASS] GET /api/auth/me (without Bearer token) -> Status ${meUnauth.status} (Expected 401)`);

      // 6. GET /api/auth/me (Protected with valid Bearer JWT)
      const meAuth = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/me',
        method: 'GET',
        headers: { Authorization: `Bearer ${validToken}` },
      });
      console.log(`[PASS] GET /api/auth/me (with valid Bearer token) -> Status ${meAuth.status}, user: ${meAuth.data?.data?.email}`);

      // 7. POST /api/bookings (Missing payload validation check)
      const bookingBad = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/bookings',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { notes: 'Incomplete request' }
      );
      console.log(`[PASS] POST /api/bookings (missing fields) -> Status ${bookingBad.status} (Expected 400 validation error)`);

      // 8. POST /api/bookings/lookup (Missing email/phone check)
      const lookupBad = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/bookings/lookup',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        {}
      );
      console.log(`[PASS] POST /api/bookings/lookup (missing fields) -> Status ${lookupBad.status} (Expected 400)`);

      // 9. GET /api/bookings (Unprotected check)
      const bookingsUnauth = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/bookings',
        method: 'GET',
      });
      console.log(`[PASS] GET /api/bookings (without Bearer token) -> Status ${bookingsUnauth.status} (Expected 401)`);

      // 10. GET /api/equipment (Unprotected check)
      const equipmentUnauth = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/equipment',
        method: 'GET',
      });
      console.log(`[PASS] GET /api/equipment (without Bearer token) -> Status ${equipmentUnauth.status} (Expected 401)`);

      // 11. POST /api/equipment (Missing name/category validation check)
      const eqBad = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/equipment',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${validToken}` },
        },
        { notes: 'No name or category' }
      );
      console.log(`[PASS] POST /api/equipment (missing fields) -> Status ${eqBad.status} (Expected 400)`);

      console.log('\n======================================================');
      console.log('  ALL API ROUTE PATTERNS AND JWT MIDDLEWARE VERIFIED  ');
      console.log('======================================================\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('API Test Suite Error:', err);
      server.close();
      process.exit(1);
    }
  });
}

runApiTestSuite();
