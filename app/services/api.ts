import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_URL = "http://10.0.0.121:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // field name must match your store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add token to requests automatically
// If the server can't be reached, show a clear message instead of a vague one
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.response = {
        data: {
          message:
            "Cannot reach the server. Check your internet connection and try again.",
        },
      };
    }
    return Promise.reject(error);
  },
);

// Auth endpoints
export const authAPI = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  getProfile: () => api.get("/auth/profile"),
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
  }) => api.post("/orders", data),

  getMyOrders: () => api.get("/orders/my-orders"),

  getAllOrders: () => api.get("/orders/all"),

  getBookedDates: (minutes?: number) =>
    api.get("/orders/booked-dates", { params: { minutes } }),

  getEstimate: (data: {
    latitude: number;
    longitude: number;
    area: number;
    serviceType: string;
  }) => api.post("/orders/estimate", data),

  updateOrderStatus: (id: string, status: string, restock?: boolean) =>
    api.put(`/orders/${id}/status`, { status, restock }),

  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`, {}),
};

export const inventoryAPI = {
  getInventory: () => api.get("/inventory"),
  updateStock: (id: string, change: number) =>
    api.put(`/inventory/${id}/stock`, { change }),
};

export default api;
