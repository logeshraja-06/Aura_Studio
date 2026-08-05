const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  // Read stored JWT token
  const token = localStorage.getItem('aura_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (res.status === 405) {
          throw new Error('Backend API is not reachable on Vercel. Please set VITE_API_BASE_URL in Vercel Settings to your deployed backend URL and trigger a Redeploy.');
        }
        if (res.status === 502 || res.status === 504) {
          throw new Error('Backend API server is offline or unreachable on port 5001. Please start backend with "npm run dev:backend".');
        }
        data = { message: text || `HTTP ${res.status}: ${res.statusText}` };
      }
    }

    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/bookings/lookup')) {
      // Auto-logout on token expiration or 401 Unauthorized
      localStorage.removeItem('aura_admin_token');
      localStorage.removeItem('aura_admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login?session_expired=1';
      }
    }

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

// --- Auth API ---
export const loginApi = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getMeApi = () => request('/auth/me');

// --- Public Client Lookup API ---
export const lookupBookingStatusApi = (email, phone) =>
  request('/bookings/lookup', {
    method: 'POST',
    body: JSON.stringify({ email, phone }),
  });

// --- Bookings API ---
export const fetchBookings = () => request('/bookings');
export const createBooking = (bookingData) =>
  request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
export const updateBookingStatus = (id, status) =>
  request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
export const updateBookingPaymentAndCrewApi = (id, data) =>
  request(`/bookings/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
export const deleteBookingApi = (id) =>
  request(`/bookings/${id}`, {
    method: 'DELETE',
  });

// --- Contact API ---
export const createContact = (contactData) =>
  request('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });

// --- Equipment API ---
export const fetchEquipment = () => request('/equipment');
export const createEquipment = (equipmentData) =>
  request('/equipment', {
    method: 'POST',
    body: JSON.stringify(equipmentData),
  });
export const updateEquipment = (id, equipmentData) =>
  request(`/equipment/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(equipmentData),
  });
export const deleteEquipment = (id) =>
  request(`/equipment/${id}`, {
    method: 'DELETE',
  });
