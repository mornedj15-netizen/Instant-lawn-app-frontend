import axios from 'axios';
declare const global: any;

const API_URL = 'http://10.0.0.121:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = global.userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () => api.get('/auth/profile'),
};

// Order endpoints
export const orderAPI = {
  createOrder: (data: {
    lawnType: string;
    area: number;
    serviceType: string;
    deliveryDate: string;
    address: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  }) => api.post('/orders', data),

  getMyOrders: () => api.get('/orders/my-orders'),

  getAllOrders: () => api.get('/orders/all'),

  getBookedDates: () => api.get('/orders/booked-dates'),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),

  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`, {}),
};

export const inventoryAPI = {
  getInventory: () => api.get('/inventory'),
  updateStock: (id: string, change: number) =>
    api.put(`/inventory/${id}/stock`, { change }),
};

export default api;
